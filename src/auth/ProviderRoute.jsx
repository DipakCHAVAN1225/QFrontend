// frontend/src/auth/ProviderRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
 import { useAuth } from "../auth/useAuth";

export default function ProviderRoute({ children }) {
  const { isAuthenticated, role, authReady } = useAuth();
  if (!authReady) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isProvider = role === "provider" || (role && role.toLowerCase?.() === "provider");
  if (!isProvider) return <Navigate to="/" replace />;

  return children;
}