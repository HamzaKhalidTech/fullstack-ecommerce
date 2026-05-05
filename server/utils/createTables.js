import { createUserTable } from "../models/userTable.js";
import { createProductTable } from "../models/productTable.js";
import { createOrdersTable } from "../models/ordersTable.js";
import { createOrderItemTable } from "../models/orderItemsTable.js";
import { createProductReviewsTable } from "../models/productReviewsTable.js";
import { createShippingInfoTable } from "../models/shippingTable.js";
import { createPaymentsTable } from "../models/paymentsTable.js";

export const createTable = async () => {
  try {
    await createUserTable();           // base
    await createProductTable();        // base
    await createOrdersTable();         // depends on users
    await createOrderItemTable();      // depends on orders/products
    await createProductReviewsTable(); // depends on users/products
    await createShippingInfoTable();   // depends on orders/users
    await createPaymentsTable();       // depends on orders

    console.log("All tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};