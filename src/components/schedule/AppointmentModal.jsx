import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import ClientRegistrationModal from './ClientRegistrationModal';

export default function AppointmentModal({ isOpen, onClose, boxId, boxName, initialTime, selectedDate = new Date(), onSave }) {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedBoxId, setSelectedBoxId] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [boxes, setBoxes] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientModalOpen, setClientModalOpen] = useState(false);

  const fetchResources = useCallback(() => {
    api.get('/schedule/resources')
      .then(data => {
        setClients(data.clients || []);
        setServices(data.services || []);
        setBoxes(data.boxes || []);
      })
      .catch(err => {
        console.error(err);
        setError('Erro ao buscar dados do sistema');
      });
  }, []);

  // Busca recursos (clientes/veículos e serviços)
  useEffect(() => {
    if (isOpen) {
      fetchResources();
      setSelectedBoxId(boxId || '');
      const tStr = typeof initialTime === 'number' ? `${String(initialTime).padStart(2, '0')}:00` : initialTime || '08:00';
      setSelectedTime(tStr);
    } else {
      setSelectedClientId('');
      setSelectedVehicleId('');
      setSelectedServiceId('');
      setError('');
    }
  }, [isOpen, fetchResources, boxId, initialTime]);

  if (!isOpen) return null;

  const currentClient = clients.find(c => c.id === selectedClientId);
  const currentService = services.find(s => s.id === selectedServiceId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Preparar um Timestamp do dia "selectedDate" + Hora clicada
    const targetDate = new Date(selectedDate);
    const [hh, mm] = selectedTime.split(':');
    targetDate.setHours(parseInt(hh, 10), parseInt(mm || 0, 10), 0, 0);

    const payload = {
      vehicle_id: selectedVehicleId,
      service_id: selectedServiceId,
      box_number: selectedBoxId,
      start_time: targetDate.toISOString()
    };

    try {
      const data = await api.post('/schedule/appointments', payload);
      onSave(data);
      onClose();
    } catch (err) {
      if (err.status === 400 || err.status === 409) {
        setError('Este box já está ocupado neste horário');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#131313] border border-surface-container-highest/20 shadow-2xl p-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black italic tracking-widest text-[#E31B23]">NOVO SERVIÇO</h3>
            <p className="font-label text-[10px] tracking-widest text-on-surface/50 mt-1 uppercase">
              AGENDAMENTO
            </p>
          </div>
          <button onClick={onClose} className="text-on-surface/50 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="bg-[#E31B23]/10 border border-[#E31B23]/30 text-[#E31B23] p-3 mb-6 text-sm font-label flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Box e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-2">BOX</label>
              <select 
                required
                value={selectedBoxId} 
                onChange={e => setSelectedBoxId(e.target.value)}
                className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none"
              >
                <option value="">Selecione o box...</option>
                {boxes.map(b => (
                  <option key={b.id} value={b.number}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-2">HORÁRIO</label>
              <input 
                type="time"
                required
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
                className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none"
              />
            </div>
          </div>

          {/* Cliente Select */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-label tracking-widest text-on-surface/50">CLIENTE</label>
              <button 
                type="button" 
                onClick={() => setClientModalOpen(true)}
                className="text-[#E31B23] text-[9px] font-bold tracking-widest uppercase hover:text-white transition-colors"
              >
                + NOVO CLIENTE
              </button>
            </div>
            <select 
              required
              value={selectedClientId} 
              onChange={e => {
                setSelectedClientId(e.target.value);
                setSelectedVehicleId(''); // Reseta veiculo
              }}
              className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none"
            >
              <option value="">Selecione um cliente...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Vehiculo Select */}
          <div>
            <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-2">VEÍCULO</label>
            <select 
              required
              disabled={!selectedClientId}
              value={selectedVehicleId} 
              onChange={e => setSelectedVehicleId(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none disabled:opacity-50"
            >
              <option value="">Selecione um veículo...</option>
              {currentClient?.vehicles?.map(v => (
                <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate})</option>
              ))}
            </select>
          </div>

          {/* Service Select */}
          <div>
            <label className="block text-[10px] font-label tracking-widest text-on-surface/50 mb-2">SERVIÇO</label>
            <select 
              required
              value={selectedServiceId} 
              onChange={e => setSelectedServiceId(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white border-0 py-3 px-4 font-label text-sm focus:ring-1 focus:ring-[#E31B23] focus:outline-none"
            >
              <option value="">Selecione o serviço...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} - R$ {Number(s.base_price).toFixed(2)}</option>
              ))}
            </select>
            
            {currentService && (
              <div className="mt-2 bg-[#2A2A2A]/50 border-l-2 border-[#E31B23] p-2 flex items-center justify-between">
                 <span className="text-[10px] font-label text-on-surface/60">DURAÇÃO ESTIMADA</span>
                 <span className="text-xs font-bold text-white">{currentService.estimated_time} MINUTOS</span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E31B23] text-white font-black italic tracking-widest py-4 hover:bg-[#c2161c] transition-colors disabled:opacity-50"
            >
              {loading ? 'AGENDANDO...' : 'CONFIRMAR AGENDAMENTO'}
            </button>
          </div>
        </form>

      </div>
    </div>

    <ClientRegistrationModal 
      isOpen={clientModalOpen}
      onClose={() => setClientModalOpen(false)}
      onSuccess={(newClientId, newVehicleId) => {
        // Recarrega recursos (clientes) e autoseleciona o recém cadastrado
        api.get('/schedule/resources').then(data => {
          setClients(data.clients || []);
          setSelectedClientId(newClientId);
          setSelectedVehicleId(newVehicleId);
        });
      }}
    />
    </>
  );
}
