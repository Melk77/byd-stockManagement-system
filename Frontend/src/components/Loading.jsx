import React from "react";
import "../styles/Loading.css";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="loading-wrapper">
      <div className="loading-spinner" />
      <p>{message}</p>
    </div>
  );
};

export default Loading;

