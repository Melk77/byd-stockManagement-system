const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { getAllHistory } = require("../controllers/historyController");

router.get("/", verifyToken, getAllHistory);

module.exports = router;
