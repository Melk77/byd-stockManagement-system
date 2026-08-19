import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/HistoryPage.css";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [history, setHistory] = useState([]);
  const [timeframe, setTimeframe] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch history");
      }

      setHistory(data.history || data);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const getHistoryByTimeframe = (items) => {
    const now = new Date();

    return items.filter((item) => {
      const soldDate = new Date(item.soldDate);

      switch (timeframe) {
        case "day":
          return (
            soldDate.getDate() === now.getDate() &&
            soldDate.getMonth() === now.getMonth() &&
            soldDate.getFullYear() === now.getFullYear()
          );

        case "week": {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);

          return soldDate >= weekAgo;
        }

        case "month":
          return (
            soldDate.getMonth() === now.getMonth() &&
            soldDate.getFullYear() === now.getFullYear()
          );

        case "year":
          return soldDate.getFullYear() === now.getFullYear();

        default:
          return true;
      }
    });
  };


  const displayedHistory =
    timeframe === "all"
      ? history
      : getHistoryByTimeframe(history);


  const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  if (loading) {
    return (
      <div className="history-page">
        <h2>Loading sales history...</h2>
      </div>
    );
  }


  return (
    <div className="history-page">

      <h2>Sales History</h2>

      {error && (
        <p className="error">
          {error}
        </p>
      )}


      <div className="filter-section">

        <label htmlFor="timeframe-select">
          Filter by:
        </label>

        <select
          id="timeframe-select"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="timeframe-select"
        >
          <option value="all">
            All Time
          </option>

          <option value="day">
            Today
          </option>

          <option value="week">
            This Week
          </option>

          <option value="month">
            This Month
          </option>

          <option value="year">
            This Year
          </option>

        </select>

      </div>


      {displayedHistory.length === 0 ? (

        <div className="no-history">
          <p>
            No sales records found.
          </p>
        </div>

      ) : (

        <div className="history-list">

          {displayedHistory.map((item) => (

            <div
              key={item.id}
              className="history-item"
            >

              <div className="history-info">

                <h4>
                  {item.sparePartName}
                </h4>

                <p className="car-model">
                  {item.carModel} {item.year}
                </p>

                <p className="sold-date">
                  {formatDate(item.soldDate)}
                </p>

              </div>


              <div className="quantity-badge">

                <span>
                  {item.quantity} sold
                </span>

              </div>


            </div>

          ))}

        </div>

      )}


      <div className="history-navigation">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>

      </div>

    </div>
  );
};

export default HistoryPage;