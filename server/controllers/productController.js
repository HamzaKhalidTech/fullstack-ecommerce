import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";
import { url } from "node:inspector";

export const createProduct = catchAsyncErrors(async (req, resizeBy, next) => {
  const { name, description, price, catagory, stock } = req.body;

  const created_by = req.user.id;

  if (!name || !description || !price || !catagory || !stock) {
    return next(
      new ErrorHandler("Please provide complete product details.", 400),
    );
  }

  let uploadedImages = [];

  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "Ecommerce_Product_Image",
        width: 10000,
        crop: "scale",
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  const product = await database.query(
    `INSERT INTO products (name, description, price, catagory, stock, images, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      name,
      description,
      price,
      catagory,
      stock,
      JSON.stringify(uploadedImages),
      created_by,
    ],
  );

  res.status(201).json({
    success: true,
    message: "product created successfully.",
    product: product.rows[0],
  });
});
