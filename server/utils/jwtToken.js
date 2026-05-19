// ======================================================
// IMPORTS
// ======================================================

import jwt from "jsonwebtoken";


// ======================================================
// SEND JWT TOKEN
// ======================================================

export const sendToken = (user, statusCode, message, res) => {

  // ======================================================
  // GENERATE JWT TOKEN
  // ======================================================

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  // ======================================================
  // COOKIE OPTIONS
  // ======================================================

  const cookieExpireDays =
    process.env.COOKIE_EXPIRES_IN;

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        cookieExpireDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,

    // ======================================================
    // SECURITY (PRODUCTION SETTINGS)
    // ======================================================

    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // ======================================================
  // SEND RESPONSE
  // ======================================================

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      user,
      token,
    });
};