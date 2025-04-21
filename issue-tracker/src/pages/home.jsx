import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg'; 

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 text-center px-4">
      {/* Add the logo here */}
      <img src={logo} alt="AITS Logo" className="w-24 h-24 mb-6" />
      
      <h1 className="text-4xl font-bold mb-4">Welcome to AITS</h1>
      <p className="text-lg mb-6">
        Academic Issue Tracking System for students, lecturers, and registrars.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          SIGN UP
        </Link>
      </div>
    </div>
  );
};

export default Home;
