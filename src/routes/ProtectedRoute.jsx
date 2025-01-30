import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth, setAuth } = useContext(AuthContext); // Use setAuth from context
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      if (!auth.token) {
        setAuth(parsedAuth); // Use setAuth to update context instead of reassigning auth
      }
    }
    setIsLoading(false);
  }, [auth, setAuth]); // Ensure effect runs when auth changes

  if (isLoading) return null; // Prevent rendering until auth state is confirmed

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(auth.role)) {
    return auth.role === "admin" ? (
      <Navigate to="/admin-dashboard" />
    ) : (
      <Navigate to="/dashboard" />
    );
  }

  return children;
};

export default ProtectedRoute;
