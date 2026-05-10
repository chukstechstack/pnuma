import pool from "../config/db.js";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import TaskInputError from "../utils/taskInputError.js";
import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import redisClient from "../config/redis.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// Multer middleware to handle file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const createTask = [
  // 1. RECEIVE: Multer intercepts the multipart form and puts the image into RAM (req.file.buffer)
  upload.single("img"), // parse file
  async (req, res, next) => {
    // 2. VALIDATE: Ensure the user actually sent content before wasting resources on images
    const { content } = req.body; // <-- include tags here
    const user_id = req.user.id;
    let img_url = null;

    try {
      if (!content) throw new TaskInputError("Content is required");
      // 3. TRANSFORM: Use Sharp to downsample (resize) and transcode (convert to WebP) in-memory
      if (req.file) {

        // We take the raw buffer and transform it IN MEMORY
        const optimizedBuffer = await sharp(req.file.buffer)
          .resize({ width: 800, withoutEnlargement: true }) // Don't stretch small images
          .webp({ quality: 80 })                           // Convert to WebP
          .toBuffer();                                     // Output back to a Buffer

        // 4. PREPARE: Generate a unique timestamped filename to prevent naming collisions
        const fileName = `tasks/${Date.now()}-optimized.webp`; // Notice the .webp extension

        // 5. PERSIST (AWS s3)
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: optimizedBuffer,
          ContentType: "image/webp"
        }

        await s3.send(new PutObjectCommand(uploadParams));
        // 3. RESOLVE (AWS URL Pattern)
        // S3 URLs follow a very predictable pattern:
        img_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      }
      // 7. PERSIST (Database): Save the text content and the image URL to Postgres
      const result = await pool.query(
        `INSERT INTO content(content, img, user_id )
         VALUES($1, $2, $3) RETURNING *`,
        [content, img_url, user_id],
      );

      const newPostId = result.rows[0].id;
      const resultWithUser = await pool.query(
        `select c.*,
        c.user_id,
        concat(p.first_name, ' ', p.last_name) AS author_name,
        p.avatar_url,
        0 AS like_count,
        false As is_liked
        FROM content c
        join profiles p on c.user_id = p.id
        where c.id = $1`,
        [newPostId],
      );
      // 2. 🔥 THE REDIS PART: Delete the old cache
      // We use the same key pattern we used in getTask
      await redisClient.del(`tasks_feed:${user_id}`);
      console.log(`🗑️ Cache busted for user: ${user_id}`);
      res.json({
        message: "Content created successfully",
        newTask: resultWithUser.rows[0],
      });
    } catch (err) {
      next(err);
    }
  },
];

const getTask = async (req, res, next) => {
  const user_id = req.user?.id;
  const cacheKey = `tasks_feed:${user_id || 'guest'}` // Get current user ID from auth middleware
  try {

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(" ⚡ Redis Hit: Serving feed from cache")
      return res.json(JSON.parse(cachedData));
    }

    console.log("🐢 Redis Miss: Fetching from Postgres");
    const result = await pool.query(
      `SELECT 
    c.*, 
    -- CONCAT won't break if one name is missing
    CONCAT(p.first_name, ' ', p.last_name) AS author_name, 
    p.avatar_url,
    (SELECT COUNT(*) FROM likes WHERE post_id = c.id) AS like_count,
    EXISTS (SELECT 1 FROM likes WHERE post_id = c.id AND user_id = $1) AS is_liked
   FROM content c 
   LEFT JOIN profiles p ON c.user_id = p.id 
   ORDER BY c.created_at DESC`,
      [user_id],
    );
    const responseData = { tasks: result.rows, currentUserId: user_id };

    await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 600 })
    res.json(responseData)
  } catch (err) {
    next(err);
  }
};



