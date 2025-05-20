const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
  try {
    // Validate environment variables
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email configuration is missing. Please check your environment variables.");
    }

    // Create a transporter with more reliable options
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Add these options for better reliability
      pool: true,
      maxConnections: 1,
      maxMessages: 3,
      rateDelta: 1000,
      rateLimit: 3
    });

    // Verify transporter configuration
    await transporter.verify();

    // Define the email options with improved headers
    const mailOptions = {
      from: {
        name: "Student Management System",
        address: process.env.EMAIL_USERNAME
      },
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'Student Management System Mailer'
      }
    };

    // Send the email using proper async/await
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
