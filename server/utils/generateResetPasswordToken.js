// ======================================================
// IMPORTS
// ======================================================

import crypto from "crypto";


// ======================================================
// GENERATE RESET PASSWORD TOKEN
// ======================================================

export const generateResetPasswordToken = () => {
  
  // ======================================================
  // GENERATE RANDOM TOKEN (UNHASHED)
  // ======================================================
  
  const resetToken = crypto
    .randomBytes(20)
    .toString("hex");

  // ======================================================
  // HASH TOKEN FOR DATABASE STORAGE
  // ======================================================

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // ======================================================
  // SET EXPIRY TIME (15 MINUTES)
  // ======================================================

  const resetPasswordExpireTime =
    Date.now() + 15 * 60 * 1000;

  // ======================================================
  // RETURN TOKEN DATA
  // ======================================================

  return {
    resetToken,
    hashedToken,
    resetPasswordExpireTime,
  };
};