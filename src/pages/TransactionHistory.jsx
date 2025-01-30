import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const TransactionHistory = () => {
  const authData = localStorage.getItem("auth");
  const token = authData ? JSON.parse(authData).token : null;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await API.get("/api/users/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data.transactions);
      } catch (err) {
        console.error("Error fetching transaction history:", err);
        setError("Failed to load transaction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
        <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <ul className="space-y-4">
            {transactions.map((txn) => (
              <li key={txn._id} className="border-b pb-3">
                <p><strong>Date:</strong> {new Date(txn.date).toLocaleString()}</p>
                <p><strong>Sender:</strong> {txn.sender.name}</p>
                <p><strong>Receiver:</strong> {txn.receiver.name}</p>
                <p><strong>Amount:</strong> <span className="font-semibold text-green-600">₹{txn.amount.toFixed(2)}</span></p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
