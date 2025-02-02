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
  const [errors, setErrors] = useState({});
  const [updating, setUpdating] = useState(false);
  const [currentPIN, setCurrentPIN] = useState("");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");

  const getAuthHeaders = () => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return { headers: { Authorization: `Bearer ${auth?.token}` } };
  };

  // ✅ Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        if (!auth?.token) {
          setError("Unauthorized access");
          setLoading(false);
          return;
        }

        const response = await API.get("/api/users/profile", getAuthHeaders());
        setProfile({ name: response.data.name, email: response.data.email });
        setWalletBalance(response.data.walletBalance ?? 0);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // ✅ Validate PIN input
  const isValidPIN = (pin) => /^\d{4}$/.test(pin);

  const validatePIN = () => {
    let newErrors = {};

    if (!isValidPIN(currentPIN)) {
      newErrors.currentPIN = "Current PIN must be exactly 4 digits.";
    }
    if (!isValidPIN(newPIN)) {
      newErrors.newPIN = "New PIN must be exactly 4 digits.";
    }
    if (newPIN !== confirmPIN) {
      newErrors.confirmPIN = "PINs do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Update PIN
  const handleUpdatePIN = async () => {
    if (!validatePIN()) return;

    try {
      setUpdating(true);
      setMessage({ type: "", text: "" });

      await API.put("/api/users/update-pin", { currentPIN, newPIN }, getAuthHeaders());

      setMessage({ type: "success", text: "Transaction PIN updated successfully!" });
      setCurrentPIN("");
      setNewPIN("");
      setConfirmPIN("");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update PIN." });
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Validate Profile Form
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let newErrors = {};

    if (!profile.name.trim()) {
      newErrors.name = "Full name is required.";
    }
    if (!isValidEmail(profile.email)) {
      newErrors.email = "Invalid email format.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Update Profile
  const handleUpdateProfile = async () => {
    if (!validateForm()) return;

    try {
      setUpdating(true);
      setMessage({ type: "", text: "" });

      // Fetch latest profile data to check if anything changed
      const response = await API.get("/api/users/profile", getAuthHeaders());

      if (response.data.name === profile.name && response.data.email === profile.email) {
        setMessage({ type: "info", text: "No changes detected." });
        return;
      }

      await API.put("/api/users/profile", { name: profile.name, email: profile.email }, getAuthHeaders());

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile." });
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Request Password Reset
  const handlePasswordResetRequest = async () => {
    if (!isValidEmail(passwordResetEmail)) {
      setMessage({ type: "error", text: "Enter a valid email address." });
      return;
    }

    try {
      setMessage({ type: "", text: "" });

      const response = await API.post("/api/users/request-password-reset", { email: passwordResetEmail });

      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to send password reset email." });
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;


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
              className={`border p-2 w-full rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </label>

          <label className="block">
            <span className="font-semibold text-gray-700">Email:</span>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className={`border p-2 w-full rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </label>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Profile"}
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


        {/* Change PIN Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Change Transaction PIN</h2>

          <label className="block mt-4">
            <span className="font-semibold text-gray-700">Current PIN:</span>
            <input
              type="password"
              value={currentPIN}
              maxLength={4}
              onChange={(e) => setCurrentPIN(e.target.value)}
              className={`border p-2 w-full rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.currentPIN ? "border-red-500" : ""
              }`}
            />
            {errors.currentPIN && <p className="text-red-500 text-xs mt-1">{errors.currentPIN}</p>}
          </label>

          <label className="block mt-4">
            <span className="font-semibold text-gray-700">New PIN:</span>
            <input
              type="password"
              value={newPIN}
              maxLength={4}
              onChange={(e) => setNewPIN(e.target.value)}
              className={`border p-2 w-full rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.newPIN ? "border-red-500" : ""
              }`}
            />
            {errors.newPIN && <p className="text-red-500 text-xs mt-1">{errors.newPIN}</p>}
          </label>

          <label className="block mt-4">
            <span className="font-semibold text-gray-700">Confirm New PIN:</span>
            <input
              type="password"
              value={confirmPIN}
              maxLength={4}
              onChange={(e) => setConfirmPIN(e.target.value)}
              className={`border p-2 w-full rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.confirmPIN ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPIN && <p className="text-red-500 text-xs mt-1">{errors.confirmPIN}</p>}
          </label>

          <button
            onClick={handleUpdatePIN}
            disabled={updating}
            className="w-full bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {updating ? "Updating PIN..." : "Update PIN"}
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
