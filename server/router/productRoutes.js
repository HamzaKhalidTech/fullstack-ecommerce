// ======================================================
// PACKAGE IMPORTS
// ======================================================

import express from "express";

// ======================================================
// CONTROLLERS
// ======================================================

import {
  createProduct,
} from "../controllers/productController.js";

// ======================================================
// MIDDLEWARES
// ======================================================

import {
  isAuthenticated,
  authorizedRoles,
} from "../middlewares/authMiddleware.js";

// ======================================================
// ROUTER
// ======================================================

const router = express.Router();

// ======================================================
// PRODUCT ROUTES
// ======================================================

// Create Product (Admin)
router.post(
  "/admin/create",
  isAuthenticated,
  authorizedRoles("Admin"),
  createProduct
);

// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;