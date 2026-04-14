import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-[#131313]/90 backdrop-blur-xl flex justify-between items-center h-16 px-12 ml-64 border-b border-surface-container-highest/20">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-black italic tracking-widest text-[#E31B23]">DETAIL_CORE</span>
        <div className="h-4 w-[1px] bg-surface-container-highest"></div>
        <div className="flex items-center gap-4">
          <span className="font-label text-xs tracking-[0.1em] text-on-surface/40">CARGA_BOX_ATIVA:</span>
          <span className="font-label text-xs tracking-[0.1em] text-tertiary">84%</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/30 text-sm">search</span>
          <input 
            type="text" 
            className="bg-surface-container-lowest border border-surface-container-highest font-label text-[10px] tracking-widest py-2 pl-10 pr-4 w-64 focus:ring-1 focus:ring-primary-container focus:outline-none text-white" 
            placeholder="BUSCAR_CHASSI_OU_CLIENTE" 
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface/80 hover:text-white cursor-pointer text-xl transition-colors">notifications</span>
          <span className="material-symbols-outlined text-on-surface/80 hover:text-white cursor-pointer text-xl transition-colors">terminal</span>
          <div className="h-6 w-[1px] bg-surface-container-highest mx-2"></div>
          
          <button 
            className="text-on-surface/80 hover:text-white transition-colors"
            title="Conta"
          >
            <User size={20} />
          </button>
          
          <button 
            onClick={logout} 
            className="text-on-surface/80 hover:text-[#E31B23] transition-colors"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
