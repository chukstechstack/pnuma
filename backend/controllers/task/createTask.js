import multer from "multer";
import TaskInputError from "../../utils/taskInputError.js";
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../config/AwsS3ClientConfig.js";
import redisClient from "../../config/redisCreateClient.js";

// Import your newly created database service workers
import { insertNewTask, fetchHydratedTaskById } from "../../services/task/createTaskService.js";

// Initialize Memory Multer Storage Instance for image tracking
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const createTask = async (req, res, next) => {
  const { content } = req.body;
  const user_id = req.user.id;
  let img_url = null;

  try {
    if (!content) throw new TaskInputError("Content is required");

    // Transform and stream data to S3 if a file is uploaded
    if (req.file) {
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

      img_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
    }

    // Execution Layer 1: Run the raw SQL insertion service worker
    const savedTaskData = await insertNewTask(content, img_url, user_id);
    if (!savedTaskData) throw new Error("Failed to persist task resource data");

    // Execution Layer 2: Run the profile mapping hydration service worker
    const resultWithUser = await fetchHydratedTaskById(savedTaskData.id);

    // Cache clearing execution
    await redisClient.del(`tasks_feed:${user_id}`);
    console.log(`🗑️ Cache busted for user: ${user_id}`);

    return res.json({
      message: "Content created successfully",
      newTask: resultWithUser,
    });
  } catch (err) {
    next(err);
  }
};
