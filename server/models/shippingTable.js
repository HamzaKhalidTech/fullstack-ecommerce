// ======================================================
// DATABASE
// ======================================================

import database from "../database/db.js";


// ======================================================
// CREATE SHIPPING INFO TABLE
// ======================================================

export async function createShippingInfoTable() {
  try {

    // ======================================================
    // SQL QUERY
    // ======================================================

    const query = `
      CREATE TABLE IF NOT EXISTS shipping_info (

        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

        order_id UUID NOT NULL UNIQUE,

        full_name VARCHAR(100) NOT NULL,

        state VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,

        address TEXT NOT NULL,

        pincode VARCHAR(10) NOT NULL,
        phone VARCHAR(20) NOT NULL,

        -- ====================================================
        -- FOREIGN KEY
        -- ====================================================

        FOREIGN KEY (order_id)
          REFERENCES orders(id)
          ON DELETE CASCADE

      );
    `;

    // ======================================================
    // EXECUTE QUERY
    // ======================================================

    await database.query(query);

  } catch (error) {

    // ======================================================
    // ERROR HANDLING
    // ======================================================

    console.error(
      "Failed to create shipping info table:",
      error
    );

    process.exit(1);
  }
}