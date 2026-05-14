import pool from "../../config/db.js";

// 1. Translates a public UUID string into an internal integer ID
export const fetchPostIdByUuid = async (uuid) => {
  const result = await pool.query(
    "SELECT id FROM content WHERE uuid = $1",
    [uuid]
  );
  return result.rows[0]?.id || null;
};

// 2. Checks if a user has already liked a specific post record
export const checkExistingLike = async (post_id, user_id) => {
  const result = await pool.query(
    "SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2",
    [post_id, user_id]
  );
  return result.rowCount > 0;
};

// 3. Removes an existing like entry record from the database
export const removeLikeRecord = async (post_id, user_id) => {
  await pool.query(
    "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
    [post_id, user_id]
  );
};

// 4. Inserts a brand new like connection record into the database
export const createLikeRecord = async (post_id, user_id) => {
  await pool.query(
    "INSERT INTO likes (post_id, user_id) VALUES($1, $2)",
    [post_id, user_id]
  );
};
