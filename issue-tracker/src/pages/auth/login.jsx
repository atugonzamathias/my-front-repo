import API from "../../API";
import logo from "../../assets/logo.jpg";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post("api/auth/login/", formData);
      console.log("Login successful:", response.data);

      const role = response.data.role;

      // Redirect based on user role
      if (role === "student") {
        navigate("/studdash");
      } else if (role === "lecturer") {
        navigate("/lectdash");
      } else if (role === "registrar") {
        navigate("/regdash");
      } else {
        navigate("/unknown-role"); // fallback
      }

    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-4 flex gap-3 rounded-lg shadow-2xl">
        <div>
          <h2 className="text-left mb-4 font-bold text-blue-400">Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-600">
                User Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your User Name"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg block w-full p-2.5"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg block w-full p-2.5"
              />
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="text-white mt-4 bg-blue-950 hover:bg-blue-800 font-medium rounded-lg text-sm p-2.5 w-full"
            >
              {loading ? "LOGGING IN..." : "L O G I N"}
            </button>
          </form>

          <div className="flex items-start mt-4">
            <label className="text-sm font-medium text-gray-900">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
              <Link to="/forgot-password" className="text-red-600 hover:underline ml-2">Forgot Password?</Link>
              <Link to="/" className="text-blue-600 hover:underline ml-2">Logout</Link>
            </label>
          </div>
        </div>

        <div className="hidden md:block bg-green-300 rounded-lg overflow-hidden">
          <img src={logo} alt="logo" className="h-full w-80 grayscale-100" />
        </div>
      </div>
    </div>
  );
}

export default Login;
