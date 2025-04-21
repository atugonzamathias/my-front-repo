import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <img src={logo} alt="AITS Logo" className="w-20 h-auto mb-6 rounded-full border border-red-500" />
      <h1>Welcome to AITS</h1>
      <p>Academic Issue Tracking System for students, lecturers, and registrars.</p>
      <div className="flex gap-4 mt-4">
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
    </Layout>
  );
};

export default Home;
