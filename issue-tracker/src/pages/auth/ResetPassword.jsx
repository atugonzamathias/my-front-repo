import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../API";

export default function ResetPassword() {
  const { uid, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }

    try {
      setIsLoading(true);
      const res = await API.post(`/api/reset-password/${uid}/${token}/`, {
        password,
        confirm_password: confirmPassword,
      });
      setMessage(res.data.message);
      setError("");
      setIsSuccess(true); // disable the button
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Reset Your Password
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSuccess}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Confirm New password
            </label>
            <input
              type="confirm_password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirm_password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSuccess}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-xl transition duration-200 ${
              isSuccess
                ? "bg-green-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isLoading || isSuccess}
          >
            {isLoading ? "Processing..." : isSuccess ? "Password Reset" : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
