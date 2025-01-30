import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../api/axios";

const AdminTopUp = () => {
  const [users, setUsers] = useState([]); // Default value as empty array
  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle fetch errors

  useEffect(() => {
    const fetchUsers = async () => {
      const authData = localStorage.getItem("auth");
      const { token } = JSON.parse(authData);
      if (!token) {
        console.error("Token not found in localStorage");
        setError("You are not logged in. Please log in as admin.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await API.get("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUsers(response.data.users || []); // Ensure fallback to empty array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again.");
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  

  const handleTopUp = async (e) => {
    e.preventDefault();
    try {
      const authData = localStorage.getItem("auth");
      const { token } = JSON.parse(authData);
      await axios.put(
        "http://localhost:5000/api/admin/users/update-wallet",
        { userId: selectedUserId, amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Wallet balance updated successfully!");
      setSelectedUserId("");
      setAmount("");
    } catch (error) {
      console.error("Error updating wallet balance:", error); // Debugging log
      setMessage(
        error.response?.data?.message || "Failed to update wallet balance. Please try again."
      );
    }
  };

  // Loading state
  if (loading) {
    return <p>Loading users...</p>;
  }

  // Error state
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Wallet Top-Up</h2>
      <form onSubmit={handleTopUp}>
        <div>
          <label>User:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
        </div>
        <button type="submit">Top Up Wallet</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminTopUp;
