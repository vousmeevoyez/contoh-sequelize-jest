// uploadConfig.js
const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");

// Konfigurasi penyimpanan memori Multer
const storage = multer.memoryStorage();

// Konfigurasi Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Contoh: batas 10MB
});

// Fungsi untuk mengunggah ke Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve(null);
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "user_profiles", timeout: 60000 }, // 60 detik timeout
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(file.buffer);
  });
};

module.exports = { upload, uploadToCloudinary };
