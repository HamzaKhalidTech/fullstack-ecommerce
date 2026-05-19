// ======================================================
// CUSTOM ERROR CLASS
// ======================================================

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // ======================================================
    // CAPTURE STACK TRACE (DEBUGGING PURPOSES)
    // ======================================================

    Error.captureStackTrace(this, this.constructor);
  }
}


// ======================================================
// GLOBAL ERROR MIDDLEWARE
// ======================================================

export const errorMiddleware = (err, req, res, next) => {

  // ======================================================
  // DEFAULT ERROR VALUES
  // ======================================================

  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // ======================================================
  // HANDLE DUPLICATE KEY ERROR (POSTGRES/DB UNIQUE)
  // ======================================================

  if (err.code === 11000) {
    err = new ErrorHandler(
      "Duplicate field value entered",
      400
    );
  }

  // ======================================================
  // HANDLE JWT ERRORS
  // ======================================================

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler(
      "JSON Web Token is invalid, try again",
      400
    );
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler(
      "JSON Web Token has expired, try again",
      400
    );
  }

  // ======================================================
  // EXTRACT VALIDATION ERROR MESSAGES
  // ======================================================

  const errMessage = err.errors
    ? Object.values(err.errors)
        .map((e) => e.message)
        .join(" ")
    : err.message;

  // ======================================================
  // FINAL RESPONSE
  // ======================================================

  return res.status(err.statusCode).json({
    success: false,
    message: errMessage,
  });
};


// ======================================================
// EXPORT ERROR CLASS
// ======================================================

export default ErrorHandler;