import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Make sure to install lucide-react or use another icon library
import API from "../../API";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/api/profile/");
        const userData = response.data;
        setUser(userData);
        setFormData({
          username: userData.username,
          email: userData.email,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      alert("Only JPEG and PNG images are allowed.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 2MB.");
      return;
    }

    setLoading(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append("profile_picture", file);
      const response = await API.post(
        "/api/profile/profile_picture/",
        formDataFile,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser((prev) => ({ ...prev, ...response.data }));
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("Failed to upload profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await API.put("/api/profile/", formData);
      setUser((prev) => ({ ...prev, ...response.data }));
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/api/profile/change_password/", {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_new_password: passwordData.confirmPassword,
      });
      setPasswordSuccess(response.data.detail || "Password updated successfully.");
      setPasswordError("");
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(
        err.response?.data?.detail || "Failed to update password. Check your current password."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Back Arrow */}
      <div className="mb-4 flex items-center gap-2 cursor-pointer text-blue-900" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center">My Profile</h2>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={user.profile_picture || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleProfilePictureChange}
            disabled={loading}
            id="profile-picture-upload"
            className="hidden"
          />
          <label
            htmlFor="profile-picture-upload"
            className="absolute bottom-0 right-0 bg-blue-900 text-white p-2 rounded-full cursor-pointer"
          >
            Edit
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <p className="mt-1 text-sm">{user.full_name}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Username</label>
          {editing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              className="mt-1 w-full px-3 py-2 border rounded shadow-sm"
            />
          ) : (
            <p className="mt-1 text-sm">{user.username}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          {editing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className="mt-1 w-full px-3 py-2 border rounded shadow-sm"
            />
          ) : (
            <p className="mt-1 text-sm">{user.email}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Role</label>
          <p className="mt-1 text-sm">{user.role}</p>
        </div>

        {user.role !== "admin" && (
          <div>
            <label className="text-sm font-medium text-gray-700">College</label>
            <p className="mt-1 text-sm">{user.college}</p>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          {editing ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-blue-900 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              disabled={loading}
              className="flex-1 bg-blue-900 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            disabled={loading}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>
        </div>

        {showPasswordForm && (
          <div className="mt-6 bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold mb-3">Change Password</h3>
            {passwordError && <p className="text-red-600 mb-2">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-600 mb-2">{passwordSuccess}</p>}
            <div className="flex flex-col gap-3">
              {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[field] ? "text" : "password"}
                      name={field}
                      value={passwordData[field]}
                      onChange={handlePasswordChange}
                      className="mt-1 w-full px-3 py-2 border rounded"
                    />
                    <span
                      className="absolute right-2 top-3 text-sm text-blue-600 cursor-pointer"
                      onClick={() => togglePasswordVisibility(field)}
                    >
                      {showPassword[field] ? "Hide" : "Show"}
                    </span>
                  </div>
                </div>
              ))}
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="mt-4 bg-blue-900 text-white px-4 py-2 rounded"
              >
                {loading ? "Changing..." : "Update Password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
