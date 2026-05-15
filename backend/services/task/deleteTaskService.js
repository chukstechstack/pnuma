import pool from "../../config/supaseConfig.js";

// 1. Verifies ownership and retrieves the image path string for S3 asset matching
export const findTaskImageForCleanup = async (uuid, user_id) => {
  const result = await pool.query(
    "SELECT img FROM content WHERE uuid = $1 AND user_id = $2",
    [uuid, user_id]
  );
  return result.rows[0] || null;
};

// 2. Executes the physical row removal from the database tables
export const executeTaskDeletion = async (uuid, user_id) => {
  const result = await pool.query(
    "DELETE FROM content WHERE uuid = $1 AND user_id = $2",
    [uuid, user_id]
  );
  return result.rowCount; // Returns how many records were altered (0 or 1)
};
