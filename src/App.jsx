import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTopUp from "./pages/AdminTopUp";
import LandingPage from "./pages/LandingPage";
import TransactionHistory from "./pages/TransactionHistory";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-topup"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminTopUp />
            </ProtectedRoute>
          }
        />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {/* <Route path="/logout" element={<Logout />} /> */}
    </>
  );
};

export default App;
