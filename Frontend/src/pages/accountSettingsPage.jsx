import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { updateMyAccount } from "../services/userService.js";
import "../styles/LoginPage.css";

const AccountSettingsPage = () => {
  const { user, token, updateUser } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Enter your current password to save changes.");
      return;
    }

    const usernameChanged = username.trim() && username.trim() !== user.username;
    const wantsPasswordChange = newPassword || confirmNewPassword;

    if (!usernameChanged && !wantsPasswordChange) {
      setError("Change your username and/or enter a new password first.");
      return;
    }

    if (wantsPasswordChange) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(newPassword)) {
        setError(
          "New password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
        );
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const updated = await updateMyAccount(token, {
        username: usernameChanged ? username.trim() : undefined,
        currentPassword,
        newPassword: wantsPasswordChange ? newPassword : undefined,
      });

      updateUser({ username: updated.username });

      setSuccess("Your account has been updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login" onSubmit={handleSubmit}>
        <h2>Account Settings</h2>
        <p>Update your username and/or password.</p>

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
          />
        </label>

        <label>
          New Password
          <input
            type="password"
            placeholder="Leave blank to keep your current password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
          />
        </label>

        <label>
          Confirm New Password
          <input
            type="password"
            placeholder="Re-enter the new password"
            value={confirmNewPassword}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
              setError("");
            }}
          />
        </label>

        <label>
          Current Password
          <input
            type="password"
            placeholder="Required to save any change"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setError("");
            }}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AccountSettingsPage;
