// ======================================================
// IMPORTS
// ======================================================

import jwt from "jsonwebtoken";
import database from "../database/db.js";

// Middlewares
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";


// ======================================================
// AUTHENTICATION MIDDLEWARE
// ======================================================

export const isAuthenticated = catchAsyncErrors(
  async (req, res, next) => {

    // ======================================================
    // GET TOKEN FROM COOKIE
    // ======================================================

    const { token } = req.cookies;

    if (!token) {
      return next(
        new ErrorHandler(
          "Please login to access this resource.",
          401
        )
      );
    }

    // ======================================================
    // VERIFY TOKEN
    // ======================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    // ======================================================
    // FETCH USER FROM DATABASE
    // ======================================================

    const userResult = await database.query(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [decoded.id]
    );

    const user = userResult.rows[0];

    if (!user) {
      return next(
        new ErrorHandler(
          "User not found or token invalid.",
          404
        )
      );
    }

    // ======================================================
    // ATTACH USER TO REQUEST
    // ======================================================

    req.user = user;

    next();
  }
);


// ======================================================
// ROLE AUTHORIZATION MIDDLEWARE
// ======================================================

export const authorizedRoles = (...roles) => {
  return (req, res, next) => {

    // ======================================================
    // CHECK USER ROLE
    // ======================================================

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource.`,
          403
        )
      );
    }

    next();
  };
};