import database from "../database/db.js";

export async function createUserTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(50) NOT NULL CHECK (char_length(name) >= 3),
        email VARCHAR(40) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(10) NOT NULL DEFAULT 'User' CHECK (role IN ('User', 'Admin')),
        avatar JSONB DEFAULT NULL,
        reset_password_token TEXT DEFAULT NULL,
        reset_password_expire TIMESTAMP DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await database.query(query);
  } catch (error) {
    console.error("Failed To Create users table:", error);
    process.exit(1);
  }
}