import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  return user ? children : <Navigate to="/login" replace />;
}
