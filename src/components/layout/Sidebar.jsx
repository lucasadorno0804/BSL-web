import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const baseLinkClass = "flex items-center px-6 py-3 transition-colors group";
  const getLinkClass = ({ isActive }) => 
    isActive 
      ? `${baseLinkClass} text-white border-l-2 border-primary-container bg-surface-container-high font-bold`
      : `${baseLinkClass} text-on-surface/70 hover:text-white hover:bg-surface-container-high/50`;

  const handleNewService = () => {
    if (location.pathname.includes('/agenda')) {
      window.dispatchEvent(new CustomEvent('openNewServiceModal'));
    } else {
      navigate('/agenda', { state: { openNewServiceModal: true } });
    }
  };

  return (
    <aside className="flex flex-col h-full py-8 px-0 w-64 h-screen fixed left-0 top-0 border-r-0 bg-[#131313] z-50">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold tracking-tighter text-primary-container">PRECISION OPS</h1>
        <p className="font-label text-[10px] tracking-[0.05em] text-on-surface/40">V1.0.42</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        <NavLink to="/painel" className={getLinkClass}>
          <span className="material-symbols-outlined mr-4">dashboard</span>
          <span className="font-label text-sm tracking-wide uppercase">Painel</span>
        </NavLink>
        <NavLink to="/agenda" className={getLinkClass}>
          <span className="material-symbols-outlined mr-4">calendar_month</span>
          <span className="font-label text-sm tracking-wide uppercase">Agenda</span>
        </NavLink>
        <NavLink to="/vistorias" className={getLinkClass}>
          <span className="material-symbols-outlined mr-4">fact_check</span>
          <span className="font-label text-sm tracking-wide uppercase">Inspeções</span>
        </NavLink>
        <NavLink to="/financeiro" className={getLinkClass}>
          <span className="material-symbols-outlined mr-4">account_balance_wallet</span>
          <span className="font-label text-sm tracking-wide uppercase">Financeiro</span>
        </NavLink>
        <NavLink to="/caixa" className={getLinkClass}>
          <span className="material-symbols-outlined mr-4">point_of_sale</span>
          <span className="font-label text-sm tracking-wide uppercase">Caixa</span>
        </NavLink>
      </nav>
      
      <div className="px-6 mb-6">
        <button 
          onClick={handleNewService}
          className="w-full py-3 bg-primary-container text-on-primary-container font-label font-bold text-xs tracking-widest active:scale-95 transition-all duration-75 hover:bg-[#c2161c]"
        >
          NOVO SERVIÇO
        </button>
      </div>

      <div className="mt-auto space-y-1">
        <a className="flex items-center px-6 py-3 text-on-surface/70 hover:text-white hover:bg-surface-container-high/50 transition-colors group" href="#">
          <span className="material-symbols-outlined mr-4">settings</span>
          <span className="font-label text-sm tracking-wide uppercase">Configurações</span>
        </a>
        <div className="px-6 pt-6 flex items-center gap-3 border-t border-surface-container-highest/20 mt-2">
          <div className="w-10 h-10 bg-surface-container-highest flex items-center justify-center">
             <span className="material-symbols-outlined text-on-surface/50">person</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">GERENTE</p>
            <p className="text-[10px] font-label text-on-surface/50">ADMIN</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
