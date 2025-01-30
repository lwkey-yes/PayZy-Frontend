import React, { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth"));

        if (!auth || !auth.token) {
          setError("Unauthorized access");
          setLoading(false);
          return;
        }

        const response = await API.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

        setProfile({ name: response.data.name, email: response.data.email });
        setWalletBalance(response.data.walletBalance || 0);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(
          err.response?.data?.message || "Unable to fetch user details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setMessage({ type: "", text: "" });
      const response = await API.put(
        "/api/users/profile",
        { name: profile.name, email: profile.email },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth")).token
            }`,
          },
        }
      );
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    }
  };

  const handlePasswordResetRequest = async () => {
    try {
      const response = await API.post("/api/users/request-password-reset", {
        email: passwordResetEmail,
      });
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to send password reset email.",
      });
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          My Profile
        </h1>

        {/* Wallet Balance Section */}
        <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-600 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">
            Wallet Balance
          </h2>
          <p className="text-3xl font-bold text-blue-700">₹{walletBalance}</p>
        </div>

        {/* Profile Update Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateProfile();
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="font-semibold text-gray-700">Name:</span>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="border p-2 w-full rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="block">
            <span className="font-semibold text-gray-700">Email:</span>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="border p-2 w-full rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>

        {/* Password Reset */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Reset Password</h2>
          <label className="block mt-4">
            <span className="font-semibold text-gray-700">
              Enter your email to reset password:
            </span>
            <input
              type="email"
              value={passwordResetEmail}
              onChange={(e) => setPasswordResetEmail(e.target.value)}
              className="border p-2 w-full rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <button
            onClick={handlePasswordResetRequest}
            className="w-full bg-red-600 text-white px-4 py-2 mt-4 rounded hover:bg-red-700 transition"
          >
            Request Password Reset
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
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

export default Profile;
