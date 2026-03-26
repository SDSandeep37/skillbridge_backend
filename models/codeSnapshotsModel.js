import { pool } from "../db.js";

const tableName = "code_snapshots";

// creating code snapshot for each session
export async function createCodeSnapshot(sessionId, code) {
  try {
    const result = await pool.query(
      `INSERT INTO ${tableName}(session_id, content)
      VALUES ($1,$2)  RETURNING *`,
      [sessionId, code],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// get code using session id
export async function getCodeBySessionId(sessionId) {
  try {
    const result = await pool.query(
      `SELECT * FROM ${tableName}  WHERE session_id =  $1`,
      [sessionId],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

//update code with it's session id
export async function updateCodeWithSessionId(sessionId, code) {
  try {
    const result = await pool.query(
      `UPDATE ${tableName} SET content= $1, updated_at = CURRENT_TIMESTAMP WHERE session_id = $2 RETURNING *`,
      [code, sessionId],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}
