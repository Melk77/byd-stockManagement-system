const express = require("express");
const router = express.Router();

const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  createUser,
  updateUser,
  updateMyAccount,
} = require("../controllers/userController");

// Every route below requires a logged-in user.
router.use(verifyToken);

// Self-service: any logged-in user can update their own username/password.
router.patch("/me", updateMyAccount);

// Everything past this point is ADMIN-only.
router.use(requireAdmin);

router.get("/", getAllUsers);
router.post("/", createUser);
router.patch("/:id", updateUser);

module.exports = router;
