require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const carModelRoutes = require("./src/routes/carModelRoutes");
const authRoutes = require("./src/routes/authRoutes");
const sparePartRoutes = require("./src/routes/sparePartRoutes");
const historyRoutes = require("./src/routes/historyRoutes");
const userRoutes = require("./src/routes/userRoutes");

// Error handling middleware
const notFound = require("./src/middleware/notFound");
const errorHandler = require("./src/middleware/errorHandler");

// API routes
app.use("/api/car-models", carModelRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/spare-parts", sparePartRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);

// Must be mounted last
app.use(notFound);
app.use(errorHandler);

// Export Express app for Vercel
module.exports = app;
