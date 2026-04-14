import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white font-label tracking-widest text-xs">CARREGANDO...</div>
      </div>
    );
  }

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
