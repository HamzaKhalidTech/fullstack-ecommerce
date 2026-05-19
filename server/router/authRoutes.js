// ======================================================
// PACKAGE IMPORTS
// ======================================================

import express from "express";

// ======================================================
// CONTROLLERS
// ======================================================

import {
  register,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";

// ======================================================
// MIDDLEWARES
// ======================================================

import { isAuthenticated } from "../middlewares/authMiddleware.js";

// ======================================================
// ROUTER
// ======================================================

const router = express.Router();

// ======================================================
// AUTH ROUTES
// ======================================================

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

// Logout User
router.get(
  "/logout",
  isAuthenticated,
  logout
);

// Get Current User
router.get(
  "/me",
  isAuthenticated,
  getUser
);

// Forgot Password
router.post(
  "/password/forgot",
  forgotPassword
);

// Reset Password
router.put(
  "/password/reset/:token",
  resetPassword
);

// Update Password
router.put(
  "/password/update",
  isAuthenticated,
  updatePassword
);

// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;