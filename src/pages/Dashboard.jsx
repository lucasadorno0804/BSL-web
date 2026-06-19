import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const SkeletonCard = ({ height = 'h-40', extraClasses = '' }) => (
  <div className={`w-full bg-surface-container-highest animate-pulse ${height} ${extraClasses}`}></div>
);

export default function Dashboard() {
  const [occupancy, setOccupancy] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [finished, setFinished] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = () => {
    api.get('/dashboard/occupancy').then(setOccupancy).catch(console.error);
    api.get('/dashboard/revenue-today').then(setRevenue).catch(console.error);
    api.get('/dashboard/upcoming-services').then(setUpcoming).catch(console.error);
    api.get('/dashboard/finished-services').then(setFinished).catch(console.error);
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/schedule/appointments/${appId}`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);



  return (
    <div className="px-4 md:px-12 py-6 md:py-8 h-screen overflow-y-auto bg-surface relative z-10">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8 md:mb-12">
        <div>
          <p className="font-label text-primary-container text-xs tracking-[0.2em] font-bold mb-2">STATUS_DO_SISTEMA: OTIMIZADO</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">Batimento <span className="text-primary-container">Operacional</span></h2>
        </div>
        <div className="text-right hidden md:block">
          <p className="font-label text-on-surface-variant text-xs tracking-widest">TIMESTAMP_SESSAO</p>
          <p className="text-xl font-bold font-label text-white uppercase">LIVE</p>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        
        {/* Total Cars in Yard */}
        <div className="col-span-12 md:col-span-6 bg-surface-container-high p-8 flex flex-col justify-between group hover:bg-surface-bright transition-all duration-300 min-h-[240px]">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase">Ocupação_da_Oficina</span>
            <span className="material-symbols-outlined text-primary-container">directions_car</span>
          </div>
          {occupancy ? (
            <div className="mt-8 animate-fade-in">
              <p className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                {occupancy.current}
                <span className="text-2xl text-on-surface-variant font-light tracking-normal ml-2">/ {occupancy.capacity}</span>
              </p>
              <p className="font-label text-sm text-on-surface-variant mt-2 uppercase">Veículos em Processamento</p>
              <div className="mt-6 w-full bg-surface-container-lowest h-1">
                <div 
                  className="bg-primary-container h-full transition-all duration-1000 ease-out" 
                  style={{ width: `${occupancy.percentage}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <SkeletonCard height="h-24" extraClasses="mt-8" />
          )}
        </div>

        {/* Daily Revenue */}
        <div className="col-span-12 md:col-span-6 bg-surface-container-high p-8 group hover:bg-surface-bright transition-all duration-300 min-h-[240px] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase">Fluxo_de_Receita_Diário</span>
            <span className="material-symbols-outlined text-tertiary">monitoring</span>
          </div>
          {revenue ? (
            <div className="flex-1 flex flex-col animate-fade-in">
              <div className="flex items-baseline space-x-4 mb-4">
                <p className="text-4xl md:text-6xl font-black text-white tracking-tighter">{formatCurrency(revenue.today)}</p>
                <p className={`font-label text-sm font-bold ${revenue.variation >= 0 ? 'text-tertiary' : 'text-[#E31B23]'}`}>
                  {revenue.variation > 0 ? '+' : ''}{revenue.variation}%
                </p>
              </div>
              <div className="flex-1 w-full min-h-[150px] min-w-0 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenue.chartData}>
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', color: '#FFF' }} />
                    <Bar dataKey="value" fill="#E31B23" radius={[2, 2, 0, 0]}>
                      {revenue.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === revenue.chartData.length - 1 ? '#E31B23' : '#333'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <SkeletonCard height="flex-1" extraClasses="mt-2" />
          )}
        </div>


      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-label text-sm font-bold tracking-[0.3em] text-white uppercase">Próximos_Serviços</h3>
          </div>
          
          <div className="space-y-4">
             {upcoming ? (
               upcoming.length > 0 ? (
                 upcoming.map(app => (
                   <div key={app.id} className="bg-surface-container-high flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 group cursor-pointer transition-all hover:bg-surface-bright animate-fade-in gap-4 sm:gap-0">
                     <div className="w-full sm:w-20 font-label border-b sm:border-b-0 sm:border-r border-surface-container-highest pb-2 sm:pb-0 flex sm:block justify-between items-center">
                       <p className="text-xs text-on-surface-variant uppercase">Hora</p>
                       <p className="text-lg font-bold text-white">{app.time}</p>
                     </div>
                     <div className="flex-1 px-0 sm:px-8 w-full">
                       <p className="font-label text-[10px] text-tertiary tracking-widest uppercase mb-1">{app.category} // {app.serviceName}</p>
                       <h4 className="text-xl font-black tracking-tight text-white uppercase">{app.vehicleDesc}</h4>
                     </div>
                     <div className="w-full sm:w-auto mt-2 sm:mt-0 text-right">
                       <select
                         value={app.status || 'Agendado'}
                         onChange={(e) => handleStatusChange(app.id, e.target.value)}
                         onClick={(e) => e.stopPropagation()}
                         className={`appearance-none outline-none cursor-pointer px-4 py-2 text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase border border-surface-container-highest ${
                           app.status === 'Em Processamento' ? 'bg-white text-primary-container' :
                           app.status === 'Finalizado' ? 'bg-surface-container-highest/80 text-white' :
                           'bg-surface-container-lowest'
                         }`}
                       >
                         <option value="Aguardando" className="text-black bg-white">AGUARDANDO</option>
                         <option value="Agendado" className="text-black bg-white">AGENDADO</option>
                         <option value="Em Processamento" className="text-black bg-white">EM PROCESSAMENTO</option>
                         <option value="Finalizado" className="text-black bg-white">FINALIZADO</option>
                       </select>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="bg-surface-container-high p-8 text-center text-on-surface-variant font-label text-sm uppercase tracking-widest animate-fade-in">
                   Nenhum serviço pendente no momento.
                 </div>
               )
             ) : (
               <>
                 <SkeletonCard height="h-24" />
                 <SkeletonCard height="h-24" />
                 <SkeletonCard height="h-24" />
               </>
             )}
          </div>

          <div className="flex items-center justify-between mt-12 mb-6">
            <h3 className="font-label text-sm font-bold tracking-[0.3em] text-white uppercase">Serviços_Finalizados</h3>
          </div>
          
          <div className="space-y-4">
             {finished ? (
               finished.length > 0 ? (
                 finished.map(app => (
                   <div key={app.id} className="bg-surface-container-high flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 group cursor-pointer transition-all hover:bg-surface-bright animate-fade-in gap-4 sm:gap-0">
                     <div className="w-full sm:w-20 font-label border-b sm:border-b-0 sm:border-r border-surface-container-highest pb-2 sm:pb-0 flex sm:block justify-between items-center">
                       <p className="text-xs text-on-surface-variant uppercase">Hora</p>
                       <p className="text-lg font-bold text-white">{app.time}</p>
                     </div>
                     <div className="flex-1 px-0 sm:px-8 w-full">
                       <p className="font-label text-[10px] text-tertiary tracking-widest uppercase mb-1">{app.category} // {app.serviceName}</p>
                       <h4 className="text-xl font-black tracking-tight text-white uppercase">{app.vehicleDesc}</h4>
                     </div>
                     <div className="w-full sm:w-auto mt-2 sm:mt-0 flex flex-wrap sm:items-center gap-2">
                       <select
                         value={app.status || 'Agendado'}
                         onChange={(e) => handleStatusChange(app.id, e.target.value)}
                         onClick={(e) => e.stopPropagation()}
                         className={`appearance-none outline-none cursor-pointer px-4 py-2 text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase border border-surface-container-highest ${
                           app.status === 'Em Processamento' ? 'bg-white text-primary-container' :
                           app.status === 'Finalizado' ? 'bg-surface-container-highest/80 text-white' :
                           app.status === 'Pago' ? 'bg-[#1E5D3A] text-white' :
                           'bg-surface-container-lowest'
                         }`}
                       >
                         <option value="Aguardando" className="text-black bg-white">AGUARDANDO</option>
                         <option value="Agendado" className="text-black bg-white">AGENDADO</option>
                         <option value="Em Processamento" className="text-black bg-white">EM PROCESSAMENTO</option>
                         <option value="Finalizado" className="text-black bg-white">FINALIZADO</option>
                         <option value="Pago" className="text-black bg-white">PAGO</option>
                       </select>
                       
                       {app.status === 'Finalizado' && (
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             navigate('/caixa', { state: { appId: app.id } });
                           }}
                           className="bg-[#E31B23] text-white px-4 py-2 font-label text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all border border-[#E31B23]"
                         >
                           Ir para Caixa
                         </button>
                       )}
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="bg-surface-container-high p-8 text-center text-on-surface-variant font-label text-sm uppercase tracking-widest animate-fade-in">
                   Nenhum serviço finalizado hoje.
                 </div>
               )
             ) : (
               <>
                 <SkeletonCard height="h-24" />
                 <SkeletonCard height="h-24" />
               </>
             )}
          </div>
        </div>


      </div>
    </div>
  );
}
