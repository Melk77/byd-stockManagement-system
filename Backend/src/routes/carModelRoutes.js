const express = require("express");
const router = express.Router();

const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

const {
  getAllCarModels,
  createCarModel,
  updateCarModel,
  deleteCarModel,
} = require("../controllers/carModelController");

router.get("/", verifyToken, getAllCarModels);
router.post("/", verifyToken, createCarModel);

// Editing/deleting a car model is ADMIN-only — renaming or removing a
// model affects every spare part attached to it.
router.patch("/:id", verifyToken, requireAdmin, updateCarModel);
router.delete("/:id", verifyToken, requireAdmin, deleteCarModel);

module.exports = router;
