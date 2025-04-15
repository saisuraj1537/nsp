import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../../firebase-config";
import "./index.css";
import droneBanner from "../../assets/company-logo.jpg";
import companyLogo from "../../assets/company-logo.jpg";
import googleLogo from "../../assets/googleLogo.jpg";

const GoogleAuth = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        try {
          const response = await fetch("https://nsp-oknl.onrender.com/verifyToken", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            navigate("/");
          } else {
            localStorage.removeItem("jwt_token"); // Invalid token, remove it
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("jwt_token");
        }
      }
    };

    verifyToken();
  }, [navigate]);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      const idToken = await result.user.getIdToken();

      if (!mobileNumber) {
        setError("Please enter your mobile number.");
        setLoading(false);
        return;
      }

      const response = await fetch("https://nsp-oknl.onrender.com/verifyUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobileNumber }),
      });

      const data = await response.json();
      if (response.ok && data.verified) {
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_phone", mobileNumber);
        navigate("/");
      } else {
        setError(data.error || "User not found or details do not match.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Failed to sign in. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="google-auth-container">
      <div className="login-card d-flex flex-row">
        <div className="left-card d-flex flex-column justify-content-around shadow-lg">
          <img src={companyLogo} className="w-25 align-self-center company-logo" alt="companylogo" />
          <div className="btn-card align-self-center shadow bg-body-tertiary rounded text-center d-flex flex-column align-items-center">
            <h3 className="pb-3">Login</h3>
            <input
              type="text"
              placeholder="Enter Mobile Number"
              className="form-control mb-3"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {error && <p className="error-message">{error}</p>}
                <button className="google-auth-button auth-button" onClick={handleSignIn} disabled={loading}>
                  <img src={googleLogo} className="google-logo" alt="Google logo" />
                  Sign in with Google
                </button>
              </>
            )}
          </div>
        </div>
        <div className="right-card">
          <img src={droneBanner} className="dronebanner" alt="bannerimg" />
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;
