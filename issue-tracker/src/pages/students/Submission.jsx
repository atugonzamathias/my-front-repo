import API from "../../API";
import Wrapper from "../../components/wrapper";
import React, { useState, useEffect } from "react";
import { Link } from "react-router";

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

  // Fetch data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.get("/api/auth/details/"); 
        const data = response.data;
        setFormData((prevData) => ({
          ...prevData,
          user_number: data.user_number,
          registration_number: data.registration_number,
          name: data.full_name,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
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
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      alert(
        "Failed to submit issue: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <Wrapper>
      <div className="   justify-center items-center bg-gray-100">
        <div className="bg-white p-4 gap-4 rounded-lg shadow-2xl w-full ">
          <h2 className="text-center mb-4 font-bold text-blue-400">
            Issue Form
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label
                htmlFor="user_number"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
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
              <label
                htmlFor="registration_number"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
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
              <label
                htmlFor="name"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
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
            <div className="mb-1">
              <label
                htmlFor="subject"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.subject}
                placeholder="Enter the subject"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-1">
              <label
                htmlFor="course_code"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Course Code
              </label>
              <input
                type="text"
                id="course_code"
                name="course_code"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.course_code}
                placeholder="Enter the course code"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-1">
              <label
                htmlFor="course_id"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Course ID
              </label>
              <input
                type="text"
                id="course_id"
                name="course_id"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.course_id}
                placeholder="Enter the course ID"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-1">
              <label
                htmlFor="issue_type"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Issue Type
              </label>
              <select
                id="issuetype"
                name="issue_type"
                value={formData.issuetype}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="">Select relevant option</option>
                <option value="missing_marks">Missing Mmarks</option>
                <option value="appeal">Appeal</option>
                <option value="correction">Correction</option>
              </select>
            </div>
            <div className="mb-1">
              <label
                htmlFor="category"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.category}
                placeholder="Enter issue category"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-1">
              <label
                htmlFor="description"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Issue Description
              </label>
              <textarea
                id="description"
                name="description"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.description}
                placeholder="Write your problem description here"
                onChange={handleChange}
                rows={5}
                required
              />
            </div>
            <div className="mb-1">
              <label
                htmlFor="yearofstudy"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Year of Study
              </label>
              <input
                type="text"
                id="year_of_study"
                name="year_of_study"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.year_of_study}
                placeholder="Enter your year of study"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-1">
              <label
                htmlFor="semester"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Semester
              </label>
              <input
                type="text"
                id="semester"
                name="semester"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.semester}
                placeholder="Enter your what semester you're in"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="lecturer_name"
                className="block mb-2 text-sm text-left  font-medium text-gray-600"
              >
                Lecturer Name
              </label>
              <input
                type="text"
                id="lecturer_name"
                name="lecturer_name"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.lecturer_name}
                placeholder="Enter your Lecturer's name"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="text-white mt-4 mb-4 bg-blue-950 w-79  hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-400 font-medium rounded-lg text-sm  p-2.5 text-center "
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
