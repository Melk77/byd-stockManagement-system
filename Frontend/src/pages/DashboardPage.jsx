import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchDashboardSummary } from "../services/sparePartService.js";
import Loading from "../components/Loading.jsx";
import "../styles/DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary(token)
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <p className="error">{error}</p>
      </div>
    );
  }

  const tiles = [
    { label: "Car Models", value: summary.carModelCount },
    { label: "Spare Parts", value: summary.totalParts },
    { label: "Total Units in Stock", value: summary.totalUnits },
    { label: "Low Stock (≤ 5)", value: summary.lowStock, warn: true },
    { label: "Out of Stock", value: summary.outOfStock, danger: true },
  ];

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>

      <div className="dashboard-grid">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={`dashboard-tile ${tile.danger ? "danger" : ""} ${
              tile.warn ? "warn" : ""
            }`}
          >
            <span className="tile-value">{tile.value}</span>
            <span className="tile-label">{tile.label}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-actions">
        <button onClick={() => navigate("/products")}>View Catalogue</button>
        <button onClick={() => navigate("/history")}>Sales History</button>
      </div>
    </div>
  );
};

export default DashboardPage;

