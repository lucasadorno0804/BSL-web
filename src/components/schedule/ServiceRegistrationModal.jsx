import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function ServiceRegistrationModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('create');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Lavagem',
    base_price: '',
    estimated_time: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    if (isOpen && activeTab === 'edit') {
      loadServices();
    }
  }, [isOpen, activeTab]);

  const loadServices = async () => {
    setLoadingServices(true);
    setError(null);
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (err) {
      setError('Erro ao buscar serviços existentes.');
    } finally {
      setLoadingServices(false);
    }
  };

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

  const handleEditClick = (service) => {
    setEditingServiceId(service.id);
    setEditFormData({
      name: service.name,
      category: service.category || 'Lavagem',
      base_price: service.base_price,
      estimated_time: service.estimated_time
    });
  };

  const handleUpdateService = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.updateService(id, {
        name: editFormData.name,
        category: editFormData.category,
        base_price: parseFloat(editFormData.base_price),
        estimated_time: parseInt(editFormData.estimated_time, 10)
      });
      setEditingServiceId(null);
      loadServices();
      onSuccess(); // To refresh schedules if needed
    } catch (err) {
      setError(err.message || 'Erro ao atualizar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface border border-surface-container-high w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-surface-container-high">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">Catálogo de Serviços</h2>
          <button onClick={onClose} className="text-on-surface hover:text-white transition-colors p-2">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex border-b border-surface-container-high">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-4 font-label text-xs tracking-widest uppercase font-bold transition-colors ${activeTab === 'create' ? 'text-primary-container border-b-2 border-primary-container bg-surface-container-low' : 'text-on-surface/50 hover:text-white hover:bg-surface-container-lowest'}`}
          >
            Cadastrar Novo
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-4 font-label text-xs tracking-widest uppercase font-bold transition-colors ${activeTab === 'edit' ? 'text-primary-container border-b-2 border-primary-container bg-surface-container-low' : 'text-on-surface/50 hover:text-white hover:bg-surface-container-lowest'}`}
          >
            Editar Existentes
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-error-container/20 border border-error-container text-error font-label text-sm">
            {error}
          </div>
        )}

        {activeTab === 'create' ? (

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
        ) : (
          <div className="p-6">
            {loadingServices ? (
              <div className="flex justify-center items-center py-12">
                <span className="material-symbols-outlined animate-spin text-primary-container text-3xl">sync</span>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
                {services.map(service => (
                  <div key={service.id} className="bg-surface-container-lowest border border-surface-container-high p-4">
                    {editingServiceId === service.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="font-label text-[10px] text-on-surface-variant uppercase">Nome</label>
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                            className="w-full bg-surface-container border-0 px-3 py-2 text-white font-label mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="font-label text-[10px] text-on-surface-variant uppercase">Categoria</label>
                            <select
                              value={editFormData.category}
                              onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                              className="w-full bg-surface-container border-0 px-3 py-2 text-white font-label mt-1"
                            >
                              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="font-label text-[10px] text-on-surface-variant uppercase">Preço (R$)</label>
                            <input
                              type="number" step="0.01" min="0"
                              value={editFormData.base_price}
                              onChange={(e) => setEditFormData({...editFormData, base_price: e.target.value})}
                              className="w-full bg-surface-container border-0 px-3 py-2 text-white font-label mt-1"
                            />
                          </div>
                          <div>
                            <label className="font-label text-[10px] text-on-surface-variant uppercase">Tempo (m)</label>
                            <input
                              type="number" min="1"
                              value={editFormData.estimated_time}
                              onChange={(e) => setEditFormData({...editFormData, estimated_time: e.target.value})}
                              className="w-full bg-surface-container border-0 px-3 py-2 text-white font-label mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditingServiceId(null)}
                            className="px-4 py-2 font-label text-xs text-on-surface hover:text-white uppercase"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleUpdateService(service.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-primary-container text-white font-label text-xs font-bold uppercase disabled:opacity-50"
                          >
                            {loading ? 'Salvando...' : 'Salvar'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-label font-bold text-white uppercase">{service.name}</p>
                          <p className="font-label text-[10px] text-on-surface-variant uppercase mt-1">
                            {service.category} • {service.estimated_time} MIN
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-headline font-bold text-tertiary">
                            R$ {Number(service.base_price).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleEditClick(service)}
                            className="text-on-surface hover:text-white transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
