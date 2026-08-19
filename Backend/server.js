require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const carModelRoutes = require("./src/routes/carModelRoutes");
const authRoutes = require("./src/routes/authRoutes");
const sparePartRoutes = require("./src/routes/sparePartRoutes");
const historyRoutes = require("./src/routes/historyRoutes");
const userRoutes = require("./src/routes/userRoutes");

const notFound = require("./src/middleware/notFound");
const errorHandler = require("./src/middleware/errorHandler");

app.use("/api/car-models", carModelRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/spare-parts", sparePartRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);

// Must be mounted last: 404 catch-all, then the error handler.
app.use(notFound);
app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
