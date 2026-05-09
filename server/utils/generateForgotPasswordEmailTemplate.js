export const generateForgotPasswordEmailTemplate = (resetPasswordUrl) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">
            
            <tr>
              <td style="background:#111827; padding:30px; text-align:center;">
                <h1 style="color:#ffffff; margin:0;">Reset Your Password</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:40px;">
                
                <p style="font-size:16px; color:#333;">
                  Hello,
                </p>

                <p style="font-size:16px; color:#555; line-height:1.6;">
                  We received a request to reset your password. Click the button below to create a new password.
                </p>

                <div style="text-align:center; margin:35px 0;">
                  <a 
                    href="${resetPasswordUrl}" 
                    style="
                      background:#2563eb;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 28px;
                      border-radius:6px;
                      display:inline-block;
                      font-size:16px;
                      font-weight:bold;
                    "
                  >
                    Reset Password
                  </a>
                </div>

                <p style="font-size:14px; color:#777; line-height:1.6;">
                  If you did not request a password reset, you can safely ignore this email.
                </p>

                <p style="font-size:14px; color:#777; margin-top:30px;">
                  This link may expire after 10 mins time for security reasons.
                </p>

              </td>
            </tr>

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