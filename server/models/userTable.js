// ======================================================
// DATABASE
// ======================================================

import database from "../database/db.js";


// ======================================================
// CREATE USERS TABLE
// ======================================================

export async function createUserTable() {
  try {

    // ======================================================
    // SQL QUERY
    // ======================================================

    const query = `
      CREATE TABLE IF NOT EXISTS users (

        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

        name VARCHAR(50) NOT NULL
          CHECK (char_length(name) >= 3),

        email VARCHAR(40) UNIQUE NOT NULL,

        password TEXT NOT NULL,

        role VARCHAR(10) NOT NULL DEFAULT 'User'
          CHECK (role IN ('User', 'Admin')),

        avatar JSONB DEFAULT NULL,

        reset_password_token TEXT DEFAULT NULL,

        reset_password_expire TIMESTAMP DEFAULT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

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
      "Failed to create users table:",
      error
    );

    process.exit(1);
  }
}