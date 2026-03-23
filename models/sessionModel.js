import { pool } from "../db.js";

const tableName = "sessions";
// Creating session with mentor id, student and topic selected by mentor
export async function createSession(mentor, student, topic) {
  try {
    const result = await pool.query(
      `INSERT INTO ${tableName}(mentor_id, student_id, topic)
	    VALUES ($1,$2,$3)  RETURNING *`,
      [mentor, student, topic],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}
// Get all the session for a particular student
export async function studentSessions(student_id) {
  try {
    const result = await pool.query(
      `SELECT sessions.*, users.id as user_id,users.name as mentor_name,
      users.email as mentor_email,users.role 
      FROM sessions
      JOIN users 
      ON sessions.mentor_id = users.id
      WHERE sessions.student_id = $1
      ORDER BY sessions.created_at DESC`,
      [student_id],
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

//Updating session for student joining
export async function updateSessionStudentJoining(session_id, student_id) {
  try {
    const result = await pool.query(
      `UPDATE ${tableName} SET student_joined = $1, student_joined_at= CURRENT_TIMESTAMP
       WHERE id = $2 AND student_id = $3 RETURNING *`,
      [true, session_id, student_id],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Get all the session for a particular student
export async function getSessionBySessionId(session_id) {
  try {
    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id= $1`, [
      session_id,
    ]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}
//Updating session,to end by the particular mentor who has created the session
export async function updateSessionMentorEnding(session_id, mentor_id) {
  try {
    const result = await pool.query(
      `UPDATE ${tableName} SET status = $1,ended_at= CURRENT_TIMESTAMP
       WHERE id = $2 AND mentor_id = $3 RETURNING *`,
      ["ended", session_id, mentor_id],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Get all the session for a particular mentor
export async function mentorSessions(mentor_id) {
  try {
    const result = await pool.query(
      `SELECT sessions.*, users.id as user_id,users.name as student_name,users.email as student_email,users.role 
      FROM sessions
      JOIN users 
      ON sessions.student_id = users.id
      WHERE sessions.mentor_id = $1
      ORDER BY sessions.created_at DESC`,
      [mentor_id],
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}
