const nodemailer = require("nodemailer");
require("dotenv").config(); // Memastikan dotenv diimpor untuk membaca file .env

const sendEmail = async (options) => {
  // Buat transporter menggunakan variabel lingkungan
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true untuk port 465, false untuk port lainnya (TLS)
    auth: {
      user: process.env.EMAIL_USER, // Mengambil user dari .env
      pass: process.env.EMAIL_PASS, // Mengambil password dari .env
    },
    tls: {
      rejectUnauthorized: false, // Mengabaikan sertifikat SSL yang tidak valid, digunakan untuk debugging
    },
  });

  // Definisikan opsi email
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Mengambil from dari .env
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Kirim email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Error stack:", error.stack);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
