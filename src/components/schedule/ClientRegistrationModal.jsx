import React, { useState } from 'react';
import { api } from '../../services/api';

export default function ClientRegistrationModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    plate: '',
    brand: '',
    model: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.post('/schedule/clients', formData);
      onSuccess(data.client_id, data.vehicle_id); // Passa os IDs criados para já selecionarmos
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#131313] border border-surface-container-highest/20 shadow-2xl p-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black italic tracking-widest text-primary-container">NOVO CLIENTE</h3>
            <p className="font-label text-[10px] tracking-widest text-on-surface/50 mt-1 uppercase">
              CADASTRO RÁPIDO
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface/50 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="bg-[#E31B23]/10 border border-[#E31B23]/30 text-[#E31B23] p-3 mb-6 text-sm font-label flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold tracking-widest text-[#E31B23] border-b border-[#E31B23]/20 pb-1">DADOS PESSOAIS</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-1">NOME COMPLETO</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#2A2A2A] text-white border-0 py-2 px-3 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-1">TELEFONE</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#2A2A2A] text-white border-0 py-2 px-3 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-1">E-MAIL</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#2A2A2A] text-white border-0 py-2 px-3 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold tracking-widest text-[#E31B23] border-b border-[#E31B23]/20 pb-1">VEÍCULO PRINCIPAL</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-1">PLACA</label>
                <input required name="plate" value={formData.plate} onChange={handleChange} className="w-full bg-[#2A2A2A] text-white border-0 py-2 px-3 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none uppercase" />
              </div>
              
              <div>
                <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-1">MARCA</label>
                <input required name="brand" value={formData.brand} onChange={handleChange} placeholder="Ex: BMW" className="w-full bg-[#2A2A2A] text-white border-0 py-2 px-3 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-1">MODELO</label>
                <input required name="model" value={formData.model} onChange={handleChange} placeholder="Ex: 320i" className="w-full bg-[#2A2A2A] text-white border-0 py-2 px-3 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 bg-[#2A2A2A] text-white font-label tracking-widest py-3 hover:bg-[#333] transition-colors disabled:opacity-50 text-xs">
              CANCELAR
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary-container text-white font-black italic tracking-widest py-3 hover:bg-[#c2161c] transition-colors disabled:opacity-50 text-xs">
              {loading ? 'SALVANDO...' : 'CADASTRAR E SELECIONAR'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
