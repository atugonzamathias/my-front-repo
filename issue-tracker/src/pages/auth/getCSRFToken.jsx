import API from '../../API';

// This just makes sure Django sets the CSRF cookie via the /csrf/ endpoint
const getCSRFToken = async () => {
  try {
    await API.get("/csrf/");
    
    // Read it from browser cookies
    const cookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken="));

    const csrfToken = cookie?.split("=")[1];

    if (csrfToken) {
      API.defaults.headers.common["X-CSRFToken"] = csrfToken;
      console.log("✅ CSRF token set manually:", csrfToken);
    } else {
      console.log("⚠️ CSRF token not found in cookies.");
    }
  } catch (error) {
    console.error("❌ Failed to get CSRF token", error);
  }
};

export default getCSRFToken;
