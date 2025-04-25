import API from "../../API"
import logo from "../../assets/logo.jpg"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import getCSRFToken from "./getCSRFToken.jsx";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    getCSRFToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/api/auth/login/", formData);
      const role = response.data.user.role;

      if (role === "student") navigate("/studdash");
      else if (role === "lecturer") navigate("/lectdash");
      else if (role === "registrar") navigate("/regdash");
      else navigate("/unknown-role");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Form Section */}
        <div className="form-wrapper">
          <h2 className="form-title">Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">User Name</label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your User Name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                autoFocus
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="form-input"
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "LOGGING IN..." : "L O G I N"}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Don't have an account? <Link to="/register" className="link">Register</Link>
            </p>
            <p>
              <Link to="/forgot-password" className="link">Forgot Password?</Link>
              <Link to="/" className="link">Back Home</Link>
            </p>
          </div>
        </div>

        {/* Logo Section */}
        <div className="logo-wrapper">
          <img src={logo} alt="logo" className="logo-image" />
        </div>
      </div>
    </div>
  );
}

export default Login;
