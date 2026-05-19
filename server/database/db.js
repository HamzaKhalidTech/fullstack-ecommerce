// ======================================================
// POSTGRESQL DATABASE CONNECTION
// ======================================================

import pkg from "pg";

const { Client } = pkg;


// ======================================================
// DATABASE CONFIGURATION
// ======================================================

const database = new Client({
  user: "postgres",
  host: "localhost",
  database: "E-commerce-store",
  password: "12345678",
  port: 5432,
});


// ======================================================
// CONNECT TO DATABASE
// ======================================================

try {
  await database.connect();

  console.log(
    "Connected to the database successfully!"
  );

} catch (error) {

  console.error(
    "Database connection failed:",
    error
  );

  process.exit(1);
}


// ======================================================
// EXPORT DATABASE CLIENT
// ======================================================

export default database;