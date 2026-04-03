const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to another provider or SMTP server details
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (toEmail, otp) => {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
    console.log('💡 Email skip: No valid EMAIL_USER configured in .env.');
    return; // Silently skip if not configured
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your Verification Code - Smart Queue Management',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email</h2>
        <p>Thank you for registering! Please use the following 6-digit OTP to verify your account.</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP Email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    // Don't throw, just log. The auth route handles the logic of continuing.
  }
};

module.exports = {
  sendOTP,
};
