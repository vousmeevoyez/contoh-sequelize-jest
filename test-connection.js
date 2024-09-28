const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Tambahan: coba dapatkan daftar tabel
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log("Tables in the database:", tables);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
