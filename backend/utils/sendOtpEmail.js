const nodemailer = require('nodemailer');

/**
 * Utility to send OTP via Nodemailer (Gmail) or Google Apps Script, with console fallback
 * @param {string} email
 * @param {string} name
 * @param {string} otp
 */
const sendOtpEmail = async (email, name, otp) => {
  console.log(`\n========================================`);
  console.log(`🔑 [OTP NOTIFICATION]`);
  console.log(`Recipient: ${name || 'User'} <${email}>`);
  console.log(`OTP Code : ${otp}`);
  console.log(`Sender   : ${process.env.EMAIL_USER || 'bintrash47@gmail.com'}`);
  console.log(`Validity : 5 minutes`);
  console.log(`========================================\n`);

  let emailSent = false;

  // 1. Attempt Nodemailer SMTP (Gmail) if credentials are present
  const emailUser = process.env.EMAIL_USER || 'bintrash47@gmail.com';
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && emailPass && emailPass.trim() !== '') {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser.trim(),
          pass: emailPass.trim(),
        },
      });

      const mailOptions = {
        from: `"Rider Rescue" <${emailUser}>`,
        to: email,
        subject: `🔑 [Rider Rescue] Your 6-Digit Verification Code: ${otp}`,
        html: `
          <div style="background-color: #080B12; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px; border-radius: 16px; max-width: 500px; margin: 20px auto; border: 1px solid rgba(245, 158, 11, 0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #F59E0B; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px;">RIDER<span style="color: #FFFFFF;">RESCUE</span></h1>
              <p style="color: #06B6D4; font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">24/7 Roadside Assistance & Fuel Dispatch</p>
            </div>
            <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 20px 0;"></div>
            <p style="font-size: 14px; color: #E2E8F0; margin-bottom: 8px;">Hello <strong>${name || 'Rider'}</strong>,</p>
            <p style="font-size: 13px; color: #94A3B8; line-height: 1.6;">
              Thank you for registering with Rider Rescue. Please use the 6-digit verification code below to verify your account and activate emergency dispatch access:
            </p>
            <div style="background: rgba(245, 158, 11, 0.08); border: 2px dashed #F59E0B; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0;">
              <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #F59E0B; font-family: monospace;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #64748B; text-align: center; margin: 0;">
              ⏱️ This OTP code is valid for <strong>5 minutes</strong>.
            </p>
            <div style="height: 1px; background: rgba(255,255,255,0.08); margin: 24px 0 16px;"></div>
            <p style="font-size: 11px; color: #475569; text-align: center; margin: 0;">
              If you did not request this verification code, please ignore this email.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ [Nodemailer] Successfully sent OTP email to ${email} via ${emailUser}`);
      emailSent = true;
      return { success: true, method: 'smtp' };
    } catch (err) {
      console.warn(`⚠️ [Nodemailer Warning] Could not send via Gmail SMTP: ${err.message}`);
    }
  }

  // 2. Attempt Google Apps Script Webhook if configured
  const scriptUrl = process.env.GOOGLE_SCRIPT_EMAIL_URL;
  if (
    scriptUrl &&
    scriptUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL' &&
    scriptUrl.startsWith('http')
  ) {
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, otp, sender: emailUser }),
        redirect: 'follow',
      });
      console.log(`✅ [Email Webhook] Dispatched to Google Apps Script, status: ${response.status}`);
      emailSent = true;
      return { success: true, method: 'webhook', status: response.status };
    } catch (error) {
      console.warn(`⚠️ [Email Webhook Warning] Could not reach Google Apps Script: ${error.message}`);
    }
  }

  if (!emailSent) {
    console.log(
      `ℹ️ [OTP Info] Email service simulated/logged. Set EMAIL_PASS in backend/.env for live Gmail delivery.`
    );
  }

  return { success: true, method: emailSent ? 'sent' : 'console', simulated: !emailSent };
};

module.exports = sendOtpEmail;
