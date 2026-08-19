import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer automatically whenever the route changes
  // (i.e. after tapping a link), so it doesn't stay open over the new page.
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!user) {
    return null;
  }

  const displayName = user.name || user.email || "User";

  const handleLogout = () => {
    // Order matters here: navigate to a public route FIRST, then clear
    // auth state. If logout() ran first, the current (protected) route's
    // own ProtectedRoute would see the user disappear and redirect to
    // /login itself, winning the race against this navigate("/") call.
    logout();
    window.location.href = "/";
  };

  return (
    <>
      {/* Only visible on narrow screens (see Navbar.css) */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Tapping outside the open drawer closes it */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-container">
          <div className="sidebar-scroll">
            <div className="profile">
              <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
              <div>
                <h4>{displayName}</h4>
                <span className="role-badge">{user.role}</span>
              </div>
            </div>

            <nav className="nav-links">
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/car-models" className={linkClass}>
                Car Models
              </NavLink>
              <NavLink to="/products" className={linkClass}>
                View Spare Parts
              </NavLink>
              <NavLink to="/add-spare-part" className={linkClass}>
                Add Spare Part
              </NavLink>
              <NavLink to="/history" className={linkClass}>
                Sales History
              </NavLink>
              {user.role === "ADMIN" && (
                <NavLink to="/users" className={linkClass}>
                  Manage Users
                </NavLink>
              )}
              <NavLink to="/account-settings" className={linkClass}>
                Account Settings
              </NavLink>
            </nav>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
