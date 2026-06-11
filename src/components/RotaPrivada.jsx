import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RotaPrivada({ children }) {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex justify-center items-center">
        <span className="text-[#E31B23] font-black italic tracking-widest">CARREGANDO...</span>
      </div>
    );
  }

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
