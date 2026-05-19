export const generateForgotPasswordEmailTemplate = (resetPasswordUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0; background-color:#f4f4f4;">
    <tr>
      <td align="center">

        <!-- Email Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#111827; padding:30px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:22px;">
                Reset Your Password
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="font-size:16px; color:#333; margin:0 0 15px;">
                Hello,
              </p>

              <p style="font-size:16px; color:#555; line-height:1.6; margin:0 0 20px;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${resetPasswordUrl}"
                  style="
                    background:#2563eb;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 30px;
                    border-radius:6px;
                    display:inline-block;
                    font-size:16px;
                    font-weight:bold;
                  "
                  target="_blank"
                >
                  Reset Password
                </a>
              </div>

              <p style="font-size:14px; color:#777; line-height:1.6; margin:0 0 10px;">
                If you did not request this, you can safely ignore this email.
              </p>

              <p style="font-size:14px; color:#777; margin:0;">
                For security reasons, this link will expire in <strong>10 minutes</strong>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6; padding:20px; text-align:center;">
              <p style="margin:0; font-size:13px; color:#666;">
                © 2026 Your App. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};