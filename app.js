require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const createInitialAdmin = require("./initAdmin");

const app = express();

const PORT = process.env.PORT || 4000;

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.timeout = 300000; // 5 menit

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "JelajahNusantara API",
      version: "1.0.0",
      description: "API untuk JelajahNusantara",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
      },
      {
        url: "https://jelajah-nusantara-backend.vercel.app/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Routes
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true, customCssUrl: CSS_URL })
);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profiles", userProfileRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to JelajahNusantara API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Sync database and start server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, async () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
      if(process.env.NODE_ENV !== 'test'){
        await createInitialAdmin();
      }
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });

module.exports = app;
