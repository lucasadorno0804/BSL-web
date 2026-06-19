import React, { useState } from 'react';
import { api } from '../../services/api';

const START_HOUR = 8;
const END_HOUR = 18;
const TOTAL_HOURS = END_HOUR - START_HOUR;

export default function ScheduleGrid({ appointments = [], boxes = [], viewDate = new Date(), onRefresh, onEmptyClick }) {
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 08:00 as 18:00 (1 hour intervals)
  const timeSlots = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e, appId) => {
    e.stopPropagation();
    setDraggedAppId(appId);
    e.dataTransfer.setData('text/plain', appId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetBox, targetHour) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!draggedAppId) return;

    const dropTime = new Date(viewDate);
    dropTime.setHours(targetHour, 0, 0, 0);

    try {
      const payload = {
        box_number: targetBox,
        start_time: dropTime.toISOString()
      };

      await api.patch(`/schedule/appointments/${draggedAppId}`, payload);
      if (onRefresh) onRefresh();
    } catch (err) {
      if (err.status === 400 || err.status === 409) {
        setErrorMessage('Este box já está ocupado neste horário');
      } else {
        setErrorMessage(err.message || 'Erro ao arrastar agendamento');
      }
    } finally {
      setDraggedAppId(null);
    }
  };

  const handleDelete = async (appId) => {
    if (window.confirm("Deseja realmente remover este serviço agendado?")) {
      try {
        await api.delete(`/schedule/appointments/${appId}`);
        if (onRefresh) onRefresh();
      } catch (err) {
        setErrorMessage(err.message || 'Erro ao remover agendamento');
      }
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/schedule/appointments/${appId}`, { status: newStatus });
      if (onRefresh) onRefresh();
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao alterar status');
    }
  };

  // --- CÁLCULO DE POSICIONAMENTO PARA LARGURAS EXATAS ---
  const calculatePosition = (startISO, endISO) => {
    const start = new Date(startISO);
    const end = new Date(endISO);
    
    // Calcula offset numérico referente ao Start Hour
    const relativeStartHour = (start.getHours() - START_HOUR) + (start.getMinutes() / 60);
    const leftPercent = (relativeStartHour / TOTAL_HOURS) * 100;
    
    // Calculates duration based on start and end
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const widthPercent = (durationHours / TOTAL_HOURS) * 100;

    return { 
      left: `${Math.max(0, leftPercent)}%`, 
      width: `${Math.min(widthPercent, 100 - leftPercent)}%` 
    };
  };

  const getDynamicStatusAndProgress = (app) => {
    const start = new Date(app.start_time);
    const end = new Date(app.end_time);
    const now = new Date();

    let statusKey = 'waiting';
    let statusLabel = app.status ? app.status.toUpperCase() : 'AGENDADO';
    let progress = 0;

    if (app.status === 'Finalizado') {
      statusKey = 'finished';
      progress = 100;
    } else if (app.status === 'Em Processamento') {
      statusKey = 'active';
      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    } else {
      statusKey = 'waiting';
      progress = 0;
    }

    return { statusLabel, statusKey, progress };
  };

  return (
    <section className="mt-8 relative flex flex-col">
      {/* MOBILE LIST VIEW */}
      <div className="md:hidden flex flex-col gap-4 w-full">
        {appointments.length === 0 ? (
          <div className="text-center py-12 text-on-surface/30 font-label text-xs tracking-widest uppercase border border-dashed border-surface-container-highest/20">
            Nenhum serviço agendado para esta data.
          </div>
        ) : (
          appointments.sort((a,b) => new Date(a.start_time) - new Date(b.start_time)).map(app => {
            const { statusLabel, statusKey, progress } = getDynamicStatusAndProgress(app);
            const box = boxes.find(b => b.number === app.box_number);
            const boxName = box ? box.name : `Box ${app.box_number}`;
            const isFinished = statusKey === 'finished';
            const isActive = statusKey === 'active';
            
            return (
              <div key={`mobile-${app.id}`} className="bg-surface-container-high p-4 flex flex-col gap-3 relative overflow-hidden border-l-4" style={{ borderColor: isFinished ? '#333' : isActive ? '#E31B23' : '#FFF' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">{new Date(app.start_time).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})} - {boxName}</span>
                    <h4 className="font-black text-lg text-white uppercase leading-tight mt-1">{app.vehicle_brand} {app.vehicle_model}</h4>
                    <span className="font-label text-xs tracking-widest text-primary-container uppercase mt-1 block">{app.service_name}</span>
                  </div>
                  <div className="text-right">
                    <select
                      value={app.status || 'Agendado'}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="appearance-none bg-surface-container-lowest text-on-surface font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-surface-container-highest"
                    >
                      <option value="Aguardando">AGUARDANDO</option>
                      <option value="Agendado">AGENDADO</option>
                      <option value="Em Processamento">EM PROCESSAMENTO</option>
                      <option value="Finalizado">FINALIZADO</option>
                    </select>
                  </div>
                </div>
                {isActive && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 bg-surface-container-highest">
                      <div className="h-full bg-primary-container" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="font-label text-[10px] text-on-surface-variant">{Math.round(progress)}%</span>
                  </div>
                )}
                <div className="flex justify-between items-center mt-2 border-t border-surface-container-highest/20 pt-2">
                  <span className="font-label text-[10px] tracking-widest text-on-surface-variant">CHASSI: {app.plate}</span>
                  <button onClick={() => handleDelete(app.id)} className="text-error hover:text-white p-1">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP GRID VIEW */}
      <div className="hidden md:flex overflow-x-auto hide-scrollbar min-h-[600px] flex-col w-full">
        <div className="min-w-[1200px] flex-1 flex flex-col relative z-10">
        {/* Tratamento de Erros via Alerta Toast */}
        {errorMessage && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-[#E31B23] text-white px-6 py-3 font-label text-xs tracking-widest shadow-2xl flex items-center gap-3 animate-pulse">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {errorMessage}
            <button onClick={() => setErrorMessage('')} className="ml-4 hover:opacity-50">
               <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}

        {/* Timeline Header (10 Horas) */}
        <div className="flex h-12 mb-2">
          <div className="w-48 shrink-0"></div> {/* Espaço do Box Title */}
          <div className="flex-1 flex pointer-events-none mt-8">
            {timeSlots.map((hour, index) => (
              <div key={hour} className="flex-1 border-l border-surface-container-highest/20 relative">
                <span className="absolute left-0 -top-6 -translate-x-1/2 text-center font-label text-[10px] tracking-widest text-on-surface/40 uppercase">
                  {String(hour).padStart(2, '0')}:00
                </span>
                {/* O último item recebe o border-r para fechar a grid (18:00) */}
                {index === timeSlots.length - 1 && (
                  <span className="absolute right-0 -top-6 translate-x-1/2 text-center font-label text-[10px] tracking-widest text-on-surface/40 uppercase">
                    {String(hour+1).padStart(2, '0')}:00
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Linha de Fundo Extra para fechar a grid à direita globalmente? Podemos resolver no último mapping */}

        {/* Rows por Box */}
        {boxes.length === 0 && (
          <div className="text-center py-24 text-on-surface/30 font-label text-xs tracking-widest uppercase border border-dashed border-surface-container-highest/20">
            Nenhum box cadastrado ou carregado.
          </div>
        )}

        {boxes.map((box) => (
          <div key={box.number} className="flex relative h-32 border-b border-surface-container-highest/10 group/row mb-2">
            
            {/* Box Label */}
            <div className="w-48 p-4 shrink-0 bg-[#0A0A0A] z-20 flex flex-col justify-center border-r border-surface-container-highest/20">
              <span className="text-xs font-black tracking-tighter text-on-surface/30">0{box.number}</span>
              <span className="font-label text-[11px] font-bold tracking-widest uppercase text-white">{box.name}</span>
            </div>

            {/* Grid Lines Cliváveis */}
            <div className="flex-1 flex relative">
              {timeSlots.map((hour, idx) => (
                <div 
                  key={`drop-${box.number}-${hour}`}
                  className={`flex-1 border-l border-surface-container-highest/10 hover:bg-surface-container-highest/5 cursor-pointer transition-colors ${idx === timeSlots.length -1 ? 'border-r' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, box.number, hour)}
                  onClick={() => {
                    if (onEmptyClick) onEmptyClick(box.number, box.name, hour);
                  }}
                  title={`Agendar no ${box.name} às ${String(hour).padStart(2, '0')}:00`}
                />
              ))}

              {/* Renderização ABSOLUTA dos Agendamentos */}
              {appointments
                .filter(a => a.box_number === box.number)
                .map((app) => {
                  const { left, width } = calculatePosition(app.start_time, app.end_time);
                  const { statusLabel, statusKey, progress } = getDynamicStatusAndProgress(app);
                  
                  const isFinished = statusKey === 'finished';
                  const mainColor = isFinished ? 'bg-surface-container-highest/80' : 
                                    statusKey === 'active' ? 'bg-primary-container/20 border border-primary-container/40' : 'bg-white';
                  const borderSide = isFinished ? 'border-l-4 border-surface-bright' : 
                                     statusKey === 'active' ? 'border-l-0' : 'border-l-4 border-primary-container';
                  
                  const textColor = statusKey === 'waiting' ? 'text-black' : 'text-white';
                  const subtextColor = statusKey === 'waiting' ? 'text-black/60' : 'text-on-surface/60';
                  const badgeClasses = statusKey === 'active' ? 'bg-white text-primary-container' : 
                                       statusKey === 'waiting' ? 'bg-black text-white' : 'bg-surface-container-low text-on-surface/40';

                  const startTimeStr = new Date(app.start_time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

                  return (
                    <div 
                      key={app.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      className={`absolute top-2 bottom-2 p-3 flex flex-col justify-between shadow-lg cursor-move transition-all hover:z-30 hover:-translate-y-1 ${mainColor} ${borderSide} overflow-hidden group`}
                      style={{ left, width }}
                      title={`${app.client_name} - ${app.service_name} (${app.estimated_time}m)`}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className={`font-label text-[8px] tracking-widest ${subtextColor} uppercase truncate w-3/4`}>{app.service_name}</span>
                          <span className={`material-symbols-outlined text-[10px] ${statusKey === 'waiting' ? 'text-black/40' : 'text-white/40'} opacity-0 group-hover:opacity-100 transition-opacity`}>drag_indicator</span>
                        </div>
                        <h4 className={`font-black text-[11px] ${textColor} truncate my-1 leading-tight`}>{app.vehicle_brand} {app.vehicle_model}</h4>
                      </div>
                      
                      <div className="flex justify-between items-end mt-auto gap-2">
                        <div className="flex flex-col gap-1 w-full">
                           <div className="flex justify-between items-center w-full">
                             <span className={`font-label text-[8px] tracking-widest ${subtextColor}`}>CHASSI: {app.plate}</span>
                             <select
                               value={app.status || 'Agendado'}
                               onChange={(e) => handleStatusChange(app.id, e.target.value)}
                               onClick={(e) => e.stopPropagation()}
                               className={`appearance-none outline-none cursor-pointer px-2 py-0.5 font-label text-[7px] font-black uppercase tracking-widest ${badgeClasses}`}
                             >
                               <option value="Aguardando" className="text-black bg-white">AGUARDANDO</option>
                               <option value="Agendado" className="text-black bg-white">AGENDADO</option>
                               <option value="Em Processamento" className="text-black bg-white">EM PROCESSAMENTO</option>
                               <option value="Finalizado" className="text-black bg-white">FINALIZADO</option>
                             </select>
                           </div>
                           
                           {/* Barra de Progresso caso ativo */}
                           {statusKey === 'active' && (
                             <div className="flex items-center gap-2 mt-1 w-full">
                               <div className="flex-1 h-1 bg-surface-container-highest">
                                 <div className="h-full bg-primary-container transition-all" style={{ width: `${progress}%` }}></div>
                               </div>
                               <span className="font-label text-[8px] text-on-surface/60">{Math.round(progress)}%</span>
                             </div>
                           )}

                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 bottom-1">
                             <button 
                               type="button"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleDelete(app.id);
                               }}
                               className={`material-symbols-outlined text-[14px] hover:text-[#E31B23] p-0.5 ${textColor}`}
                               title="Remover"
                             >
                               delete
                             </button>
                           </div>
                        </div>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        ))}
        </div>
      </div>

    </section>
  );
}
