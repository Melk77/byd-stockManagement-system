import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const rowOne = [
    "Rear Engine Hood",
    "Rear Door RHS",
    "Fender",
    "Knuckle",
    "Steering Rack",
    "Front Windshield Glass",
    "Rear Bumper",
    "Stabilizer Link",
  ];

  const rowTwo = [
    "Brake Pad",
    "Brake Disc",
    "Headlight",
    "Tail Light",
    "Battery",
    "Motor",
    "Shock Absorber",
    "Air Filter",
  ];

  return (
    <div className="home-page">

      {/* Fixed Header */}
      <header className="header">
        <button
          className="next-button"
          onClick={() => navigate("/login")}
        >
          Get Started →
        </button>
      </header>

      {/* Welcome */}
      <div className={`welcome-content ${isVisible ? "fade-in" : ""}`}>
        <h1>
          Welcome to TMS Import Stock Management System
        </h1>
      </div>

      {/* Carousel */}
      <div className="carousel-section">

        <div className="carousel">
          <div className="carousel-track left">
            {[...rowOne, ...rowOne].map((part, index) => (
              <div className="carousel-card" key={index}>
                {part}
              </div>
            ))}
          </div>
        </div>

        <div className="carousel">
          <div className="carousel-track right">
            {[...rowTwo, ...rowTwo].map((part, index) => (
              <div className="carousel-card" key={index}>
                {part}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default HomePage;