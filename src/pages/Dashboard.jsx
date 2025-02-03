import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactionPin, setTransactionPin] = useState(""); // ✅ Add PIN state
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (!authData) {
      navigate("/login");
      return;
    }

    const { token, user } = JSON.parse(authData);
    setUserId(user.id);
    fetchDashboardData(token, user.id);
  }, []);

  const fetchDashboardData = async (token, loggedInUserId) => {
    try {
      setLoading(true);
      const [userResponse, profileResponse] = await Promise.all([
        API.get("/api/users/transaction-list", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        API.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Exclude the logged-in user
      const filteredUsers = userResponse.data.filter((user) => user._id !== loggedInUserId);
      setUsers(filteredUsers);
      setWalletBalance(profileResponse.data.walletBalance);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("auth");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedUser || !amount || amount <= 0) {
      setMessage({ type: "error", text: "Please select a user and enter a valid amount." });
      return;
    }
  
    if (amount > walletBalance) {
      setMessage({ type: "error", text: "Insufficient balance." });
      return;
    }
  
    if (!/^\d{4}$/.test(transactionPin)) {
      setMessage({ type: "error", text: "Transaction PIN must be exactly 4 digits." });
      return;
    }
  
    try {
      setIsProcessing(true);
      const authData = localStorage.getItem("auth");
      if (!authData) {
        setMessage({ type: "error", text: "User not authenticated. Please log in again." });
        navigate("/login");
        return;
      }
  
      const { token } = JSON.parse(authData);
      
      const paymentResponse = await API.post(
        "/api/users/pay",
        { receiverId: selectedUser._id, amount, transactionPin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
  
      if (paymentResponse.data.senderBalance !== undefined) {
        setWalletBalance(paymentResponse.data.senderBalance);
      } else {
        setMessage({ type: "error", text: "Payment successful, but balance update failed." });
      }
      
      setMessage({ type: "success", text: "Payment successful!" });
      setAmount("");
      setTransactionPin(""); 
      setSelectedUser(null);
      fetchDashboardData(token, userId);
    } catch (error) {
      console.error("Error making payment:", error);
      console.log("Error details:", error.response?.data);
  
      setMessage({ type: "error", text: error.response?.data?.message || "Payment failed." });
    } finally {
      setIsProcessing(false);
    }
  };  

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white p-6 mt-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/3">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Dashboard</h1>

        {/* Wallet Balance */}
        <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-600 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">Your Wallet Balance</h2>
          <p className="text-3xl font-bold text-blue-700">${walletBalance}</p>
        </div>

        {/* Users List */}
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Select a User to Pay</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 border rounded-lg shadow-sm text-left transition-all duration-300 ${
                  selectedUser && selectedUser._id === user._id
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-700">{user.email}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No users available.</p>
        )}

        {/* Payment Section */}
        {selectedUser && (
          <div className="p-4 bg-gray-50 border rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              Send Money to <span className="text-blue-600">{selectedUser.name}</span>
            </h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            
            <input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={transactionPin}
              onChange={(e) => setTransactionPin(e.target.value)}
              maxLength={4}
              className="w-full p-2 border rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-4 p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Send Payment"}
            </button>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-lg font-semibold text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border-l-4 border-green-500"
                : "bg-red-100 text-red-700 border-l-4 border-red-500"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
