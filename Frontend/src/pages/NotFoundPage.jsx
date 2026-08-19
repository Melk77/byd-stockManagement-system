import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <button onClick={() => navigate("/")}>← Back to Home</button>
    </div>
  );
};

export default NotFoundPage;

