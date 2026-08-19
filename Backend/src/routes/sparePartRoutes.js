const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
  getAllSpareParts,
  getDashboardSummary,
  getSparePartsByCarModel,
  createSparePart,
  updateSparePart,
  addSparePartQuantity,
  sellSparePartQuantity,
  deleteSparePart,
} = require("../controllers/sparePartController");

// All spare-part routes require a logged-in user (STAFF or ADMIN) —
// this is an internal-only system, so every route below sits behind verifyToken.
router.use(verifyToken);

// Must come before "/:carModelId" or Express will treat "summary" as an id.
router.get("/summary", getDashboardSummary);

router.get("/", getAllSpareParts);
router.get("/:carModelId", getSparePartsByCarModel);
router.post("/", createSparePart);
router.patch("/:id", updateSparePart);
router.patch("/:id/add", addSparePartQuantity);
router.patch("/:id/sell", sellSparePartQuantity);

router.delete("/:id", deleteSparePart);

module.exports = router;
