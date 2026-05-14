import pool from "../../config/db.js";

// 1. Fetches the old target task to inspect its existing asset state for storage cleanup
export const fetchOldTaskImage = async (uuid, user_id) => {
  const result = await pool.query(
    "SELECT img FROM content WHERE uuid = $1 AND user_id = $2",
    [uuid, user_id]
  );
  return result.rows[0] || null;
};

// 2. Dynamically structures and runs the SQL update command based on modified parameters
export const executeDynamicTaskUpdate = async (uuid, user_id, contentUpdate, imgUpdate) => {
  const updates = [];
  const values = [];

  if (contentUpdate) {
    updates.push(`content = $${updates.length + 1}`);
    values.push(contentUpdate);
  }

  if (imgUpdate) {
    updates.push(`img = $${updates.length + 1}`);
    values.push(imgUpdate);
  }

  if (updates.length === 0) return null;

  // Append safe verification constraints to the values array list
  values.push(uuid, user_id);
  
  const queryStr = `UPDATE content 
                    SET ${updates.join(", ")} 
                    WHERE uuid = $${values.length - 1} AND user_id = $${values.length} 
                    RETURNING *`;

  const finalUpdateResult = await pool.query(queryStr, values);
  return finalUpdateResult;
};
