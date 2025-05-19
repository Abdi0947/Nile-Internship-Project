const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
  // 1) Create a transporter

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `Student Management System" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(process.env.EMAIL_USERNAME);
      console.log(process.env.EMAIL_PASSWORD);
      console.error("Email sending error:", error);
      return;
    }
    console.log("Email sent:", info.response);
  });
};

module.exports = sendEmail;