const deleteTask = async (req, res, next) => {
  const { uuid } = req.params;
  const user_id = req.user.id;
  try {
    // 1. Check if it exists and get the image for S3 cleanup
    const taskResult = await pool.query(
      "SELECT img FROM content WHERE uuid = $1 AND user_id = $2",
      [uuid, user_id]
    );
    if (taskResult.rowCount === 0) {
      return res.status(403).json({ error: "you are unauthorized or task not found" })
    }

    const imgUrl = taskResult.rows[0].img;

    //3 AWS S3 Cleanup
    if (imgUrl) {
      // 5. Dynamic Split: We split by the bucket name variable
      const bucketIdentifier = `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
      const filePath = imgUrl.split(bucketIdentifier)[1];

      if (filePath) {
        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: filePath
        };
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log(`AWS S3 cleanup success: ${filePath}`);
      }
    }
    const result = await pool.query(
      `delete from content where uuid = $1 AND user_id = $2`,
      [uuid, user_id],
    );
    if (result.rowCount === 0) {
      return res.status(403).json({ error: "You are unauthorized" });
    }

    // 4. REDIS INVALIDATION: Rip up the "Post-it note" so the refresh is clean
    const cacheKey = `tasks_feed:${user_id}`;
    await redisClient.del(cacheKey);
    console.log("🗑️ Redis Cache cleared for user:", user_id);


    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
    console.log(err);
  }
};



const getEditPage = async (req, res, next) => {
  const uuid = req.params.uuid;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `select * from content where uuid = $1 AND user_id = $2`,
      [uuid, userId],
    );

    if (result.rows.length === 0) throw new TaskInputError("Post not found");

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};


const patchTask = [
  // 1. RECEIVE: Capture file and UUID
  upload.single("img"),
  async (req, res, next) => {
    const { uuid } = req.params;
    const user_id = req.user.id;

    try {
      const updates = [];
      const values = [];

      if (req.body.content) {
        updates.push(`content = $${updates.length + 1}`);
        values.push(req.body.content);
      }

      if (req.file) {
        // 2. LOOKUP: Get old image URL
        const oldTask = await pool.query(
          "SELECT img FROM content WHERE uuid = $1 AND user_id = $2",
          [uuid, user_id]
        );
        const oldImgUrl = oldTask.rows[0]?.img;

        // 3. CLEANUP: Delete old file from S3
        if (oldImgUrl) {
          const bucketIdentifier = ".amazonaws.com/";
          const filePath = oldImgUrl.split(bucketIdentifier)[1];
          if (filePath) {
            await s3.send(new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: filePath
            }));
          }
        }

        // 4. TRANSFORM: Sharp (Resize + WebP)
        const optimizedBuffer = await sharp(req.file.buffer)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        // 5. UPLOAD: Save to AWS S3 (Fixed from Supabase)
        const fileName = `tasks/${Date.now()}-optimized.webp`;
        await s3.send(new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: optimizedBuffer,
          ContentType: "image/webp"
        }));

        // 6. UPDATE PATH: Construct the new URL
        const newUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        updates.push(`img = $${updates.length + 1}`);
        values.push(newUrl); // Fixed variable name
      }

      if (updates.length === 0 && !req.body.content) throw new TaskInputError("No Changes Provided");

      values.push(uuid, user_id);
      const query = `
      UPDATE CONTENT SET ${updates.join(", ")}
      WHERE uuid = $${values.length - 1} AND user_id = $${values.length}
      RETURNING *;
      `;

      const result = await pool.query(query, values);
      if (result.rowCount === 0) throw new TaskInputError("Post not found");
      
      // 7. 🔥 THE REDIS PART: Invalidate the cache
      // We kill the cache so the updated text/image shows up on the next fetch
      await redisClient.del(`tasks_feed:${user_id}`);
      console.log("🗑️ Redis Cache cleared after patch/update");

      res.json({
        message: "updated successfully",
        updatedTask: result.rows[0],
      });
    } catch (err) {
      next(err);
    }
  },
];

const toggleLike = async (req, res, next) => {
  const { uuid } = req.params;
  const user_id = req.user.id;
  try {
    const postResult = await pool.query(
      "SELECT id FROM content WHERE uuid =$1",
      [uuid],
    );

    if (postResult.rowCount === 0) throw new TaskInputError("Post not found");
    const post_id = postResult.rows[0].id;

    const checkLike = await pool.query(
      `SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`,
      [post_id, user_id],
    );
    if (checkLike.rowCount > 0) {
      await pool.query(
        `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,
        [post_id, user_id],
      );
      res.json({ liked: false });
    } else {
      await pool.query("INSERT INTO likes (post_id, user_id) VALUES($1, $2)", [
        post_id,
        user_id,
      ]);
      res.json({ liked: true });
    }
  } catch (err) {
    next(err);
  }
};
export { createTask, getTask, deleteTask, patchTask, getEditPage, toggleLike };
