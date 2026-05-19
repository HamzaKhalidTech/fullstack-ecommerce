// ======================================================
// DATABASE
// ======================================================

import database from "../database/db.js";


// ======================================================
// CREATE ORDERS TABLE
// ======================================================

export async function createOrdersTable() {
  try {

    // ======================================================
    // SQL QUERY
    // ======================================================

    const query = `
      CREATE TABLE IF NOT EXISTS orders (

        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

        buyer_id UUID NOT NULL,

        total_price DECIMAL(10,2) NOT NULL 
          CHECK (total_price >= 0),

        tax_price DECIMAL(10,2) NOT NULL 
          CHECK (tax_price >= 0),

        shipping_price DECIMAL(10,2) NOT NULL 
          CHECK (shipping_price >= 0),

        order_status VARCHAR(50) DEFAULT 'Processing'
          CHECK (
            order_status IN (
              'Processing',
              'Shipped',
              'Delivered',
              'Cancelled'
            )
          ),

        paid_at TIMESTAMP 
          CHECK (
            paid_at IS NULL 
            OR paid_at <= CURRENT_TIMESTAMP
          ),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- ====================================================
        -- FOREIGN KEY
        -- ====================================================

        FOREIGN KEY (buyer_id)
          REFERENCES users(id)
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
      "Failed to create orders table:",
      error
    );

    process.exit(1);
  }
}