import React from 'react';
import axios from "axios";

// Set dynamic base URL
const baseURL = import.meta.env.MODE === "development"
  ? import.meta.env.VITE_BASE_URL_DEV
  : import.meta.env.VITE_BASE_URL_PROD;

// Create Axios instance
const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies (for CSRF/session-based auth)
});

// Attach CSRF token to all requests
API.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Handle session expiry or unauthorized access
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        console.warn("Session expired or unauthorized. Redirecting to login...");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Function to extract cookies (for CSRF)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default API;
