import axios from 'axios';

// Create the Axios instance
const API = axios.create({
  baseURL: "https://jessymay.pythonanywhere.com/",  // Ensure full URL
  withCredentials: true,  // Sends cookies for Django session auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Global response interceptor for catching expired sessions or auth issues
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Redirect to login on unauthorized or forbidden
      if (status === 401 || status === 403) {
        console.warn("Session expired or unauthorized. Redirecting to login...");
        
        // Optional: Clear any local/session storage
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to login page
        window.location.href = "/login";
      }
    }

    // Pass error along to other catch blocks
    return Promise.reject(error);
  }
);

export default API;
