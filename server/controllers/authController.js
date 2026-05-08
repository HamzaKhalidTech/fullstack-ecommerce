import database from "../database/db.js";
import bcrypt from "bcryptjs";

import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(
      new ErrorHandler("Please provide all required fields.", 400)
    );
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.toLowerCase().trim();

  if (password.trim().length < 8) {
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters.",
        400
      )
    );
  }

  const isAlreadyRegistered = await database.query(
    `SELECT id FROM users WHERE email = $1`,
    [normalizedEmail]
  );

  if (isAlreadyRegistered.rows.length > 0) {
    return next(
      new ErrorHandler(
        "User already registered with this email.",
        409
      )
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await database.query(
    `INSERT INTO users(name, email, password)
     VALUES($1, $2, $3)
     RETURNING id, name, email`,
    [normalizedName, normalizedEmail, hashedPassword]
  );

  const newUser = user.rows[0];

  sendToken(
    newUser,
    201,
    "User registered successfully",
    res
  );
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return next(
      new ErrorHandler("Please provide email and password", 400)
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await database.query(
    "SELECT * FROM users WHERE email = $1",
    [normalizedEmail]
  );

  if (user.rows.length === 0) {
    return next(
      new ErrorHandler("Invalid email or password", 401)
    );
  }

  const isPasswordMatch = await bcrypt.compare(
    password,
    user.rows[0].password
  );

  if (!isPasswordMatch) {
    return next(
      new ErrorHandler("Invalid email or password", 401)
    );
  }

  const loggedInUser = { ...user.rows[0] };
  delete loggedInUser.password;

  sendToken(
    loggedInUser,
    200,
    "Logged in successfully",
    res
  );
});


export const logout = catchAsyncErrors(async (req, res, next) => {});
export const getUser = catchAsyncErrors(async (req, res, next) => {});