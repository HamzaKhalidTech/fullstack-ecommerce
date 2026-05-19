// ======================================================
// PACKAGE IMPORTS
// ======================================================

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

// ======================================================
// DATABASE
// ======================================================

import database from "../database/db.js";

// ======================================================
// MIDDLEWARES
// ======================================================

import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

// ======================================================
// UTILITIES
// ======================================================

import { sendToken } from "../utils/jwtToken.js";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/generateForgotPasswordEmailTemplate.js";


// ======================================================
// REGISTER USER
// ======================================================

export const register = catchAsyncErrors(
  async (req, res, next) => {
    const { name, email, password } = req.body;

    // ======================================================
    // VALIDATE INPUTS
    // ======================================================

    if (!name || !email || !password) {
      return next(
        new ErrorHandler(
          "Please provide all required fields.",
          400
        )
      );
    }

    const normalizedName = name.trim();

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    if (password.trim().length < 8) {
      return next(
        new ErrorHandler(
          "Password must be at least 8 characters.",
          400
        )
      );
    }

    // ======================================================
    // CHECK EXISTING USER
    // ======================================================

    const existingUserQuery = `
      SELECT id
      FROM users
      WHERE email = $1
    `;

    const existingUser = await database.query(
      existingUserQuery,
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return next(
        new ErrorHandler(
          "User already registered with this email.",
          409
        )
      );
    }

    // ======================================================
    // HASH PASSWORD
    // ======================================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ======================================================
    // CREATE USER
    // ======================================================

    const createUserQuery = `
      INSERT INTO users (
        name,
        email,
        password
      )
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `;

    const values = [
      normalizedName,
      normalizedEmail,
      hashedPassword,
    ];

    const user = await database.query(
      createUserQuery,
      values
    );

    // ======================================================
    // SEND TOKEN
    // ======================================================

    sendToken(
      user.rows[0],
      201,
      "User registered successfully.",
      res
    );
  }
);


// ======================================================
// LOGIN USER
// ======================================================

export const login = catchAsyncErrors(
  async (req, res, next) => {
    const { email, password } = req.body;

    // ======================================================
    // VALIDATE INPUTS
    // ======================================================

    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return next(
        new ErrorHandler(
          "Please provide email and password.",
          400
        )
      );
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    // ======================================================
    // FIND USER
    // ======================================================

    const findUserQuery = `
      SELECT *
      FROM users
      WHERE email = $1
    `;

    const user = await database.query(
      findUserQuery,
      [normalizedEmail]
    );

    if (user.rows.length === 0) {
      return next(
        new ErrorHandler(
          "Invalid email or password.",
          401
        )
      );
    }

    const existingUser = user.rows[0];

    // ======================================================
    // COMPARE PASSWORD
    // ======================================================

    const isPasswordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordMatched) {
      return next(
        new ErrorHandler(
          "Invalid email or password.",
          401
        )
      );
    }

    // ======================================================
    // REMOVE PASSWORD
    // ======================================================

    delete existingUser.password;

    // ======================================================
    // SEND TOKEN
    // ======================================================

    sendToken(
      existingUser,
      200,
      "Logged in successfully.",
      res
    );
  }
);


// ======================================================
// GET CURRENT USER
// ======================================================

export const getUser = catchAsyncErrors(
  async (req, res, next) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);


// ======================================================
// LOGOUT USER
// ======================================================

export const logout = catchAsyncErrors(
  async (req, res, next) => {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  }
);


// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPassword = catchAsyncErrors(
  async (req, res, next) => {
    const { email } = req.body;
    const { frontendUrl } = req.query;

    // ======================================================
    // FIND USER
    // ======================================================

    const findUserQuery = `
      SELECT *
      FROM users
      WHERE email = $1
    `;

    const userResult = await database.query(
      findUserQuery,
      [email]
    );

    if (userResult.rows.length === 0) {
      return next(
        new ErrorHandler(
          "User not found with this email.",
          404
        )
      );
    }

    const user = userResult.rows[0];

    // ======================================================
    // GENERATE RESET TOKEN
    // ======================================================

    const {
      hashedToken,
      resetPasswordExpireTime,
      resetToken,
    } = generateResetPasswordToken();

    // ======================================================
    // SAVE RESET TOKEN
    // ======================================================

    const updateResetTokenQuery = `
      UPDATE users
      SET
        reset_password_token = $1,
        reset_password_expire = to_timestamp($2)
      WHERE email = $3
    `;

    await database.query(
      updateResetTokenQuery,
      [
        hashedToken,
        resetPasswordExpireTime / 1000,
        email,
      ]
    );

    // ======================================================
    // RESET PASSWORD URL
    // ======================================================

    const resetPasswordUrl = `
      ${frontendUrl}/password/reset/${resetToken}
    `;

    // ======================================================
    // EMAIL TEMPLATE
    // ======================================================

    const message =
      generateForgotPasswordEmailTemplate(
        resetPasswordUrl
      );

    // ======================================================
    // SEND EMAIL
    // ======================================================

    try {
      await sendEmail({
        email: user.email,
        subject: "Ecommerce Password Recovery",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully.`,
      });
    } catch (error) {

      // ======================================================
      // REMOVE RESET TOKEN IF EMAIL FAILS
      // ======================================================

      const removeResetTokenQuery = `
        UPDATE users
        SET
          reset_password_token = NULL,
          reset_password_expire = NULL
        WHERE email = $1
      `;

      await database.query(
        removeResetTokenQuery,
        [email]
      );

      return next(
        new ErrorHandler(
          "Email could not be sent.",
          500
        )
      );
    }
  }
);


// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword = catchAsyncErrors(
  async (req, res, next) => {
    const { token } = req.params;

    const {
      password,
      confirmPassword,
    } = req.body;

    // ======================================================
    // HASH TOKEN
    // ======================================================

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // ======================================================
    // FIND USER
    // ======================================================

    const findUserQuery = `
      SELECT *
      FROM users
      WHERE
        reset_password_token = $1
        AND reset_password_expire > NOW()
    `;

    const user = await database.query(
      findUserQuery,
      [resetPasswordToken]
    );

    if (user.rows.length === 0) {
      return next(
        new ErrorHandler(
          "Invalid or expired reset token.",
          400
        )
      );
    }

    // ======================================================
    // VALIDATE PASSWORDS
    // ======================================================

    if (!password || !confirmPassword) {
      return next(
        new ErrorHandler(
          "All fields are required.",
          400
        )
      );
    }

    if (
      password.length < 8 ||
      password.length > 16
    ) {
      return next(
        new ErrorHandler(
          "Password must be between 8 and 16 characters.",
          400
        )
      );
    }

    if (password !== confirmPassword) {
      return next(
        new ErrorHandler(
          "Passwords do not match.",
          400
        )
      );
    }

    // ======================================================
    // HASH PASSWORD
    // ======================================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ======================================================
    // UPDATE PASSWORD
    // ======================================================

    const updatePasswordQuery = `
      UPDATE users
      SET
        password = $1,
        reset_password_token = NULL,
        reset_password_expire = NULL
      WHERE id = $2
      RETURNING *
    `;

    const updatedUser = await database.query(
      updatePasswordQuery,
      [
        hashedPassword,
        user.rows[0].id,
      ]
    );

    // ======================================================
    // SEND TOKEN
    // ======================================================

    sendToken(
      updatedUser.rows[0],
      200,
      "Password reset successfully.",
      res
    );
  }
);


// ======================================================
// UPDATE PASSWORD
// ======================================================

export const updatePassword = catchAsyncErrors(
  async (req, res, next) => {
    const {
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;

    // ======================================================
    // VALIDATE INPUTS
    // ======================================================

    if (
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword
    ) {
      return next(
        new ErrorHandler(
          "Please provide all required fields.",
          400
        )
      );
    }

    // ======================================================
    // CHECK CURRENT PASSWORD
    // ======================================================

    const isPasswordMatched =
      await bcrypt.compare(
        currentPassword,
        req.user.password
      );

    if (!isPasswordMatched) {
      return next(
        new ErrorHandler(
          "Current password is incorrect.",
          401
        )
      );
    }

    // ======================================================
    // VALIDATE NEW PASSWORD
    // ======================================================

    if (newPassword !== confirmNewPassword) {
      return next(
        new ErrorHandler(
          "New passwords do not match.",
          400
        )
      );
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 16
    ) {
      return next(
        new ErrorHandler(
          "Password must be between 8 and 16 characters.",
          400
        )
      );
    }

    // ======================================================
    // HASH PASSWORD
    // ======================================================

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // ======================================================
    // UPDATE PASSWORD
    // ======================================================

    const updatePasswordQuery = `
      UPDATE users
      SET password = $1
      WHERE id = $2
    `;

    await database.query(
      updatePasswordQuery,
      [
        hashedPassword,
        req.user.id,
      ]
    );

    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  }
);


// ======================================================
// UPDATE PROFILE
// ======================================================

export const updateProfile = catchAsyncErrors(
  async (req, res, next) => {
    const { name, email } = req.body;

    // ======================================================
    // VALIDATE INPUTS
    // ======================================================

    if (!name || !email) {
      return next(
        new ErrorHandler(
          "Name and email are required fields.",
          400
        )
      );
    }

    if (
      name.trim().length === 0 ||
      email.trim().length === 0
    ) {
      return next(
        new ErrorHandler(
          "Name and email cannot be empty.",
          400
        )
      );
    }

    // ======================================================
    // AVATAR DATA
    // ======================================================

    let avatarData = {};

    // ======================================================
    // UPLOAD NEW AVATAR
    // ======================================================

    if (req.files?.avatar) {
      const { avatar } = req.files;

      // Remove old avatar
      if (req.user?.avatar?.public_id) {
        await cloudinary.uploader.destroy(
          req.user.avatar.public_id
        );
      }

      const uploadedAvatar =
        await cloudinary.uploader.upload(
          avatar.tempFilePath,
          {
            folder: "Ecommerce_Avatars",
            width: 150,
            crop: "scale",
          }
        );

      avatarData = {
        public_id: uploadedAvatar.public_id,
        url: uploadedAvatar.secure_url,
      };
    }

    // ======================================================
    // UPDATE PROFILE
    // ======================================================

    let user;

    if (Object.keys(avatarData).length === 0) {

      const updateProfileQuery = `
        UPDATE users
        SET
          name = $1,
          email = $2
        WHERE id = $3
        RETURNING *
      `;

      user = await database.query(
        updateProfileQuery,
        [
          name,
          email,
          req.user.id,
        ]
      );

    } else {

      const updateProfileWithAvatarQuery = `
        UPDATE users
        SET
          name = $1,
          email = $2,
          avatar = $3
        WHERE id = $4
        RETURNING *
      `;

      user = await database.query(
        updateProfileWithAvatarQuery,
        [
          name,
          email,
          avatarData,
          req.user.id,
        ]
      );
    }

    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: user.rows[0],
    });
  }
);