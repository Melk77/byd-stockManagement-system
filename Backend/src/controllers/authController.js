const {
  login,
  forgotPassword,
  resetPassword,
} = require("../services/authService");

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await login(username, password);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const forgotPasswordHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    await forgotPassword(email);

    res.json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("forgotPassword error:", error); // <-- add this line
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
const resetPasswordHandler = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required.",
      });
    }

    await resetPassword(token, password);

    res.json({
      success: true,
      message: "Password has been reset. You can now log in.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  loginUser,
  forgotPasswordHandler,
  resetPasswordHandler,
};
