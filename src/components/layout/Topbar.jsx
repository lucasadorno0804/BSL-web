import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Menu } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const [occupancy, setOccupancy] = useState(null);

  useEffect(() => {
    const fetchOccupancy = () => {
      api.get('/dashboard/occupancy').then(setOccupancy).catch(console.error);
    };
    fetchOccupancy();
    const interval = setInterval(fetchOccupancy, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-[#131313]/90 backdrop-blur-xl flex justify-between items-center h-16 px-4 md:px-12 border-b border-surface-container-highest/20">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-on-surface hover:text-primary-container p-2 -ml-2"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:block h-4 w-[1px] bg-surface-container-highest"></div>
        <div className="hidden md:flex items-center gap-4">
          <span className="font-label text-xs tracking-[0.1em] text-on-surface/40">CARGA_BOX_ATIVA:</span>
          <span className="font-label text-xs tracking-[0.1em] text-tertiary">
            {occupancy ? Math.round(occupancy.percentage) + '%' : '...'}
          </span>
        </div>
      </div>

    </header>
  );
}
