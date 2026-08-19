const express = require("express");
const {
  loginUser,
  forgotPasswordHandler,
  resetPasswordHandler,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

module.exports = router;
