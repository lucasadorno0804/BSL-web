import React, { useState } from 'react';
import { api } from '../../services/api';

export default function ServiceRegistrationModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Lavagem',
    base_price: '',
    estimated_time: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const categories = ['Lavagem', 'Pintura', 'Vidros', 'Interior', 'Motor'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.createService({
        name: formData.name,
        category: formData.category,
        base_price: parseFloat(formData.base_price),
        estimated_time: parseInt(formData.estimated_time, 10)
      });
      onSuccess();
      onClose();
      setFormData({ name: '', category: 'Lavagem', base_price: '', estimated_time: '' });
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface border border-surface-container-high w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-surface-container-high">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">Novo Serviço no Catálogo</h2>
          <button onClick={onClose} className="text-on-surface hover:text-white transition-colors p-2">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-error-container/20 border border-error-container text-error font-label text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="font-label text-xs tracking-widest text-on-surface/50 uppercase">Nome do Serviço</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="ex: Vitrificação 9H"
              className="w-full bg-surface-container-lowest border-0 px-4 py-3 text-white focus:ring-1 focus:ring-primary-container font-label uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs tracking-widest text-on-surface/50 uppercase">Categoria</label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-surface-container-lowest border-0 px-4 py-3 text-white appearance-none focus:ring-1 focus:ring-primary-container font-label uppercase"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-label text-xs tracking-widest text-on-surface/50 uppercase">Valor Base (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.base_price}
                onChange={e => setFormData({...formData, base_price: e.target.value})}
                placeholder="0.00"
                className="w-full bg-surface-container-lowest border-0 px-4 py-3 text-white focus:ring-1 focus:ring-primary-container font-label"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-label text-xs tracking-widest text-on-surface/50 uppercase">Tempo Médio (Min)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.estimated_time}
                onChange={e => setFormData({...formData, estimated_time: e.target.value})}
                placeholder="ex: 120"
                className="w-full bg-surface-container-lowest border-0 px-4 py-3 text-white focus:ring-1 focus:ring-primary-container font-label"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-surface-container-high flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-label text-xs font-bold tracking-widest text-on-surface hover:text-white uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-container text-on-primary-container font-label font-bold text-xs tracking-widest hover:bg-[#c2161c] transition-colors disabled:opacity-50 uppercase flex items-center"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin mr-2">sync</span>
              ) : (
                <span className="material-symbols-outlined mr-2">add_task</span>
              )}
              {loading ? 'Salvando...' : 'Adicionar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
