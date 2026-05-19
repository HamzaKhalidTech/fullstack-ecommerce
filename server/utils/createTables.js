// ======================================================
// TABLE IMPORTS
// ======================================================

import { createUserTable } from "../models/userTable.js";
import { createProductTable } from "../models/productTable.js";

import { createOrdersTable } from "../models/ordersTable.js";
import { createOrderItemTable } from "../models/orderItemsTable.js";

import { createProductReviewsTable } from "../models/productReviewsTable.js";

import { createShippingInfoTable } from "../models/shippingTable.js";
import { createPaymentsTable } from "../models/paymentsTable.js";


// ======================================================
// CREATE ALL DATABASE TABLES
// ======================================================

export const createTable = async () => {
  try {

    // ======================================================
    // BASE TABLES
    // ======================================================

    await createUserTable();

    await createProductTable();

    // ======================================================
    // ORDER TABLES
    // ======================================================

    // Depends on users table
    await createOrdersTable();

    // Depends on orders & products tables
    await createOrderItemTable();

    // ======================================================
    // REVIEW TABLES
    // ======================================================

    // Depends on users & products tables
    await createProductReviewsTable();

    // ======================================================
    // SHIPPING & PAYMENT TABLES
    // ======================================================

    // Depends on orders & users tables
    await createShippingInfoTable();

    // Depends on orders table
    await createPaymentsTable();

    // ======================================================
    // SUCCESS MESSAGE
    // ======================================================

    console.log(
      "All tables created successfully."
    );

  } catch (error) {

    // ======================================================
    // ERROR HANDLING
    // ======================================================

    console.error(
      "Error creating tables:",
      error
    );
  }
};