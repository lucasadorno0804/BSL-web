import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Se tiver sucesso, navegamos para o painel.
      // NÃO chamamos setIsLoading(false) aqui porque o componente será desmontado.
      navigate('/painel', { replace: true });
    } catch (err) {
      setError(err.message);
      setIsLoading(false); // Só volta a habilitar o botão se der erro
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#131313] p-10 border border-surface-container-highest/20 shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-black italic tracking-widest text-[#E31B23]">BSL</h1>
          <p className="font-label text-xs tracking-[0.2em] text-on-surface/50 mt-2">ESTÉTICA AUTOMOTIVA</p>
        </div>

        {error && (
          <div className="bg-[#E31B23]/10 border border-[#E31B23]/30 text-[#E31B23] p-3 mb-6 text-sm font-label text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-label tracking-widest text-on-surface/50 mb-2">
              E-MAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label focus:ring-1 focus:ring-[#E31B23] focus:outline-none transition-shadow disabled:opacity-50"
              placeholder="admin@bsl.com"
            />
          </div>

          <div>
            <label className="block text-xs font-label tracking-widest text-on-surface/50 mb-2">
              SENHA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label focus:ring-1 focus:ring-[#E31B23] focus:outline-none transition-shadow disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E31B23] text-white font-black italic tracking-widest py-4 hover:bg-[#c2161c] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-label tracking-widest">
          <span className="text-[#A0A0A0]">Ainda não tem conta?</span>{' '}
          <Link to="/cadastro" className="text-[#E31B23] hover:text-white transition-colors">
            Primeiro acesso
          </Link>
        </div>
      </div>
    </div>
  );
}
