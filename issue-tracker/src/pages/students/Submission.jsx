import API from "../../API";
import Wrapper from "../../components/wrapper";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Submission = () => {
  const [formData, setFormData] = useState({
    user_number: "",
    registration_number: "",
    full_name: "",
    subject: "",
    course_code: "",
    course_id: "",
    issue_type: "",
    category: "",
    description: "",
    year_of_study: "",
    semester: "",
    lecturer_name: "",
  });

  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);      // Track any errors

  // Fetch data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);  // Set loading state to true when starting API call
        const response = await API.get("/api/auth/details/");
        const data = response.data;
        // Update formData with the fetched details
        setFormData((prevData) => ({
          ...prevData,
          user_number: data.user_number,
          registration_number: data.registration_number,
          full_name: data.full_name,
        }));
      } catch (error) {
        setError("Error fetching user data: " + error.message); // Set error message if something goes wrong
      } finally {
        setLoading(false);  // Set loading state to false after the API call is finished
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("api/issues/", formData);

      console.log("Issue submitted successfully:", response.data);
      setFormData({
        user_number: formData.user_number, // Keep pre-filled user data
        registration_number: formData.registration_number,
        full_name: formData.full_name,
        subject: "",
        course_code: "",
        course_id: "",
        issue_type: "",
        category: "",
        description: "",
        year_of_study: "",
        semester: "",
        lecturer_name: "",
      });
      alert("Issue submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert("Failed to submit issue: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading message while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Display error message if there's an issue fetching data
  }

  return (
    <Wrapper>
      <div className="justify-center items-center bg-gray-100">
        <div className="bg-white p-4 gap-4 rounded-lg shadow-2xl w-full ">
          <h2 className="text-center mb-4 font-bold text-blue-400">Issue Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label htmlFor="user_number" className="block mb-2 text-sm text-left font-medium text-gray-600">
                User Number
              </label>
              <input
                type="text"
                id="user_number"
                name="user_number"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.user_number}
                placeholder="Student number auto filled"
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-1">
              <label htmlFor="registration_number" className="block mb-2 text-sm text-left font-medium text-gray-600">
                Registration Number
              </label>
              <input
                type="text"
                id="registration_number"
                name="registration_number"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.registration_number}
                placeholder="Registration number auto filled"
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-1">
              <label htmlFor="full_name" className="block mb-2 text-sm text-left font-medium text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.full_name}
                placeholder="Full name auto filled"
                onChange={handleChange}
                disabled
              />
            </div>

            {/* Other form fields... */}

            <button
              type="submit"
              className="text-white mt-4 mb-4 bg-blue-950 w-79 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-400 font-medium rounded-lg text-sm p-2.5 text-center"
            >
              S U B M I T
            </button>
          </form>
        </div>
        <div className="hidden md:block bg-blue-300 rounded-lg overflow-hidden"></div>
      </div>
    </Wrapper>
  );
};

export default Submission;
