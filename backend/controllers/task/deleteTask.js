import s3 from "../../config/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import redisClient from "../../config/redis.js";

// Import your newly created service infrastructure
import { findTaskImageForCleanup, executeTaskDeletion } from "../../services/task/deleteTaskService.js";

export const deleteTask = async (req, res, next) => {
  const { uuid } = req.params;
  const user_id = req.user.id;
  
  try {
    // Execution Layer 1: Query the task image data using the service layer
    const taskRecord = await findTaskImageForCleanup(uuid, user_id);
    if (!taskRecord) {
      return res.status(403).json({ error: "You are unauthorized or task not found" });
    }

    const imgUrl = taskRecord.img;

    // AWS S3 Asset Clean Up Pipeline
    if (imgUrl) {
      const bucketIdentifier = `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
      const filePath = imgUrl.split(bucketIdentifier)[1];

      if (filePath) {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: filePath
        }));
        console.log(`AWS S3 cleanup success: ${filePath}`);
      }
    }
    
    // Execution Layer 2: Run the row deletion statement through the service layer
    const deletedCount = await executeTaskDeletion(uuid, user_id);
    if (deletedCount === 0) {
      return res.status(403).json({ error: "You are unauthorized" });
    }

    // Redis Cache Invalidation Pipeline
    const cacheKey = `tasks_feed:${user_id}`;
    await redisClient.del(cacheKey);
    console.log("🗑️ Redis Cache cleared for user:", user_id);

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
