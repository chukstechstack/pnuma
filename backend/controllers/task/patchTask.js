import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../config/s3.js";
import redisClient from "../../config/redis.js";

// Import your newly created dynamic service workers
import { fetchOldTaskImage, executeDynamicTaskUpdate } from "../../services/task/patchTaskService.js";

export const patchTask = async (req, res, next) => {
  const { uuid } = req.params;
  const user_id = req.user.id;
  let newUrl = null;

  try {
    // Process image buffer changes if a new file is sent
    if (req.file) {
      // 1. Service Layer Execution: Lookup the old image target for asset cleanup
      const oldImgRecord = await fetchOldTaskImage(uuid, user_id);
      const oldImgUrl = oldImgRecord?.img;

      if (oldImgUrl) {
        const bucketIdentifier = "amazonaws.com";
        const filePath = oldImgUrl.split(bucketIdentifier)[1];
        if (filePath) {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePath
          }));
        }
      }

      // 2. Media Optimization Layer: Transcode buffer to target webp layout parameters
      const optimizedBuffer = await sharp(req.file.buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const fileName = `tasks/${Date.now()}-optimized.webp`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: optimizedBuffer,
        ContentType: "image/webp"
      }));

      newUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}://{fileName}`;
    }

    // 3. Service Layer Execution: Fire dynamic parameter state update handler
    const finalUpdateResult = await executeDynamicTaskUpdate(uuid, user_id, req.body.content, newUrl);

    if (!finalUpdateResult) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    if (finalUpdateResult.rowCount === 0) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    // Flush cache pipelines
    await redisClient.del(`tasks_feed:${user_id}`);

    return res.json({
      message: "Task updated successfully",
      updatedTask: finalUpdateResult.rows[0]
    });
  } catch (err) {
    next(err);
  }
};
