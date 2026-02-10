import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

export default function RoleRoute({ requiredRole, children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}
