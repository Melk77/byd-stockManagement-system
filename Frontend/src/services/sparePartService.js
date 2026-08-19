const BASE_URL = "https://tmsimport-backend.vercel.app/api/spare-parts";

export const fetchDashboardSummary = async (token) => {
  const response = await fetch(`${BASE_URL}/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load dashboard summary.");
  }

  return data.data;
};

export const createSparePart = async (
  token,
  { carModelId, name, quantity, minPrice, maxPrice },
) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ carModelId, name, quantity, minPrice, maxPrice }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add spare part.");
  }

  return data.data;
};

export const updateSparePart = async (
  token,
  id,
  { name, minPrice, maxPrice },
) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, minPrice, maxPrice }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update spare part.");
  }

  return data.data;
};

