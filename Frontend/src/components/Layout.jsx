import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/Layout.css";

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const hideSidebar = location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="app-layout">
      {user && !hideSidebar && <Navbar />}

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
