import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to PayZy</h1>
        <p className="text-lg text-gray-600 mt-2">
          Your one-stop solution for seamless digital transactions.
        </p>
      </header>

      {/* About Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-gray-700">About Our App</h2>
        <p className="text-gray-600 mt-4">
          PayZy allows users to securely manage wallets, make digital transactions, 
          and perform instant payments. Admins have full control over user wallets.
        </p>
      </section>

      {/* Action Buttons */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition duration-300"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
