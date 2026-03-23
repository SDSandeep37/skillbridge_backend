import { pool } from "../db.js";
import { comparePassword } from "../utils/validations.js";

//Function to create a new user in the database
export async function createUser(email, name, role, password) {
  try {
    const result = await pool.query(
      `INSERT INTO users (name,email, password,role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
      [name, email, password, role],
    );
    const user = result.rows[0];
    delete user.password;
    delete user.created_at;
    delete user.update_at;
    return user;
  } catch (error) {
    throw error;
  }
}

// get user using email
export async function getUserWithEmail(email) {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rowCount === 0) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
}
// get user using email and compare password
export async function getUserWithEmailPassword(email, passWord) {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    const user = result.rows[0];
    const isMatch = await comparePassword(passWord, user.password);

    if (!isMatch) {
      return false; // password mismatch
    }
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}
// getting user by id stored as jwt token
export async function getUserDetails(id) {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    const user = result.rows[0];
    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    return user;
  } catch (error) {
    throw error;
  }
}

//Get all the students list
export async function getAllStudents() {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE role = 'student'`,
    );
    const students = result.rows;
    students.forEach((student) => {
      delete student.password;
      delete student.created_at;
      delete student.updated_at;
    });
    return students;
  } catch (error) {
    throw error;
  }
}
