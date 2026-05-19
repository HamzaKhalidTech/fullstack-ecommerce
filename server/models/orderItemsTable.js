// ======================================================
// DATABASE
// ======================================================

import database from "../database/db.js";


// ======================================================
// CREATE ORDER ITEMS TABLE
// ======================================================

export async function createOrderItemTable() {
  try {

    // ======================================================
    // SQL QUERY
    // ======================================================

    const query = `
      CREATE TABLE IF NOT EXISTS order_items (

        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

        order_id UUID NOT NULL,
        product_id UUID NOT NULL,

        quantity INT NOT NULL 
          CHECK (quantity > 0),

        price DECIMAL(10,2) NOT NULL 
          CHECK (price >= 0),

        image TEXT NOT NULL,
        title TEXT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- ====================================================
        -- FOREIGN KEYS
        -- ====================================================

        FOREIGN KEY (order_id)
          REFERENCES orders(id)
          ON DELETE CASCADE,

        FOREIGN KEY (product_id)
          REFERENCES products(id)
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
      "Failed to create order items table:",
      error
    );

    process.exit(1);
  }
}