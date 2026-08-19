import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { createCarModel } from "../services/carModelService.js";
import "../styles/AddCarModelPage.css";

const AddCarModelPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [carModel, setCarModel] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!carModel.trim()) {
      setError("Car model name is required.");
      return;
    }

    setSubmitting(true);

    try {
      await createCarModel(token, {
        carModel: carModel.trim(),
        year: year.trim() || undefined,
      });

      setSuccess(`"${carModel}" added successfully.`);
      setCarModel("");
      setYear("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-car-model-page">
      <form className="add-car-model-form" onSubmit={handleSubmit}>
        <h2>Add Car Model</h2>

        <label>
          Car Model
          <input
            type="text"
            placeholder="e.g. Song Plus"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
          />
        </label>

        <label>
          Year (optional)
          <input
            type="text"
            placeholder="e.g. 2024"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Car Model"}
        </button>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/car-models")}
        >
          ← Back
        </button>
      </form>
    </div>
  );
};

export default AddCarModelPage;

