import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const baseLinkClass = `flex items-center py-3 transition-all duration-300 group ${isCollapsed ? 'justify-center px-0' : 'px-6'}`;
  
  const getLinkClass = ({ isActive }) => 
    isActive 
      ? `${baseLinkClass} text-white border-l-2 border-primary-container bg-surface-container-high font-bold`
      : `${baseLinkClass} text-on-surface/70 hover:text-white hover:bg-surface-container-high/50 border-l-2 border-transparent`;

  const handleNewService = () => {
    if (setIsOpen) setIsOpen(false);
    if (location.pathname.includes('/agenda')) {
      window.dispatchEvent(new CustomEvent('openNewServiceModal'));
    } else {
      navigate('/agenda', { state: { openNewServiceModal: true } });
    }
  };

  const handleLinkClick = () => {
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`flex flex-col py-8 px-0 h-screen fixed left-0 top-0 border-r border-surface-container-highest/20 bg-[#131313] z-50 transform transition-all duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}>
      
      <div className={`mb-10 mt-2 flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
        {!isCollapsed && (
          <div className="overflow-hidden transition-opacity duration-300">
            <h1 className="text-xl font-bold tracking-tighter text-primary-container whitespace-nowrap">HubDetail</h1>
            <p className="font-label text-[10px] tracking-[0.05em] text-on-surface/40 whitespace-nowrap">V1.0.42</p>
          </div>
        )}
        <button 
          className="hidden md:flex items-center justify-center text-on-surface/50 hover:text-white transition-colors p-1"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          <span className="material-symbols-outlined">
            {isCollapsed ? 'menu' : 'menu_open'}
          </span>
        </button>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-x-hidden">
        <NavLink to="/painel" className={getLinkClass} onClick={handleLinkClick} title="Painel">
          <span className={`material-symbols-outlined ${isCollapsed ? 'mr-0' : 'mr-4'}`}>dashboard</span>
          {!isCollapsed && <span className="font-label text-sm tracking-wide uppercase whitespace-nowrap">Painel</span>}
        </NavLink>
        <NavLink to="/agenda" className={getLinkClass} onClick={handleLinkClick} title="Agenda">
          <span className={`material-symbols-outlined ${isCollapsed ? 'mr-0' : 'mr-4'}`}>calendar_month</span>
          {!isCollapsed && <span className="font-label text-sm tracking-wide uppercase whitespace-nowrap">Agenda</span>}
        </NavLink>
        <NavLink to="/vistorias" className={getLinkClass} onClick={handleLinkClick} title="Inspeções">
          <span className={`material-symbols-outlined ${isCollapsed ? 'mr-0' : 'mr-4'}`}>fact_check</span>
          {!isCollapsed && <span className="font-label text-sm tracking-wide uppercase whitespace-nowrap">Inspeções</span>}
        </NavLink>
        <NavLink to="/financeiro" className={getLinkClass} onClick={handleLinkClick} title="Financeiro">
          <span className={`material-symbols-outlined ${isCollapsed ? 'mr-0' : 'mr-4'}`}>account_balance_wallet</span>
          {!isCollapsed && <span className="font-label text-sm tracking-wide uppercase whitespace-nowrap">Financeiro</span>}
        </NavLink>
        <NavLink to="/caixa" className={getLinkClass} onClick={handleLinkClick} title="Caixa">
          <span className={`material-symbols-outlined ${isCollapsed ? 'mr-0' : 'mr-4'}`}>point_of_sale</span>
          {!isCollapsed && <span className="font-label text-sm tracking-wide uppercase whitespace-nowrap">Caixa</span>}
        </NavLink>
      </nav>
      
      <div className={`mb-6 flex ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        <button 
          onClick={handleNewService}
          title="Novo Serviço"
          className={`${isCollapsed ? 'w-10 h-10 rounded-full flex items-center justify-center p-0' : 'w-full py-3'} bg-primary-container text-on-primary-container font-label font-bold text-xs tracking-widest active:scale-95 transition-all duration-75 hover:bg-[#c2161c] overflow-hidden`}
        >
          {isCollapsed ? (
             <span className="material-symbols-outlined text-[20px]">add</span>
          ) : (
             <span className="whitespace-nowrap">NOVO SERVIÇO</span>
          )}
        </button>
      </div>

      <div className="mt-auto space-y-1 overflow-x-hidden">
        <button 
          title="Configurações"
          className={`w-full flex items-center py-3 text-on-surface/70 hover:text-white hover:bg-surface-container-high/50 transition-colors group ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}
        >
          <span className={`material-symbols-outlined ${isCollapsed ? 'mr-0' : 'mr-4'}`}>settings</span>
          {!isCollapsed && <span className="font-label text-sm tracking-wide uppercase whitespace-nowrap">Configurações</span>}
        </button>
      </div>
      
      <div className={`pt-6 flex items-center border-t border-surface-container-highest/20 mt-2 ${isCollapsed ? 'justify-center px-0 pb-4 flex-col gap-4' : 'justify-between px-6'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-container-highest flex items-center justify-center flex-shrink-0" title={isCollapsed ? user?.name || 'GERENTE' : undefined}>
               <span className="material-symbols-outlined text-on-surface/50">person</span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-on-surface uppercase truncate max-w-[100px]" title={user?.name}>
                  {user?.name || 'GERENTE'}
                </p>
                <p className="text-[10px] font-label text-on-surface/50 uppercase truncate max-w-[100px]" title={user?.company}>
                  {user?.company || 'ADMIN'}
                </p>
              </div>
            )}
          </div>
          <button 
            onClick={logout} 
            className="text-on-surface/80 hover:text-[#E31B23] transition-colors"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>
    </>
  );
}
