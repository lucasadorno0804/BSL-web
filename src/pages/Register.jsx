import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [ownerName, setOwnerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  
  const { registerAccount } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInternalLoading(true);
    try {
      await registerAccount({ ownerName, companyName, email, whatsapp, password });
      navigate('/painel');
    } catch (err) {
      setError(err.message);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-md bg-[#131313] p-10 border border-surface-container-highest/20 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-black italic tracking-widest text-[#E31B23]">BSL</h1>
          <p className="font-label text-xs tracking-[0.2em] text-on-surface/50 mt-2">CRIAR CONTA</p>
        </div>

        {error && (
          <div className="bg-[#E31B23]/10 border border-[#E31B23]/30 text-[#E31B23] p-3 mb-6 text-sm font-label text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-2">
              NOME DO RESPONSÁVEL
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none transition-shadow"
              placeholder="Digite seu nome"
            />
          </div>

          <div>
            <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-2">
              NOME DA ESTÉTICA
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none transition-shadow"
              placeholder="Digite o nome da empresa"
            />
          </div>

          <div>
            <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-2">
              E-MAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none transition-shadow"
              placeholder="seunome@estetica.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-2">
              WHATSAPP
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none transition-shadow"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-2">
              SENHA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none transition-shadow"
              placeholder="Crie uma senha forte"
            />
          </div>

          <button
            type="submit"
            disabled={internalLoading}
            className="w-full bg-[#E31B23] text-white font-black italic tracking-widest py-4 hover:bg-[#c2161c] transition-colors mt-6 disabled:opacity-50"
          >
            {internalLoading ? 'CRIANDO...' : 'CRIAR CONTA'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-label tracking-widest">
          <span className="text-[#A0A0A0]">Já tem uma conta?</span>{' '}
          <Link to="/login" className="text-white hover:text-[#E31B23] transition-colors">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
