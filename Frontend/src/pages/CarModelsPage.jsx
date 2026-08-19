import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchCarModels,
  updateCarModel,
  deleteCarModel,
} from "../services/carModelService.js";
import Loading from "../components/Loading.jsx";
import "../styles/CarModelsPage.css";

const CarModelsPage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [carModels, setCarModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editCarModel, setEditCarModel] = useState("");
  const [editYear, setEditYear] = useState("");

  const load = () => {
    setLoading(true);
    fetchCarModels(token)
      .then(setCarModels)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (model) => {
    setEditingId(model.id);
    setEditCarModel(model.carModel);
    setEditYear(model.year || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCarModel("");
    setEditYear("");
  };

  const saveEdit = async (id) => {
    try {
      await updateCarModel(token, id, {
        carModel: editCarModel.trim(),
        year: editYear.trim() || null,
      });
      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (model) => {
    const confirmed = window.confirm(
      `Delete "${model.carModel}${model.year ? " " + model.year : ""}"? This also deletes every spare part attached to it.`
    );
    if (!confirmed) return;

    try {
      await deleteCarModel(token, model.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Loading message="Loading car models..." />;
  }

  return (
    <div className="car-models-page">
      <h2>Car Models</h2>

      {error && <p className="error">{error}</p>}

      <div className="car-models-list">
        {carModels.length === 0 && (
          <p className="empty-state">No car models yet.</p>
        )}

        {carModels.map((model) => (
          <div className="car-model-row" key={model.id}>
            {editingId === model.id ? (
              <>
                <input
                  value={editCarModel}
                  onChange={(e) => setEditCarModel(e.target.value)}
                />
                <input
                  value={editYear}
                  placeholder="Year (optional)"
                  onChange={(e) => setEditYear(e.target.value)}
                />
                <div className="row-actions">
                  <button className="save-btn" onClick={() => saveEdit(model.id)}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="car-model-name">
                  {model.carModel} {model.year || ""}
                </span>
                <div className="row-actions">
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(
                        `/spare-parts/${model.year ? `${model.id}-${model.year}` : model.id}`
                      )
                    }
                  >
                    View Parts
                  </button>

                  {user?.role === "ADMIN" && (
                    <>
                      <button className="edit-btn" onClick={() => startEdit(model)}>
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(model)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        className="add-new-item-button"
        onClick={() => navigate("/add-car-model")}
      >
        + Add Car Model
      </button>
    </div>
  );
};

export default CarModelsPage;

