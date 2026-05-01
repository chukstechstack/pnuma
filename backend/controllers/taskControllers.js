import pool from "../config/db.js";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import TaskInputError from "../utils/TaskInputError.js";

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
  upload.single("img"), // parse file
  async (req, res, next) => {
    const { content } = req.body; // <-- include tags here
    const user_id = req.user.id;
    let img_url = "https://source.unsplash.com/random/300x300?avatar";

    try {
      if (!content) throw new TaskInputError("Content is required");

      if (req.file) {
        // Upload image to Supabase Storage
        const { data, error } = await supabase.storage
          .from("task-images")
          .upload(
            `tasks/${Date.now()}-${req.file.originalname}`,
            req.file.buffer,
            {
              contentType: req.file.mimetype,
            },
          );

        if (error) throw error;

        // Get public URL
        const { data: publicData } = supabase.storage
          .from("task-images")
          .getPublicUrl(data.path);

        img_url = publicData.publicUrl;
      }

      // Insert into Postgres
      const result = await pool.query(
        `INSERT INTO content(content, img, user_id )
         VALUES($1, $2, $3) RETURNING *`,
        [content, img_url, user_id],
      );

      const newPostId = result.rows[0].id
      const resultWithUser = await pool.query(
        `select c.*,
        c.user_id,
        concat(p.first_name, ' ', p.last_name) AS author_name,
        p.avatar_url,
        0 AS like_count,
        false As is_liked
        FROM content c
        join profiles p on c.user_id = p.id
        where c.id = $1`, [newPostId]

      )

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
  const user_id = req.user?.id; // Get current user ID from auth middleware
  try {
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
      [user_id]
    );
    res.json({ tasks: result.rows, currentUserId: user_id });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  const { uuid } = req.params;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `delete from content where uuid = $1 AND user_id = $2`,
      [uuid, user_id],
    );
    if (result.rowCount === 0) {
      return res.status(403).json({ error: "You are unauthorized" });
    }
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
        const { data, error } = await supabase.storage
          .from("task-images")
          .upload(
            `tasks/${Date.now()}-${req.file.originalname}`,
            req.file.buffer,
            {
              contentType: req.file.mimetype,
            },
          );

        if (error) throw error;

        const { data: publicData } = supabase.storage
          .from("task-images")
          .getPublicUrl(data.path);
        updates.push(`img = $${updates.length + 1}`);
        values.push(publicData.publicUrl);
      }

      if (updates.length === 0) throw new TaskInputError("Post not found");

      values.push(uuid, user_id);
      const query = `
      UPDATE CONTENT SET ${updates.join(", ")}
      WHERE uuid = $${values.length - 1} AND user_id = $${values.length}
      RETURNING *;
      `;

      const result = await pool.query(query, values);
      if (result.rowCount === 0) throw new TaskInputError("Post not found");
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
