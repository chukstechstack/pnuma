import pool from "../../config/supaseConfig.js";

// Fetches a single specific post based on UUID and author ownership constraints
export const fetchTaskByOwnership = async (uuid, userId) => {
  const result = await pool.query(
    `SELECT * FROM content WHERE uuid = $1 AND user_id = $2`,
    [uuid, userId]
  );
  return result.rows[0] || null;
};
