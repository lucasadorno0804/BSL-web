import React from 'react';

export default function Dashboard() {
  return (
    <div className="px-12 py-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="font-label text-primary-container text-xs tracking-[0.2em] font-bold mb-2">STATUS_DO_SISTEMA: OTIMIZADO</p>
          <h2 className="text-5xl font-black tracking-tight text-white uppercase">Batimento <span className="text-primary-container">Operacional</span></h2>
        </div>
        <div className="text-right">
          <p className="font-label text-on-surface/40 text-xs tracking-widest">TIMESTAMP_SESSAO_ATUAL</p>
          <p className="text-xl font-bold font-label">24 OUT 2023 // 14:42:09</p>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        {/* Total Cars in Yard */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-high p-8 flex flex-col justify-between group hover:bg-surface-bright transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs tracking-widest text-on-surface/50 uppercase">Ocupação_da_Oficina</span>
            <span className="material-symbols-outlined text-primary-container">directions_car</span>
          </div>
          <div className="mt-8">
            <p className="text-7xl font-black text-white tracking-tighter">14<span className="text-2xl text-on-surface/30 font-light tracking-normal ml-2">/ 20</span></p>
            <p className="font-label text-sm text-on-surface/60 mt-2 uppercase">Veículos em Processamento</p>
          </div>
          <div className="mt-6 w-full bg-surface-container-lowest h-1">
            <div className="bg-primary-container h-full w-[70%]"></div>
          </div>
        </div>

        {/* Daily Revenue */}
        <div className="col-span-12 md:col-span-5 bg-surface-container-high p-8 group hover:bg-surface-bright transition-all duration-300">
          <div className="flex justify-between items-start mb-12">
            <span className="font-label text-xs tracking-widest text-on-surface/50 uppercase">Fluxo_de_Receita_Diário</span>
            <span className="material-symbols-outlined text-tertiary">monitoring</span>
          </div>
          <div className="flex items-baseline space-x-4">
            <p className="text-6xl font-black text-white tracking-tighter">R$ 4.280,00</p>
            <p className="text-tertiary font-label text-sm font-bold">+12,4%</p>
          </div>
          <div className="mt-4 flex space-x-1 items-end h-16">
             {/* Mock de barras - Pode ser feito com recharts dps */}
            <div className="flex-1 bg-surface-container-lowest h-[40%]"></div>
            <div className="flex-1 bg-surface-container-lowest h-[60%]"></div>
            <div className="flex-1 bg-surface-container-lowest h-[55%]"></div>
            <div className="flex-1 bg-surface-container-lowest h-[80%]"></div>
            <div className="flex-1 bg-primary-container h-[95%]"></div>
            <div className="flex-1 bg-surface-container-lowest h-[30%] opacity-20"></div>
            <div className="flex-1 bg-surface-container-lowest h-[45%] opacity-20"></div>
          </div>
        </div>

        {/* Monthly Goals */}
        <div className="col-span-12 md:col-span-3 bg-surface-container-lowest p-8 flex flex-col justify-center border-l-4 border-primary-container">
          <span className="font-label text-xs tracking-widest text-on-surface/50 uppercase mb-4">Conclusão_da_Cota</span>
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
             <span className="text-2xl font-black text-white z-10">82%</span>
            <svg className="w-full h-full transform -rotate-90 absolute">
              <circle className="text-surface-container-high" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
              {/* Note: strokeDashoffset depends on real values */}
              <circle className="text-primary-container" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="65.6" strokeWidth="8"></circle>
            </svg>
          </div>
          <p className="text-center font-label text-[10px] tracking-widest text-on-surface/40 mt-4 uppercase">Meta: R$ 85.000,00</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-label text-sm font-bold tracking-[0.3em] text-white uppercase">Próximos_Serviços</h3>
            <button className="text-xs font-label text-primary-container hover:underline tracking-widest">VER_ESCALA_COMPLETA</button>
          </div>
          
          <div className="space-y-4">
             {/* Mock item 1 */}
            <div className="bg-surface-container-high flex items-center p-6 group cursor-pointer transition-all hover:bg-surface-bright">
              <div className="w-20 font-label">
                <p className="text-xs text-on-surface/40 uppercase">Hora</p>
                <p className="text-lg font-bold text-white">15:00</p>
              </div>
              <div className="flex-1 px-8">
                <p className="font-label text-[10px] text-tertiary-fixed-dim tracking-widest uppercase mb-1">Vitrificação_Cerâmica</p>
                <h4 className="text-xl font-black tracking-tight text-white">2024 PORSCHE 911 GT3 RS</h4>
              </div>
              <div className="text-right">
                <div className="bg-surface-container-lowest px-4 py-2 text-[10px] font-label font-bold tracking-widest text-on-surface/60 uppercase">
                  STATUS: PREP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-surface-container-high p-8 h-full">
            <div className="flex items-center mb-8">
              <div className="w-2 h-2 bg-primary-container animate-pulse mr-3"></div>
              <h3 className="font-label text-sm font-bold tracking-[0.3em] text-white uppercase">Notificações_Críticas</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex space-x-4">
                <div className="bg-error-container/20 p-2 h-fit">
                  <span className="material-symbols-outlined text-primary-container">warning</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">ALERTA_SUPRIMENTO</p>
                  <p className="text-xs text-on-surface/50 font-label">Estoque abaixo de 15%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
