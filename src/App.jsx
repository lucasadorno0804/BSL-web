import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RotaPrivada from './components/RotaPrivada';
import BaseLayout from './components/layout/BaseLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Inspections from './pages/Inspections';
import Financials from './pages/Financials';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          
          {/* Rotas Protegidas envolvidas pelo BaseLayout */}
          <Route path="/" element={<RotaPrivada><BaseLayout /></RotaPrivada>}>
            <Route index element={<Navigate to="/painel" replace />} />
            <Route path="painel" element={<Dashboard />} />
            <Route path="agenda" element={<Schedule />} />
            <Route path="vistorias" element={<Inspections />} />
            <Route path="financeiro" element={<Financials />} />
            <Route path="caixa" element={<Checkout />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
