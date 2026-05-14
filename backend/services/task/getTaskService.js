import pool from "../../config/db.js";

// Fetches the global reverse-chronological feed with aggregate profile and like metrics
export const fetchGlobalTasksFeed = async (user_id) => {
  const result = await pool.query(
    `SELECT 
      c.*, 
      CONCAT(p.first_name, ' ', p.last_name) AS author_name, 
      p.avatar_url,
      (SELECT COUNT(*) FROM likes WHERE post_id = c.id) AS like_count,
      EXISTS (SELECT 1 FROM likes WHERE post_id = c.id AND user_id = $1) AS is_liked
     FROM content c 
     LEFT JOIN profiles p ON c.user_id = p.id 
     ORDER BY c.created_at DESC`,
    [user_id],
  );
  return result.rows;
};
