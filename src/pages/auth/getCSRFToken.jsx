import API from '../../API';

const getCSRFToken = async () => {
    try {
      const response = await API.get("/csrf/");
      const csrfToken = response?.data?.csrfToken;
  
      if (csrfToken) {
        API.defaults.headers.common["X-CSRFToken"] = csrfToken;
        console.log("✅ CSRF token set manually:", csrfToken);
      } else {
        console.log("✅ CSRF cookie set (token not returned in body)");
      }
    } catch (error) {
      console.error("❌ Failed to get CSRF token", error);
    }
  };
  export default getCSRFToken;
  