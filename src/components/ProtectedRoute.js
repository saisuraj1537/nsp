import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        if (isAuthenticated !== false) setIsAuthenticated(false); // ✅ Avoid unnecessary re-renders
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/verifyToken", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });

        if (response.ok) {
          if (isAuthenticated !== true) setIsAuthenticated(true); // ✅ Update only when necessary
        } else {
          localStorage.removeItem("jwt_token"); 
          if (isAuthenticated !== false) setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("jwt_token");
        if (isAuthenticated !== false) setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [isAuthenticated]); // ✅ Use `isAuthenticated` as a dependency to prevent infinite loops

  if (isAuthenticated === false) return <Navigate to="/login" replace />;
  if (isAuthenticated === null) return <p>Loading...</p>;

  return children;
};

export default ProtectedRoute;
