import React, { useState } from "react";
import "../../global.css"; // Make sure the path is correct
import logo from "../../assets/logo.jpg"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate login check (replace with real API call)
    if (formData.username === "admin" && formData.password === "admin") {
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left section with logo */}
        <div className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo-image small-logo" />
        </div>

        {/* Right section with form */}
        <div className="form-wrapper">
          <h2 className="form-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
              <div style={{ textAlign: "right", marginTop: "5px" }}>
                <input
                  type="checkbox"
                  id="showPassword"
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showPassword" style={{ marginLeft: "5px" }}>
                  Show Password
                </label>
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="form-footer">
            Don't have an account?
            <a href="/register" className="link">
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
