import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchCarModels } from "../services/carModelService.js";
import { createSparePart } from "../services/sparePartService.js";
import Loading from "../components/Loading.jsx";
import "../styles/AddSparePartPage.css";

const AddSparePartPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [carModels, setCarModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carModelId, setCarModelId] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCarModels(token)
      .then((data) => setCarModels(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!carModelId) {
      setError("Choose a car model.");
      return;
    }
    if (!name.trim()) {
      setError("Part name is required.");
      return;
    }
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setError("Minimum price cannot be greater than maximum price.");
      return;
    }

    setSubmitting(true);

    try {
      await createSparePart(token, {
        carModelId,
        name: name.trim(),
        quantity: Number(quantity) || 0,
        minPrice: minPrice === "" ? undefined : Number(minPrice),
        maxPrice: maxPrice === "" ? undefined : Number(maxPrice),
      });

      setSuccess(`"${name}" added successfully.`);
      setName("");
      setQuantity("");
      setMinPrice("");
      setMaxPrice("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading car models..." />;
  }

  return (
    <div className="add-spare-part-page">
      <form className="add-spare-part-form" onSubmit={handleSubmit}>
        <h2>Add Spare Part</h2>

        <label>
          Car Model
          <select
            value={carModelId}
            onChange={(e) => setCarModelId(e.target.value)}
          >
            <option value="">Select a car model</option>
            {carModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.carModel} {model.year || ""}
              </option>
            ))}
          </select>
        </label>

        {carModels.length === 0 && (
          <p className="hint">
            No car models yet —{" "}
            <span
              className="hint-link"
              onClick={() => navigate("/add-car-model")}
            >
              add one first
            </span>
            .
          </p>
        )}

        <label>
          Part Name
          <input
            type="text"
            placeholder="e.g. Rear Engine Hood"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Quantity
          <input
            type="number"
            min="0"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>

        <div className="price-row">
          <label>
            Minimum Price
            <input
              type="number"
              min="0"
              placeholder="e.g. 260000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </label>

          <label>
            Maximum Price
            <input
              type="number"
              min="0"
              placeholder="e.g. 260000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </label>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/car-models")}
          >
            ← Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSparePartPage;

