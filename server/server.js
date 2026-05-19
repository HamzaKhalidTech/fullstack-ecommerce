// ======================================================
// APP IMPORT
// ======================================================

import app from "./app.js";

// ======================================================
// CLOUDINARY CONFIG
// ======================================================

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});


// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});