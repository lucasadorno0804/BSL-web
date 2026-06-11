import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';

export default function Checkout() {
  const location = useLocation();
  const preSelectedAppId = location.state?.appId;
  const [appointments, setAppointments] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  
  const [extraServices, setExtraServices] = useState([]);
  const [checks, setChecks] = useState({ reviewed: false });
  const [discountLevel, setDiscountLevel] = useState(10); // 10%
  const [showCatalog, setShowCatalog] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resApps, resSchedule] = await Promise.all([
        api.get('/checkout/active'),
        api.get('/schedule/resources') // contains .services catalog
      ]);
      
      const apps = Array.isArray(resApps) ? resApps : [];
      setAppointments(apps);
      
      if (apps.length > 0) {
        if (preSelectedAppId && apps.some(a => a.id === preSelectedAppId)) {
          setSelectedAppId(preSelectedAppId);
        } else {
          setSelectedAppId(apps[0].id);
        }
      }
      setCatalog(resSchedule.services || []);
    } catch (err) {
      console.error(err);
      showToast('Erro ao carregar dados', 'error');
    }
  };

  const selectedApp = appointments.find(a => a.id === selectedAppId);

  // Math
  const basePrice = selectedApp ? Number(selectedApp.base_price) : 0;
  const extrasPrice = extraServices.reduce((acc, curr) => acc + Number(curr.base_price), 0);
  const subtotal = basePrice + extrasPrice;
  const impostos = 0; // Temporariamente desabilitado
  const desconto = 0; // Temporariamente desabilitado
  const total = subtotal;

  const handleAddExtra = (service) => {
    setExtraServices([...extraServices, service]);
    setShowCatalog(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCheckout = async () => {
    if (!checks.reviewed) {
      showToast('O serviço precisa ser revisado pelo responsável', 'error');
      return;
    }
    
    if (!selectedApp) return;

    try {
      await api.post(`/checkout/${selectedApp.id}/pay`, {
        amount: total,
        payment_method: 'CARTÃO',
        extra_services: extraServices.map(s => s.id)
      });
      
      showToast('Pagamento concluído e box liberado!', 'success');
      
      // Limpa dados e atualiza
      setExtraServices([]);
      setChecks({ reviewed: false });
      
      const newApps = appointments.filter(a => a.id !== selectedApp.id);
      setAppointments(newApps);
      if (newApps.length > 0) setSelectedAppId(newApps[0].id);
      else setSelectedAppId('');
      
    } catch (err) {
      showToast('Erro ao concluir pagamento', 'error');
    }
  };

  const handleWhatsApp = () => {
    if (!selectedApp) return;
    const phone = selectedApp.client_phone || '';
    const cleanPhone = phone.replace(/\D/g, '');
    const vehicle = `${selectedApp.vehicle_brand} ${selectedApp.vehicle_model}`;
    const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    const text = `Olá ${selectedApp.client_name}, seu ${vehicle} (Placa ${selectedApp.plate}) já passou por nossa verificação técnica e está pronto para retirada! Valor final: ${formattedTotal}.`;
    
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-12 h-screen overflow-y-auto bg-surface relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 flex items-center gap-3 text-white font-label text-xs tracking-widest uppercase shadow-2xl animate-fade-in ${
          toast.type === 'error' ? 'bg-[#E31B23]' : 'bg-primary-container'
        }`}>
          <span className="material-symbols-outlined text-[16px]">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 h-full">
        {/* Left Column */}
        <div className="col-span-8 space-y-8">
          
          {/* Seletor de Agendamento Ativo */}
          <section className="bg-surface-container-low p-4 flex items-center justify-between">
             <div className="font-label text-xs tracking-widest text-on-surface-variant uppercase">Sessão Ativa:</div>
             {appointments.length > 0 ? (
               <select 
                 className="bg-surface-container-highest border-none text-white text-sm font-bold uppercase tracking-wider py-2 px-4 outline-none focus:ring-1 focus:ring-primary-container"
                 value={selectedAppId}
                 onChange={(e) => {
                   setSelectedAppId(e.target.value);
                   setExtraServices([]);
                   setChecks({ reviewed: false });
                 }}
               >
                 {appointments.map(a => (
                   <option key={a.id} value={a.id}>
                     {a.client_name} - {a.vehicle_brand} {a.vehicle_model} ({a.plate})
                   </option>
                 ))}
               </select>
             ) : (
               <div className="text-white text-sm uppercase">Nenhum veículo em execução ou aguardando.</div>
             )}
          </section>

          {/* Customer Info Strip */}
          <section className="bg-surface-container-high p-8 flex justify-between items-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${selectedApp ? 'bg-primary-container' : 'bg-surface-container-highest'}`}></div>
            <div className="flex gap-12">
              <div>
                <label className="block font-label text-[10px] text-on-surface-variant tracking-widest uppercase mb-1">Cliente</label>
                <div className="text-lg font-bold tracking-tight text-white uppercase">{selectedApp?.client_name || '-'}</div>
              </div>
              <div>
                <label className="block font-label text-[10px] text-on-surface-variant tracking-widest uppercase mb-1">Veículo</label>
                <div className="text-lg font-bold tracking-tight text-white uppercase">{selectedApp ? `${selectedApp.vehicle_brand} ${selectedApp.vehicle_model}` : '-'}</div>
              </div>
              <div>
                <label className="block font-label text-[10px] text-on-surface-variant tracking-widest uppercase mb-1">Placa</label>
                <div className="text-lg font-label font-medium text-tertiary tracking-widest uppercase">{selectedApp?.plate || '-'}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-tertiary-container/20 text-tertiary font-label text-[10px] tracking-[0.15em] uppercase border border-tertiary-container/30">
                {selectedApp ? `Box ${selectedApp.box_number || '-'}` : 'Pendente'}
              </span>
            </div>
          </section>

          {/* Services Performed Bento */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="font-headline font-bold text-2xl tracking-tighter uppercase">Serviços Realizados</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              
              {/* Base Service from DB */}
              {selectedApp && (
                <div className="bg-surface-container-low p-6 flex flex-col justify-between h-40 border-l-2 border-primary-container relative group">
                  <div className="flex justify-between">
                    <span className="material-symbols-outlined text-primary-container">build</span>
                    <span className="font-label text-sm text-white">R$ {Number(selectedApp.base_price).toFixed(2)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white tracking-tight uppercase">{selectedApp.service_name}</h3>
                    <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Serviço Principal</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-100">
                    <span className="material-symbols-outlined text-primary-container">check_circle</span>
                  </div>
                </div>
              )}

              {/* Extra Services map */}
              {extraServices.map((extra, idx) => (
                <div key={idx} className="bg-surface-container-low p-6 flex flex-col justify-between h-40 border-l-2 border-surface-container-highest relative group">
                  <div className="flex justify-between items-start">
                    <span className="material-symbols-outlined text-on-surface-variant">add</span>
                    <span className="font-label text-sm text-white">R$ {Number(extra.base_price).toFixed(2)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white tracking-tight uppercase">{extra.name}</h3>
                    <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{extra.category}</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setExtraServices(prev => prev.filter((_, i) => i !== idx))} className="text-[#E31B23] hover:text-white transition-colors p-1">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Extra Btn */}
              <div 
                className="bg-surface-container-lowest border border-dashed border-surface-container-highest p-6 flex flex-col items-center justify-center h-40 group cursor-pointer hover:border-primary-container transition-colors relative"
                onClick={() => setShowCatalog(!showCatalog)}
              >
                <span className="material-symbols-outlined text-surface-container-highest group-hover:text-primary-container mb-2 transition-colors">add_circle</span>
                <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em] group-hover:text-white transition-colors">Anexar Serviço Extra</span>
                
                {/* Custom inline catalog dropdown */}
                {showCatalog && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-surface-container-high border border-surface-container-highest z-30 shadow-2xl max-h-48 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    {catalog.map(catItem => (
                       <button 
                         key={catItem.id} 
                         className="w-full text-left p-3 hover:bg-surface-container-low border-b border-surface-container-highest flex justify-between items-center"
                         onClick={() => handleAddExtra(catItem)}
                       >
                         <div>
                           <span className="block font-bold text-xs text-white uppercase">{catItem.name}</span>
                           <span className="block font-label text-[9px] text-on-surface-variant uppercase">{catItem.category}</span>
                         </div>
                         <span className="font-label text-[10px] text-white">R$ {Number(catItem.base_price).toFixed(2)}</span>
                       </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* Final Checklist */}
          <section className="bg-surface-container-low p-8">
            <h3 className="font-label text-xs tracking-[0.2em] text-on-surface-variant uppercase mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-container"></span> Verificação Técnica
            </h3>
            <div className="space-y-4">
              <button 
                onClick={() => setChecks(p => ({ ...p, reviewed: !p.reviewed }))}
                className={`w-full flex items-center justify-between p-4 border-l-2 transition-colors ${checks.reviewed ? 'bg-tertiary-container/10 border-tertiary' : 'bg-surface-container-lowest border-surface-container-highest'}`}
              >
                <span className={`font-label text-xs uppercase tracking-wider ${checks.reviewed ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                  Serviço Revisado para Entrega
                </span>
                <span className={`material-symbols-outlined ${checks.reviewed ? 'text-tertiary' : 'text-on-surface-variant/40'}`}>
                  {checks.reviewed ? 'task_alt' : 'radio_button_unchecked'}
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Billing */}
        <div className="col-span-4 space-y-8">
          <div className="bg-surface-container-high p-8 flex flex-col h-full relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline font-black italic text-xl tracking-widest text-[#E31B23]">FATURAMENTO</h2>
              <span className="material-symbols-outlined text-on-surface-variant">receipt_long</span>
            </div>

            {/* Price Calculation */}
            <div className="space-y-4 flex-1">
              <div className="flex justify-between text-on-surface-variant font-label text-xs uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                </span>
              </div>

              {/* Total */}
              <div className="pt-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="font-label text-[10px] text-on-surface-variant tracking-widest uppercase">Valor Total Devido</div>
                    <div className="text-4xl font-black tracking-tighter text-white mt-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-label text-[10px] text-primary-container tracking-widest uppercase">Status</span>
                    <span className="block font-bold text-xs uppercase text-[#E31B23]">Pendente</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 space-y-4">
              <button 
                onClick={handleCheckout}
                disabled={!selectedApp || !checks.reviewed}
                style={{background: (!selectedApp || !checks.reviewed) ? '#333' : 'linear-gradient(135deg, #E31B23 0%, #93000D 100%)'}}
                className="w-full py-6 font-headline font-bold text-sm tracking-[0.2em] text-white uppercase hover:brightness-110 active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:text-white/30"
              >
                Concluir Pagamento
              </button>
              
              <button 
                onClick={handleWhatsApp}
                disabled={!selectedApp}
                className="w-full border-2 border-[#E31B23] bg-transparent py-4 font-label text-[10px] tracking-[0.25em] text-[#E31B23] font-bold uppercase hover:bg-[#E31B23] hover:text-white transition-all flex items-center justify-center gap-2 disabled:border-surface-container-highest disabled:text-on-surface-variant disabled:hover:bg-transparent"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                Aviso de Carro Pronto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
