// PasswordReset.js
import React, { useState } from "react";
import API from "../api/axios";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetRequest = async () => {
    try {
      const response = await API.post("/api/user/request-password-reset", { email });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error requesting password reset:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Password Reset</h1>
      <label className="block mt-4">
        Enter your email to reset password:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
        />
      </label>
      <button
        onClick={handleResetRequest}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
      >
        Request Reset
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default PasswordReset;
