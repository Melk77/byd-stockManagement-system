import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchUsers, createUser, updateUser } from "../services/userService.js";
import Loading from "../components/Loading.jsx";
import "../styles/ManageUsersPage.css";

const ManageUsersPage = () => {
  const { token, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    fetchUsers(token)
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user?.role !== "ADMIN") {
    return (
      <div className="manage-users-page">
        <p className="error">Only an admin can manage users.</p>
      </div>
    );
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!name.trim() || !username.trim() || !email.trim()) {
      setFormError("Name, username, and email are required.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setFormError(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
      return;
    }

    setSubmitting(true);

    try {
      await createUser(token, { name, username, email, password, role });
      setFormSuccess(`Account created for ${username}.`);
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("STAFF");
      loadUsers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (targetUser) => {
    try {
      await updateUser(token, targetUser.id, { isActive: !targetUser.isActive });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleChange = async (targetUser, newRole) => {
    try {
      await updateUser(token, targetUser.id, { role: newRole });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="manage-users-page">
      <h2>Manage Users</h2>

      <form className="create-user-form" onSubmit={handleCreate}>
        <h3>Create Staff / Admin Account</h3>

        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="STAFF">STAFF</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        {formError && <p className="error">{formError}</p>}
        {formSuccess && <p className="success">{formSuccess}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Account"}
        </button>
      </form>

      <h3>Existing Users</h3>

      {loading ? (
        <Loading message="Loading users..." />
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u, e.target.value)}
                    disabled={u.id === user.id}
                  >
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>{u.isActive ? "Active" : "Deactivated"}</td>
                <td>
                  <button
                    className="toggle-active-button"
                    disabled={u.id === user.id}
                    onClick={() => handleToggleActive(u)}
                  >
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsersPage;

