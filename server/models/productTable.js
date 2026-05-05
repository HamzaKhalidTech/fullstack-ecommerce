import database from "../database/db.js";

export async function createProductTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL CHECK (char_length(name) >= 3),
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
        category VARCHAR(100) NOT NULL,
        ratings DECIMAL(3,2) DEFAULT 0 CHECK (ratings BETWEEN 0 AND 5),
        images JSONB DEFAULT '[]'::JSONB,
        stock INT NOT NULL CHECK (stock >= 0),
        created_by UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await database.query(query);
  } catch (error) {
    console.error("Failed To Create Products table:", error);
    process.exit(1);
  }
}