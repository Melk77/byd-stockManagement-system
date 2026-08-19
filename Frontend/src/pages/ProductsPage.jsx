import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/Loading.jsx";
import "../styles/ProductsPage.css";

const ProductsPage = () => {
  const { token } = useAuth();

  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [sellQuantities, setSellQuantities] = useState({});

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/spare-parts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch spare parts");
      }

      setSpareParts(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchSpareParts();
  }, [token]);

  const filteredParts = spareParts.filter((part) =>
    part.name.toLowerCase().includes(nameFilter.trim().toLowerCase())
  );

  const handleSell = async (part) => {
    const entered = sellQuantities[part.id];
    const sellQty = entered === undefined || entered === "" ? 1 : Number(entered);

    if (!sellQty || sellQty <= 0 || sellQty > part.quantity) return;

    await fetch(`http://localhost:5000/api/spare-parts/${part.id}/sell`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: sellQty }),
    });

    setSellQuantities((prev) => ({ ...prev, [part.id]: "" }));
    fetchSpareParts();
  };

  const handleRemove = async (part) => {
    const confirmed = window.confirm(`Remove "${part.name}" from inventory?`);
    if (!confirmed) return;

    await fetch(`http://localhost:5000/api/spare-parts/${part.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchSpareParts();
  };

  if (loading) {
    return <Loading message="Loading spare parts..." />;
  }

  return (
    <div className="products-page">
      <h2>Spare Parts</h2>

      <div className="spare-parts-filters">
        <input
          type="text"
          placeholder="Search part name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}

      {!error && spareParts.length === 0 && (
        <p className="empty-state">
          No spare parts yet — add one from the Add Spare Part page.
        </p>
      )}

      {!error && spareParts.length > 0 && filteredParts.length === 0 && (
        <p className="empty-state">No spare parts match "{nameFilter}".</p>
      )}

      {filteredParts.length > 0 && (
        <table className="spare-parts-table">
          <thead>
            <tr>
              <th>Spare Part Name</th>
              <th>Quantity</th>
              <th>Minimum Price</th>
              <th>Maximum Price</th>
              <th>Car Model</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map((part) => (
              <tr key={part.id}>
                <td>{part.name}</td>
                <td>{part.quantity}</td>
                <td>{part.minPrice ?? "—"}</td>
                <td>{part.maxPrice ?? "—"}</td>
                <td>
                  {part.carModel?.carModel} {part.carModel?.year || ""}
                </td>
                <td className="row-actions-cell">
                  <input
                    type="number"
                    min="1"
                    max={part.quantity}
                    placeholder="Qty"
                    className="sell-qty-input"
                    value={sellQuantities[part.id] ?? ""}
                    onChange={(e) =>
                      setSellQuantities((prev) => ({
                        ...prev,
                        [part.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="action-button sell-btn"
                    disabled={part.quantity === 0}
                    onClick={() => handleSell(part)}
                  >
                    Sell
                  </button>
                  <button
                    className="action-button delete-btn"
                    onClick={() => handleRemove(part)}
                  >
                    Remove
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

export default ProductsPage;
