import axios from "axios";
import { getCsrfTokenFromCookies } from "./Utils/csrf.jsx"; 
import { getSessionIdFromCookies } from "./Utils/cookies.jsx";

// Set dynamic base URL
const baseURL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_BASE_URL_DEV : import.meta.env.VITE_BASE_URL_PROD;

console.log(
  "Base URL being used:",
  import.meta.env.MODE === "development" ? import.meta.env.VITE_BASE_URL_DEV : import.meta.env.VITE_BASE_URL_PROD
);

// Create Axios instance
const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Include cookies (for CSRF/session-based auth)
});

// Attach CSRF token, session ID, and Referer to all requests
API.interceptors.request.use(
  (config) => {
    // Get CSRF Token
    const csrfToken = getCsrfTokenFromCookies();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    // Get Session ID
    const sessionId = getSessionIdFromCookies();
    if (sessionId) {
      config.headers["Cookie"] = `csrftoken=${csrfToken}; sessionid=${sessionId}`;
    }

    // Add Referer Header (Ensure this is correct for your app)
    //config.headers["Referer"] = "https://aits-alpha.vercel.app"; // Adjust to your frontend URL as needed

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle session expiry or unauthorized access
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        console.warn("Session expired or unauthorized. Redirecting to login...");
        window.location.href = "/login"; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

// Debug function to check API configuration
export const debugAPIConfig = () => {
  console.log("Current API Configuration:");
  console.log("Base URL:", baseURL);
  console.log("Environment:", import.meta.env.MODE);
  console.log("CSRF Token:", getCsrfTokenFromCookies());
  console.log("Session ID:", getSessionIdFromCookies());
};

export default API;
