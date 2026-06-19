import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ScheduleGrid from '../components/schedule/ScheduleGrid';
import AppointmentModal from '../components/schedule/AppointmentModal';
import ServiceRegistrationModal from '../components/schedule/ServiceRegistrationModal';
import { api } from '../services/api';
import { format, addDays, subDays, startOfDay, endOfDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function Schedule() {
  const location = useLocation();
  
  const [appointments, setAppointments] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [visualFeed, setVisualFeed] = useState({});
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState({ boxId: null, boxName: '', time: '' });
  const [selectedProf, setSelectedProf] = useState(null);
  const [newProfName, setNewProfName] = useState('');
  const [addingProf, setAddingProf] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);

  const fetchResources = async () => {
    try {
      const data = await api.get('/schedule/resources');
      setBoxes(data.boxes || []);
      setProfessionals(data.professionals || []);
      setVisualFeed(data.visualFeed || {});
      setServices(data.services || []);
      setClients(data.clients || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = useCallback(async () => {
    try {
      const start = startOfDay(currentDate);
      const end = endOfDay(currentDate);
      const data = await api.get(`/schedule/appointments?start_date=${start.toISOString()}&end_date=${end.toISOString()}`);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    fetchAppointments();
    
    // Auto-refresh periodically inside prod
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, [fetchAppointments]);

  // Global Event Listener e Rotas para abrir Modal remotamente (via Sidebar)
  useEffect(() => {
    const handleOpenModal = () => {
      setModalContext({ boxId: boxes[0]?.number || 1, boxName: boxes[0]?.name || 'Box', time: '08:00' });
      setModalOpen(true);
    };

    window.addEventListener('openNewServiceModal', handleOpenModal);
    
    if (location.state?.openNewServiceModal) {
      handleOpenModal();
      window.history.replaceState({}, document.title);
    }

    return () => window.removeEventListener('openNewServiceModal', handleOpenModal);
  }, [location.state, boxes]);

  const handleAddProf = async () => {
    if (!newProfName.trim()) return;
    try {
      await api.createProfessional({ name: newProfName.trim() });
      setNewProfName('');
      setAddingProf(false);
      fetchResources();
    } catch (err) {
      alert(err.message || 'Erro ao adicionar membro à equipe');
    }
  };

  const handleDeleteProf = async (id) => {
    if (!window.confirm("Deseja remover este membro da equipe? O histórico de seviços vinculados será afetado se não mantiver a restrição.")) return;
    try {
      await api.deleteProfessional(id);
      if (selectedProf === id) setSelectedProf(null);
      fetchResources();
    } catch (err) {
      alert(err.message || 'Erro ao remover profissional');
    }
  };

  // Filter logic
  const filteredAppointments = appointments.filter(app => {
    if (selectedProf && app.professional_id !== selectedProf) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (app.client_name && app.client_name.toLowerCase().includes(q)) ||
        (app.vehicle_model && app.vehicle_model.toLowerCase().includes(q)) ||
        (app.plate && app.plate.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Capacity stats
  const now = new Date();
  const currentActiveApps = filteredAppointments.filter(a => {
    const start = new Date(a.start_time);
    const end = new Date(a.end_time);
    return start <= now && end >= now;
  });
  
  const totalBoxes = boxes.length || 1;
  const occupiedBoxes = new Set(currentActiveApps.map(a => a.box_number)).size;
  const capacityPercent = Math.round((occupiedBoxes / totalBoxes) * 100);

  return (
    <div className="pt-8 md:pt-16 pb-12 px-4 md:px-12 min-h-screen bg-surface flex flex-col">
      {/* Header & Filters Area */}
      <section className="py-4 md:py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-surface-container-highest/20 mb-4 md:mb-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2">Grade de Serviços</h2>
          <div className="flex gap-4 items-center">
            <span className="font-label text-[10px] tracking-[0.2em] text-on-surface/40 uppercase">Visão Operacional</span>
            <span className="w-12 h-[1px] bg-primary-container"></span>
            
            <div className="flex items-center bg-surface-container-high overflow-hidden border border-surface-container-highest">
              <button onClick={() => setCurrentDate(subDays(currentDate, 1))} className="px-3 py-1.5 hover:bg-surface-container-highest transition-colors border-r border-surface-container-highest">
                <span className="material-symbols-outlined text-[14px] text-on-surface/70">chevron_left</span>
              </button>

              <Popover.Root open={calendarOpen} onOpenChange={setCalendarOpen}>
                <Popover.Trigger asChild>
                  <button className="px-5 py-1.5 min-w-[140px] text-[10px] font-label font-bold tracking-[0.2em] uppercase hover:bg-surface-container-highest transition-colors flex gap-2 items-center justify-center border-r border-surface-container-highest">
                    <span className="material-symbols-outlined text-[14px] text-primary-container">calendar_today</span>
                    {isToday(currentDate) ? 'HOJE' : format(currentDate, "dd 'de' MMM", { locale: ptBR })}
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content sideOffset={5} className="z-50 bg-[#0A0A0A] border border-surface-container-highest p-4 shadow-2xl rounded" style={{ '--rdp-background-color': '#2A2A2A', '--rdp-accent-color': '#E31B23' }}>
                    <style>{`
                      .rdp { --rdp-cell-size: 40px; margin: 0; color: white; }
                      .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover { background-color: #E31B23; color: white; font-weight: bold; }
                      .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #2A2A2A; }
                      .rdp-day_today { color: #E31B23; font-weight: bold; }
                    `}</style>
                    <DayPicker 
                      mode="single" 
                      selected={currentDate} 
                      onSelect={(date) => { if(date) setCurrentDate(date); setCalendarOpen(false); }}
                      locale={ptBR}
                    />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="px-3 py-1.5 hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-[14px] text-on-surface/70">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
          {/* Local Search */}
          <div className="relative group w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/30 text-sm">search</span>
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-highest/30 text-on-surface border-none font-label text-[10px] tracking-widest py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary-container" 
              placeholder="BUSCAR CLIENTE, PLACA..." 
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button 
              onClick={() => setSelectedProf(null)}
              className={`px-4 py-2 ${!selectedProf ? 'bg-surface-container-high border-l-2 border-primary-container text-on-surface' : 'bg-surface-container-low text-on-surface/50'} text-[10px] font-label tracking-widest active:scale-95 transition-all flex-1 md:flex-none text-center`}
            >
              TODA EQUIPE
            </button>
            {professionals.map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedProf(p.id)}
                className={`px-4 py-2 ${selectedProf === p.id ? 'bg-surface-container-high border-l-2 border-primary-container text-on-surface' : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface/50'} text-[10px] font-label tracking-widest active:scale-95 transition-all flex-1 md:flex-none text-center`}
              >
                {p.name.split(' ')[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ScheduleGrid 
        appointments={filteredAppointments} 
        boxes={boxes}
        viewDate={currentDate}
        onRefresh={fetchAppointments}
        onEmptyClick={(boxId, boxName, time) => {
          setModalContext({ boxId, boxName, time });
          setModalOpen(true);
        }}
      />

      {/* Detailed Status Panel (Bento Style) */}
      <section className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="col-span-1 md:col-span-2 bg-surface-container-high p-6 md:p-8 flex flex-col justify-between min-h-[200px] md:min-h-[300px]">
          <div>
            <h3 className="font-label text-xs tracking-[0.2em] text-primary-container uppercase font-bold mb-4 md:mb-8">Análise de Capacidade</h3>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl md:text-6xl font-black italic tracking-tighter text-on-surface">{occupiedBoxes}</span>
              <span className="text-xl font-bold text-on-surface/30 mb-2">/ {totalBoxes}</span>
            </div>
            <p className="font-label text-sm text-on-surface/60 max-w-xs">
              Média de ocupação da loja no momento. Rotatividade avaliada com base nos boxes disponíveis.
            </p>
          </div>
          <div className="w-full bg-surface-container-lowest h-2 relative">
            <div className="absolute inset-0 bg-primary-container transition-all" style={{ width: `${capacityPercent}%` }}></div>
          </div>
        </div>
        
        <div className="bg-surface-container-low p-8 border-l border-surface-container-highest flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-label text-xs tracking-[0.2em] text-on-surface/40 uppercase font-bold">Equipe Ativa</h3>
            <button 
              onClick={() => setAddingProf(!addingProf)}
              className="text-primary-container hover:text-white transition-colors p-1"
              title="Adicionar Membro"
            >
              <span className="material-symbols-outlined text-sm">{addingProf ? 'close' : 'add'}</span>
            </button>
          </div>
          
          {addingProf && (
            <div className="mb-4 flex gap-2">
              <input 
                type="text" 
                value={newProfName}
                onChange={e => setNewProfName(e.target.value)}
                placeholder="Nome do Polidor..."
                className="w-full bg-surface-container-highest/30 text-white border-none font-label text-[10px] tracking-widest py-2 px-3 focus:ring-1 focus:ring-primary-container uppercase"
                onKeyDown={e => e.key === 'Enter' && handleAddProf()}
              />
              <button 
                onClick={handleAddProf}
                disabled={!newProfName.trim()}
                className="bg-primary-container text-white px-3 disabled:opacity-50 hover:bg-[#c2161c] transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">check</span>
              </button>
            </div>
          )}

          <div className="space-y-4 overflow-y-auto max-h-[150px] hide-scrollbar pr-2">
            {professionals.map(prof => {
              // Verifica se o profissional tem app rodando agora
              const activeApp = currentActiveApps.find(a => a.professional_id === prof.id);
              return (
                <div key={prof.id} className="flex justify-between items-center group">
                  <span className="font-label text-[11px] tracking-wider text-on-surface/80 uppercase truncate flex-1">{prof.name}</span>
                  <div className="flex items-center gap-2">
                    {activeApp ? (
                      <span className="px-2 py-0.5 bg-primary-container/10 text-primary-container text-[8px] font-bold uppercase whitespace-nowrap">
                        Box {String(activeApp.box_number).padStart(2, '0')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-surface-container-highest text-on-surface/40 text-[8px] font-bold uppercase whitespace-nowrap">
                        Livre
                      </span>
                    )}
                    <button 
                      onClick={() => handleDeleteProf(prof.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-white p-0.5"
                      title="Remover"
                    >
                      <span className="material-symbols-outlined text-[12px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="relative bg-surface-container-high overflow-hidden group">
          <img 
            alt="Processo de Detalhamento" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:scale-110 transition-transform duration-700" 
            src={visualFeed.imageUrl || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000"} 
          />
          <div className="relative z-10 p-8 h-full flex flex-col justify-between">
            <h3 className="font-label text-xs tracking-[0.2em] text-on-surface uppercase font-bold text-shadow">Feed Visual</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#e31b23]"></div>
              <span className="font-label text-[10px] tracking-widest text-white uppercase text-shadow">
                {visualFeed.message || "Histórico Box 01"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual FAB */}
      <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50">
        <button 
          onClick={() => setServiceModalOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 bg-primary-container text-on-primary-container rounded-full md:rounded-none flex items-center justify-center shadow-2xl active:scale-90 transition-all duration-75 hover:bg-[#c2161c]"
        >
          <span className="material-symbols-outlined text-3xl">add_task</span>
        </button>
      </div>

      <AppointmentModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        boxId={modalContext.boxId}
        boxName={modalContext.boxName}
        initialTime={modalContext.time}
        selectedDate={currentDate}
        onSave={() => {
          fetchAppointments();
        }}
      />

      <ServiceRegistrationModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        onSuccess={() => {
          // Re-fetch resources after adding a service
          fetchResources();
        }}
      />
    </div>
  );
}
