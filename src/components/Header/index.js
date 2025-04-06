import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import companyLogo from "../../assets/company-logo.jpg";
import "./index.css"

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    // setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={companyLogo} alt="Company Logo" width="120" />
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events">Events</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bonouscourses">Bonous Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/jobs">Job Board</Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to="/about"></Link>
            </li> */}
            <li className="nav-item">
              {isAuthenticated ? (
                <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
              ) : (
                <Link className="btn btn-primary" to="/login">Login</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
