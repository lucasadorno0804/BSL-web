import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { Maximize2, Minimize2 } from 'lucide-react';
import { api } from '../services/api';

const API_BASE_URL = 'http://localhost:3000/api';
const SERVER_URL = API_BASE_URL.replace('/api', '');

export default function Inspections() {
  const location = useLocation();
  const appointmentId = location.state?.appId || null; // Pode ser null se acessado diretamente

  const [inspectionId, setInspectionId] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [imagesUrls, setImagesUrls] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [diagramType, setDiagramType] = useState('Hatch');
  const [activeMarkerType, setActiveMarkerType] = useState('ARRANHÃO');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchId, setSearchId] = useState('');
  const [signatureData, setSignatureData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  const sigCanvas = useRef(null);
  const fileInputRef = useRef(null);

  // Carregar ou criar Vistoria ao montar
  useEffect(() => {
    const loadOrCreateInspection = async () => {
      try {
        if (appointmentId) {
          const existing = await api.get(`/inspections/${appointmentId}`).catch(() => null);
          if (existing) {
            setupInspectionState(existing);
            return;
          }
        }

        // Se não tem ou não encontrou, cria uma nova
        const created = await api.post('/inspections', { appointmentId, type: 'Entrada' });
        setupInspectionState(created);

      } catch (err) {
        console.error("Erro ao iniciar vistoria", err);
      }
    };
    loadOrCreateInspection();
  }, [appointmentId]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/schedule/resources');
        setClients(res.clients || []);
      } catch (err) {
        console.error("Erro ao buscar clientes", err);
      }
    };
    fetchResources();
  }, []);

  const inferDiagramType = (modelString) => {
    if (!modelString) return 'Hatch';
    const lower = modelString.toLowerCase();
    if (lower.includes('compass') || lower.includes('suv') || lower.includes('renegade') || lower.includes('tucson') || lower.includes('creta')) return 'Suv';
    if (lower.includes('sedan') || lower.includes('320i') || lower.includes('corolla') || lower.includes('civic')) return 'Sedan';
    if (lower.includes('sw') || lower.includes('perua') || lower.includes('avant') || lower.includes('touring') || lower.includes('variant')) return 'Sw';
    return 'Hatch';
  };

  const setupInspectionState = (data) => {
    setInspectionId(data.id);
    setIsLocked(data.is_locked);
    setSignatureData(data.signature || null);

    if (data.selected_diagram_type) {
      setDiagramType(data.selected_diagram_type);
    } else {
      setDiagramType(inferDiagramType(data.vehicle_model));
    }

    if (data.checklist && typeof data.checklist === 'string') {
      setMarkers(JSON.parse(data.checklist));
    } else if (Array.isArray(data.checklist)) {
      setMarkers(data.checklist);
    }

    if (data.images_urls && typeof data.images_urls === 'string') {
      setImagesUrls(JSON.parse(data.images_urls));
    } else if (Array.isArray(data.images_urls)) {
      setImagesUrls(data.images_urls);
    }

    if (data.client_id) setSelectedClientId(data.client_id);
    if (data.vehicle_id) setSelectedVehicleId(data.vehicle_id);
  };

  const handleDiagramClick = async (e) => {
    if (isLocked || !inspectionId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker = {
      id: Date.now(),
      x: xPercent,
      y: yPercent,
      type: activeMarkerType
    };

    const newMarkers = [...markers, newMarker];
    setMarkers(newMarkers);

    // Save to backend
    try {
      await api.put(`/inspections/${inspectionId}`, { checklist: newMarkers, diagramType });
    } catch (error) {
      console.error("Erro ao salvar marcador", error);
    }
  };

  const handleUndoMarker = async (e) => {
    e.stopPropagation();
    if (isLocked || !inspectionId || markers.length === 0) return;

    const newMarkers = markers.slice(0, -1);
    setMarkers(newMarkers);

    try {
      await api.put(`/inspections/${inspectionId}`, { checklist: newMarkers, diagramType });
    } catch (error) {
      console.error("Erro ao desfazer marcador", error);
    }
  };

  const handleClearMarkers = async (e) => {
    e.stopPropagation();
    if (isLocked || !inspectionId) return;

    setMarkers([]);

    try {
      await api.put(`/inspections/${inspectionId}`, { checklist: [], diagramType });
    } catch (error) {
      console.error("Erro ao limpar marcadores", error);
    }
  };

  const handleDiagramSwitch = async (type) => {
    if (isLocked || diagramType === type || !inspectionId) return;
    setDiagramType(type);
    setMarkers([]); // Limpa as marcações do carro anterior
    try {
      await api.put(`/inspections/${inspectionId}`, { checklist: [], diagramType: type });
    } catch (error) {
      console.error("Erro ao alterar tipo do diagrama", error);
    }
  };

  const handleDiagramMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: xPercent.toFixed(3), y: yPercent.toFixed(3) });
  };

  const handleVehicleSelect = async (vehicleId) => {
    if (isLocked || !inspectionId) return;
    setSelectedVehicleId(vehicleId);
    try {
      await api.put(`/inspections/${inspectionId}/vehicle`, { vehicleId });
      
      const client = clients.find(c => c.id === selectedClientId);
      const vehicle = client?.vehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        const inferred = inferDiagramType(vehicle.model);
        if (diagramType !== inferred) {
           handleDiagramSwitch(inferred);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar veículo", error);
    }
  };

  const handleFileUpload = async (e) => {
    if (isLocked || !inspectionId || !e.target.files[0]) return;

    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      // Use raw fetch for FormData because api.js forces JSON
      const token = localStorage.getItem('@BSL:token');
      const res = await fetch(`${API_BASE_URL}/inspections/${inspectionId}/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      const data = await res.json();

      let newUrls = [];
      if (typeof data.images_urls === 'string') {
        newUrls = JSON.parse(data.images_urls);
      } else {
        newUrls = data.images_urls;
      }
      setImagesUrls(newUrls);
    } catch (error) {
      console.error("Erro ao enviar foto", error);
    }
  };

  const handleLock = async () => {
    if (isLocked || !inspectionId || !sigCanvas.current) return;

    if (sigCanvas.current.isEmpty()) {
      alert("Por favor, assine o documento antes de autorizar.");
      return;
    }

    const signatureDataStr = sigCanvas.current.getCanvas().toDataURL('image/png');

    try {
      await api.post(`/inspections/${inspectionId}/lock`, { signature: signatureDataStr });
      setIsLocked(true);
      setSignatureData(signatureDataStr);
    } catch (error) {
      console.error("Erro ao travar vistoria", error);
      alert(error.message || "Erro ao bloquear");
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    try {
      const existing = await api.get(`/inspections/id/${searchId.trim()}`);
      if (existing) {
        setupInspectionState(existing);
      }
    } catch (err) {
      console.error("Erro ao buscar vistoria", err);
      alert("Vistoria não encontrada");
    }
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case 'ARRANHÃO': return 'bg-[#E31B23] border-[#E31B23]';
      case 'AMASSADO': return 'bg-tertiary-container border-tertiary-container';
      case 'LASCADO': return 'bg-primary border-primary';
      default: return 'bg-[#E31B23] border-[#E31B23]';
    }
  };

  return (
    <div className="py-4 md:py-12 px-4 md:px-12 min-h-screen bg-surface">
      {/* Inspection Header */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b-0 gap-6 md:gap-0">
        <div className="max-w-2xl">
          <h2 className="font-headline text-5xl font-black tracking-tight text-white mb-4">CHECK-IN DE VEÍCULO</h2>
          <p className="font-body text-white/60 tracking-[0.05em] uppercase text-xs leading-relaxed">
            Realize uma inspeção digital de alta precisão. Documente todas as condições pré-existentes para manter a proteção de responsabilidade e a integridade técnica do serviço.
          </p>
        </div>
        <div className="w-full md:w-auto text-left md:text-right flex flex-col sm:flex-row items-start sm:items-end gap-4 justify-start md:justify-end">
          <div className="flex bg-surface-container-high p-2 items-center mb-0 sm:mb-2 border border-surface-container-highest w-full sm:w-auto">
            <input
              type="text"
              placeholder="BUSCAR ID..."
              className="bg-transparent border-none text-white font-label text-sm outline-none px-2 uppercase w-32 focus:ring-0"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="material-symbols-outlined text-white/40 hover:text-white px-2 transition-colors">search</button>
          </div>
          <div className="bg-surface-container-high px-4 py-2 mb-0 sm:mb-2 inline-block text-left w-full sm:w-auto">
            <span className="font-label text-[10px] text-white/40 block">VISTORIA ID</span>
            <span className="font-label text-sm font-bold text-white tracking-widest uppercase">
              {inspectionId ? inspectionId.split('-')[0] : 'CRIANDO...'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
        {/* Left Column: Damage Mapping */}
        <div className="lg:col-span-8 space-y-8">
          {/* Vehicle Diagram Section */}
          <section className={`bg-surface-container-high p-4 sm:p-10 relative overflow-hidden transition-all duration-300 ${isLocked ? 'opacity-80 pointer-events-none' : ''} ${isFullscreen ? 'fixed inset-0 z-[100] m-0 bg-[#131313] flex flex-col overflow-y-auto' : ''}`}>
            {isFullscreen && (
              <button 
                onClick={() => setIsFullscreen(false)} 
                className="absolute top-6 right-6 z-50 p-3 bg-surface-container-lowest rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors shadow-lg"
                title="Sair da Tela Cheia"
              >
                <Minimize2 size={24} />
              </button>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 sm:gap-0">
              <div className="flex items-start gap-4">
                <div>
                  <h3 className="font-label text-xs font-bold tracking-[0.2em] text-primary-container uppercase">// MAPEAMENTO DE SUPERFÍCIE</h3>
                  <p className="text-[11px] font-body text-white/40 mt-1 uppercase tracking-wider">Marque zonas de impacto, marcas de turbilhonamento ou riscos profundos</p>
                </div>
                {!isFullscreen && (
                  <button 
                    onClick={() => setIsFullscreen(true)} 
                    className="p-2 mt-[-4px] bg-surface-container-lowest rounded-md text-white/50 hover:text-white transition-colors"
                    title="Tela cheia"
                  >
                    <Maximize2 size={18} />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {['ARRANHÃO', 'AMASSADO', 'LASCADO'].map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveMarkerType(type)}
                    className={`px-3 py-1.5 font-label text-[10px] tracking-widest transition-colors flex items-center gap-2 ${activeMarkerType === type ? 'bg-surface-bright text-white border-l-2 border-primary-container' : 'bg-surface-container-lowest text-white/40 hover:bg-surface-bright'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${getMarkerColor(type)} inline-block`}></span>
                    {type}
                  </button>
                ))}
                {!isLocked && markers.length > 0 && (
                  <>
                    <button
                      onClick={handleUndoMarker}
                      className="ml-2 px-3 py-1.5 font-label text-[10px] tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-colors uppercase flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[14px]">undo</span>
                      Voltar
                    </button>
                    <button
                      onClick={handleClearMarkers}
                      className="ml-2 px-3 py-1.5 font-label text-[10px] tracking-widest text-[#E31B23] hover:bg-[#E31B23]/10 transition-colors uppercase flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      Limpar
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Diagram Switcher */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['Hatch', 'Sedan', 'Suv', 'Sw'].map(type => (
                <button
                  key={type}
                  onClick={() => handleDiagramSwitch(type)}
                  disabled={isLocked}
                  className={`px-4 py-2 font-label text-[10px] tracking-widest transition-colors uppercase ${diagramType === type ? 'bg-primary-container text-surface-container-lowest' : 'bg-surface-container-lowest text-white/40 hover:bg-surface-bright disabled:opacity-50 disabled:cursor-not-allowed'}`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Diagram Container */}
            <div
              className={`relative w-full bg-surface-container-lowest flex items-center justify-center p-4 cursor-crosshair overflow-hidden ${isFullscreen ? 'flex-1 min-h-0 min-h-[60vh]' : 'aspect-video'}`}
              onClick={handleDiagramClick}
              onMouseMove={handleDiagramMouseMove}
            >
              <img alt={`Contorno do Veículo ${diagramType}`} className="w-full h-full object-contain invert opacity-40 pointer-events-none select-none drop-shadow-md" src={`/${diagramType}.svg`} />

              {/* Damage Markers */}
              {markers.map(marker => (
                <div
                  key={marker.id}
                  className={`absolute w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-fade-in ${getMarkerColor(marker.type)}`}
                  style={{ top: `${marker.y}%`, left: `${marker.x}%` }}
                  title={marker.type}
                />
              ))}

              {/* Technical Overlays */}
              <div className="absolute top-4 left-4 font-label text-[9px] text-primary-container tracking-widest leading-tight pointer-events-none">
                MODO_SCAN: {isLocked ? 'BLOQUEADO' : 'ATIVO'}<br />MARCADORES: {markers.length}
              </div>
              <div className="absolute bottom-4 right-4 font-label text-[9px] text-white/20 tracking-widest text-right leading-tight pointer-events-none">
                REF_X: {mousePos.x}<br />REF_Y: {mousePos.y}
              </div>
            </div>
          </section>

          {/* Photo Evidence Bento Grid */}
          <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {imagesUrls.map((url, idx) => (
              <div key={idx} className="col-span-1 bg-surface-container-high aspect-square group relative cursor-pointer overflow-hidden">
                <img alt={`Evidência ${idx}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src={`${SERVER_URL}${url}`} />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface-container-lowest/80 backdrop-blur-sm">
                  <p className="font-label text-[9px] tracking-widest text-white">EVIDÊNCIA_{String(idx + 1).padStart(2, '0')}</p>
                </div>
              </div>
            ))}

            {!isLocked && (
              <div
                className="col-span-1 bg-surface-container-lowest flex flex-col items-center justify-center border-2 border-dashed border-white/5 hover:border-primary-container transition-colors group cursor-pointer aspect-square"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="material-symbols-outlined text-white/20 group-hover:text-primary-container mb-2 transition-colors">add_a_photo</span>
                <p className="font-label text-[10px] tracking-widest text-white/40 group-hover:text-white uppercase transition-colors">Enviar Foto</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Checklists & Legal */}
        <div className="lg:col-span-4 space-y-8">
          {/* Identification Section */}
          <section className="bg-surface-container-high p-4 md:p-8">
            <h3 className="font-label text-xs font-bold tracking-[0.2em] text-white uppercase mb-8">// IDENTIFICAÇÃO</h3>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-label text-[10px] text-white/40 uppercase tracking-widest">Cliente</label>
                <select 
                  className="bg-surface-container-low border border-surface-container-highest text-white p-3 font-body text-sm outline-none focus:border-primary-container disabled:opacity-50"
                  value={selectedClientId || ''}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    setSelectedVehicleId('');
                  }}
                  disabled={isLocked || !!appointmentId}
                >
                  <option value="">Selecione o Cliente</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label text-[10px] text-white/40 uppercase tracking-widest">Veículo</label>
                <select 
                  className="bg-surface-container-low border border-surface-container-highest text-white p-3 font-body text-sm outline-none focus:border-primary-container disabled:opacity-50"
                  value={selectedVehicleId || ''}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  disabled={isLocked || !selectedClientId || !!appointmentId}
                >
                  <option value="">Selecione o Veículo</option>
                  {clients.find(c => c.id === selectedClientId)?.vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model} - {v.plate}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Legal Security Section */}
          <section className="bg-surface-container-high p-4 md:p-8 border-l-4 border-primary-container">
            <h3 className="font-label text-xs font-bold tracking-[0.2em] text-white uppercase mb-4">// SEGURANÇA JURÍDICA</h3>
            <p className="font-body text-[10px] text-white/40 leading-relaxed uppercase tracking-widest mb-6">
              Ao finalizar este check-in, o técnico confirma que todas as condições pré-existentes foram documentadas. A assinatura do cliente reconhece o estado atual do veículo antes dos procedimentos.
            </p>

            {/* Signature Field */}
            <div className="bg-surface-container-lowest h-32 w-full mb-2 relative flex flex-col justify-center overflow-hidden border border-surface-container-highest">
              {isLocked ? (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest z-20">
                  {signatureData ? (
                    <img src={signatureData} alt="Assinatura" className="h-full object-contain pointer-events-none drop-shadow-md" />
                  ) : (
                    <span className="font-label text-[14px] text-primary-container font-bold tracking-[0.3em] uppercase opacity-70 rotate-[-10deg] border-2 border-primary-container px-4 py-2">
                      VISTORIA TRAVADA
                    </span>
                  )}
                </div>
              ) : (
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="#fff"
                  canvasProps={{ className: 'w-full h-full absolute inset-0 z-10 cursor-crosshair' }}
                />
              )}

              <span className="font-label text-[9px] text-white/10 uppercase tracking-[0.5em] absolute top-2 left-2 italic pointer-events-none">BLOQUEIO_ID_DIGITAL</span>
              <div className="w-4/5 h-[1px] bg-white/20 relative mx-auto pointer-events-none mt-auto mb-4">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 font-label text-[8px] text-white/20">COLOQUE A ASSINATURA AQUI</div>
              </div>
            </div>

            {!isLocked && (
              <button onClick={() => sigCanvas.current?.clear()} className="font-label text-[9px] text-white/40 hover:text-white uppercase tracking-widest mb-6 transition-colors w-full text-right">
                Limpar Assinatura
              </button>
            )}

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={handleLock}
                disabled={isLocked}
                className="w-full bg-primary-container text-white py-4 font-label font-black text-xs tracking-[0.3em] uppercase transition-all duration-150 active:scale-95 shadow-[0_0_20px_rgba(227,27,35,0.2)] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
              >
                {isLocked ? 'VISTORIA AUTORIZADA' : 'AUTORIZAR E BLOQUEAR SCAN'}
              </button>
            </div>
          </section>

          {/* Telemetry Chip */}
          <div className="bg-tertiary-container/10 p-4 flex items-center gap-4">
            <div className={`w-2 h-2 ${isLocked ? 'bg-[#E31B23]' : 'bg-tertiary-container animate-pulse'}`}></div>
            <div>
              <p className={`font-label text-[9px] font-bold tracking-widest ${isLocked ? 'text-[#E31B23]' : 'text-tertiary-container'}`}>
                STATUS DO SISTEMA: {isLocked ? 'BLOQUEADO/SEGURO' : 'OTIMIZADO'}
              </p>
              <p className={`font-label text-[8px] uppercase ${isLocked ? 'text-[#E31B23]/60' : 'text-tertiary-container/60'}`}>
                {isLocked ? 'Registro imutável salvo no servidor.' : 'Sincronizando dados com a nuvem de precisão...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
