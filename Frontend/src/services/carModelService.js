const BASE_URL = "https://tmsimport-backend.vercel.app/api/car-models";

export const fetchCarModels = async (token) => {
  const response = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load car models.");
  }

  return data.data;
};

export const createCarModel = async (token, { carModel, year }) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ carModel, year }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add car model.");
  }

  return data.data;
};

export const updateCarModel = async (token, id, { carModel, year }) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ carModel, year }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update car model.");
  }

  return data.data;
};

export const deleteCarModel = async (token, id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete car model.");
  }

  return data;
};

