import React, { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const Wallet = () => {
  const authData = localStorage.getItem("auth");
  const token = authData ? JSON.parse(authData).token : null;
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWalletBalance = async () => {
    if (!token) {
      setError("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await API.get("/api/users/wallet/get-wallet-balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWalletBalance(response.data.walletBalance);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch wallet balance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
        <h1 className="text-2xl font-bold mb-4">Wallet</h1>

        {loading ? (
          <p className="text-gray-600">Loading your wallet balance...</p>
        ) : error ? (
          <div className="text-red-500">
            <p>{error}</p>
            <button
              onClick={fetchWalletBalance}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-lg">
              Your current wallet balance is:{" "}
              <span className="font-semibold text-green-600">₹{walletBalance.toFixed(2)}</span>
            </p>
            <button
              onClick={fetchWalletBalance}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Refresh Balance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
