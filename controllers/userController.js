import * as User from "../models/userModel.js";
import {
  emailValidator,
  hashPassword,
  nameValidator,
  passwordValidator,
  comparePassword,
} from "../utils/validations.js";
import { createTokenCookie } from "../utils/cookies.js";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

export async function createUserControllder(request, response) {
  const { name, email, password, role } = request.body;
  const validateEmail = emailValidator(email);
  const validateName = nameValidator(name);
  const validatePassword = passwordValidator(password);
  if (!validateEmail) {
    return response.status(400).json({
      error: "A valid email is required",
      requestedEmail: email,
    });
  }
  const isUserExist = await User.getUserWithEmail(email);
  if (isUserExist) {
    return response.status(400).json({
      error: "This email is already associated with an user.",
      requestedEmail: email,
      data: isUserExist,
    });
  }
  if (!validateName) {
    return response.status(400).json({
      error: "Required valid name.",
      requestedName: name,
    });
  }
  if (!role || (role !== "mentor" && role !== "student")) {
    return response.status(400).json({
      error: "Role should be mentor or student.",
      requestedRole: role,
    });
  }
  if (!validatePassword) {
    return response.status(400).json({
      error:
        "Password must be 6 characters,min 1 uppercase, lowercase,number,symbol required.",
      requestedPassword: password,
    });
  }

  const passwordHashed = await hashPassword(password);
  try {
    const user = await User.createUser(email, name, role, passwordHashed);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1h" },
    );

    // Store token in cookie
    const maxAge = process.env.JWT_EXPIRE
      ? parseInt(process.env.JWT_EXPIRE) * 1000 * 60 * 60
      : 3600000; // 1 hour default
    createTokenCookie(response, token, maxAge);

    response.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error creating user", err);
    response
      .status(500)
      .json({ error: `Internal Server Error: ${err.message}` });
  }
}

// Login controller funtion
export async function loginController(request, response) {
  const { email, password } = request.body;
  if (!email) {
    return response.status(400).json({
      error: "Email Required",
      requestedEmail: email,
    });
  }
  if (!password || password.trim() === "") {
    return response.status(400).json({
      error: "Password Required",
      pass: password,
    });
  }
  try {
    const checkUser = await User.getUserWithEmail(email);
    if (!checkUser) {
      return response.status(400).json({
        error: "User with this email does not exist",
      });
    }
    const user = await User.getUserWithEmailPassword(email, password);
    if (!user) {
      return response.status(400).json({
        error: "Incorrect Password",
      });
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1h" },
    );

    // Store token in cookie
    const maxAge = process.env.JWT_EXPIRE
      ? parseInt(process.env.JWT_EXPIRE) * 1000 * 60 * 60
      : 3600000; // 1 hour default
    createTokenCookie(response, token, maxAge);

    response.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error login user", err);
    response
      .status(500)
      .json({ error: `Internal Server Error: ${err.message}` });
  }
}

// login checked with jwt and after this sending the user deatils
export async function userLoginCheck(request, response) {
  const { userId } = request.user;

  try {
    const userDetails = await User.getUserDetails(userId);
    if (userDetails) {
      return response.status(200).json({
        login: true,
        user: userDetails,
      });
    }
  } catch (error) {
    console.error("Error getting user", err);
    response
      .status(500)
      .json({ error: `Internal Server Error: ${err.message}` });
  }
}

//Getting all the users with role student
export async function getUserRoleStudent(request, response) {
  const { role } = request.user;
  if (!role || role !== "mentor") {
    return response.status(400).json({
      error: "Request denied",
      message: "Only mentors are allowed for this action",
    });
  }
  try {
    const students = await User.getAllStudents();
    if (students.length === 0) {
      return response.json({
        students: students,
        message: "Yet to register a student- No student found",
      });
    }
    return response.json({
      students: students,
      message: "All user list with role student",
    });
  } catch (error) {
    console.error("Error getting user with role student", error);
    response
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
}
