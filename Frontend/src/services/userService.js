const BASE_URL = "http://localhost:5000/api/users";

export const fetchUsers = async (token) => {
  const response = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load users.");
  }

  return data.data;
};

// The internal replacement for a public registration page: only an
// already-logged-in ADMIN can call this (enforced server-side too).
export const createUser = async (
  token,
  { name, username, email, password, role },
) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, username, email, password, role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create user.");
  }

  return data.data;
};

export const updateUser = async (token, id, { role, isActive }) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role, isActive }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update user.");
  }

  return data.data;
};

// Self-service: the logged-in user changes their own username and/or
// password. currentPassword is always required by the backend.
export const updateMyAccount = async (
  token,
  { username, currentPassword, newPassword },
) => {
  const response = await fetch(`${BASE_URL}/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, currentPassword, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update your account.");
  }

  return data.data;
};
