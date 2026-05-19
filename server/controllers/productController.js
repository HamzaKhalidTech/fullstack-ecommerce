import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";


// ======================================================
// CREATE PRODUCT
// ======================================================

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  const createdBy = req.user.id;

  // Validate Inputs
  if (!name || !description || !price || !category || !stock) {
    return next(
      new ErrorHandler("Please provide complete product details.", 400)
    );
  }

  // ======================================================
  // Upload Images
  // ======================================================

  let uploadedImages = [];

  if (req.files?.images) {
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(
        image.tempFilePath,
        {
          folder: "Ecommerce_Product_Image",
          width: 1000,
          crop: "scale",
        }
      );

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  // ======================================================
  // Insert Product
  // ======================================================

  const insertProductQuery = `
    INSERT INTO products (
      name,
      description,
      price,
      category,
      stock,
      images,
      created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    name,
    description,
    price / 284,
    category,
    stock,
    JSON.stringify(uploadedImages),
    createdBy,
  ];

  const product = await database.query(insertProductQuery, values);

  // ======================================================
  // Response
  // ======================================================

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    product: product.rows[0],
  });
});


// ======================================================
// FETCH ALL PRODUCTS
// ======================================================

export const fetchAllProducts = catchAsyncErrors(
  async (req, res, next) => {
    const {
      availability,
      price,
      category,
      ratings,
      search,
    } = req.query;

    // ======================================================
    // Pagination
    // ======================================================

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // ======================================================
    // Dynamic Filtering
    // ======================================================

    const conditions = [];
    const values = [];

    let index = 1;

    // Availability Filter
    if (availability === "in-stock") {
      conditions.push(`stock > 0`);
    }

    // Price Filter
    if (price) {
      const [minPrice, maxPrice] = price.split("-");

      if (minPrice && maxPrice) {
        conditions.push(
          `price BETWEEN $${index} AND $${index + 1}`
        );

        values.push(minPrice, maxPrice);

        index += 2;
      }
    }

    // Category Filter
    if (category) {
      conditions.push(`category ILIKE $${index}`);

      values.push(`%${category}%`);

      index++;
    }

    // Ratings Filter
    if (ratings) {
      conditions.push(`ratings >= $${index}`);

      values.push(ratings);

      index++;
    }

    // Search Filter
    if (search) {
      conditions.push(`
        (
          p.name ILIKE $${index}
          OR p.description ILIKE $${index}
        )
      `);

      values.push(`%${search}%`);

      index++;
    }

    // ======================================================
    // WHERE CLAUSE
    // ======================================================

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    // ======================================================
    // TOTAL PRODUCTS COUNT
    // ======================================================

    const totalProductsQuery = `
      SELECT COUNT(*) 
      FROM products p
      ${whereClause}
    `;

    const totalProductsResult = await database.query(
      totalProductsQuery,
      values
    );

    const totalProducts = Number(
      totalProductsResult.rows[0].count
    );

    // ======================================================
    // Pagination Placeholders
    // ======================================================

    const limitPlaceholder = `$${index}`;
    values.push(limit);

    index++;

    const offsetPlaceholder = `$${index}`;
    values.push(offset);

    // ======================================================
    // FETCH PRODUCTS
    // ======================================================

    const fetchProductsQuery = `
      SELECT
        p.*,
        COUNT(r.id) AS review_count

      FROM products p

      LEFT JOIN reviews r
      ON p.id = r.product_id

      ${whereClause}

      GROUP BY p.id

      ORDER BY p.created_at DESC

      LIMIT ${limitPlaceholder}
      OFFSET ${offsetPlaceholder}
    `;

    const productsResult = await database.query(
      fetchProductsQuery,
      values
    );

    // ======================================================
    // FETCH NEW PRODUCTS
    // ======================================================

    const newProductsQuery = `
      SELECT
        p.*,
        COUNT(r.id) AS review_count

      FROM products p

      LEFT JOIN reviews r
      ON p.id = r.product_id

      WHERE p.created_at >= NOW() - INTERVAL '7 days'

      GROUP BY p.id

      ORDER BY p.created_at DESC

      LIMIT 8
    `;

    const newProductsResult = await database.query(
      newProductsQuery
    );

   
  }
);