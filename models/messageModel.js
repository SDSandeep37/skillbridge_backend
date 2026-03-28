import { pool } from "../db.js";
const tableName = "messages";

// inserting messages with session id and sender id
export async function createMessage(sessionId, message, sender_id) {
  try {
    const result = await pool.query(
      `INSERT INTO ${tableName}(session_id,sender_id, message)
      VALUES ($1,$2,$3)  RETURNING *`,
      [sessionId, message, sender_id],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}
//get all the messages related to a particular session
export async function getAllMessageWithSessionId(sessionId) {
  try {
    const result = await pool.query(
      `SELECT messages.*, users.name,users.id as user_id FROM messages 
      JOIN users ON
      messages.sender_id = users.id
      WHERE messages.session_id =  $1 ORDER BY messages.created_at ASC`,
      [sessionId],
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}
export async function getRecentAddedMessage(sessionId) {
  try {
    const result = await pool.query(
      `SELECT messages.*, users.name,users.id as user_id FROM messages 
      JOIN users ON
      messages.sender_id = users.id
      WHERE messages.session_id =  $1 ORDER BY messages.created_at DESC LIMIT 1`,
      [sessionId],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}
