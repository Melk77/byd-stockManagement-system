import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordRequest } from "../services/authService.js";
import "../styles/LoginPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const data = await forgotPasswordRequest(email);
      setSuccess(data.message || "If an account with that email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <p>Enter the email tied to your account and we'll send you a link to reset your password.</p>

        <label>
          Email
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send Reset Link"}
        </button>

        <Link className="back-to-login-link" to="/login">
          Back to login
        </Link>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
