import React from 'react';

export default function Inspections() {
  return (
    <div className="pt-12 pb-12 px-12 min-h-screen bg-surface">
      {/* Inspection Header */}
      <div className="mb-12 flex justify-between items-end border-b-0">
        <div className="max-w-2xl">
          <h2 className="font-headline text-5xl font-black tracking-tight text-white mb-4">CHECK-IN DE VEÍCULO</h2>
          <p className="font-body text-white/60 tracking-[0.05em] uppercase text-xs leading-relaxed">
            Realize uma inspeção digital de alta precisão. Documente todas as condições pré-existentes para manter a proteção de responsabilidade e a integridade técnica do serviço.
          </p>
        </div>
        <div className="text-right">
          <div className="bg-surface-container-high px-4 py-2 mb-2 inline-block">
            <span className="font-label text-[10px] text-white/40 block">ID_CLIENTE</span>
            <span className="font-label text-sm font-bold text-white tracking-widest">DR_6619_GT</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Damage Mapping */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Vehicle Diagram Section */}
          <section className="bg-surface-container-high p-10 relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="font-label text-xs font-bold tracking-[0.2em] text-primary-container uppercase">01 // MAPEAMENTO DE SUPERFÍCIE</h3>
                <p className="text-[11px] font-body text-white/40 mt-1 uppercase tracking-wider">Marque zonas de impacto, marcas de turbilhonamento ou riscos profundos</p>
              </div>
              <div className="flex gap-4">
                <button className="bg-surface-bright px-3 py-1.5 font-label text-[10px] tracking-widest text-white border-l-2 border-primary-container">ARRANHÃO</button>
                <button className="bg-surface-container-lowest px-3 py-1.5 font-label text-[10px] tracking-widest text-white/40 hover:bg-surface-bright transition-colors">AMASSADO</button>
                <button className="bg-surface-container-lowest px-3 py-1.5 font-label text-[10px] tracking-widest text-white/40 hover:bg-surface-bright transition-colors">LASCADO</button>
              </div>
            </div>
            
            {/* Diagram Container */}
            <div className="relative w-full aspect-[21/9] bg-surface-container-lowest flex items-center justify-center p-12">
              <img alt="Contorno do Veículo" className="w-full h-full object-contain opacity-20 grayscale brightness-150 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSPDaKc_y2q0HmqDbezCLbHik4G5JJakSrpcKqi0QzPt-ezUlG0ckd_xtwfFXAD1_TncUjtJ6A8sGCtOQeNnEG07WDHnxo_LAy7nncB2rgEn0ApE2QVYOe1M_oq7s8RFFjVIEGwkq3R-p61GiDsrbSlntpeSzOS-SYgbsQgnX1z9NjDkQi-cjl2v2l6sLoaVEUStsOaE9C5glFqJDBqsf_YNbwgq1Tzqp4x5lUkoBVTjuidUwnAdHqga-YlrqDP0QJxnEl4XcWADJc"/>
              
              {/* Damage Markers */}
              <div className="absolute top-1/2 left-1/3 w-6 h-6 border border-primary-container flex items-center justify-center animate-pulse">
                <span className="w-1 h-1 bg-primary-container"></span>
              </div>
              <div className="absolute top-[40%] right-1/4 w-6 h-6 border border-primary-container flex items-center justify-center">
                <span className="w-1 h-1 bg-primary-container"></span>
              </div>
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 border border-tertiary-container flex items-center justify-center">
                <span className="w-1 h-1 bg-tertiary-container"></span>
              </div>
              
              {/* Technical Overlays */}
              <div className="absolute top-4 left-4 font-label text-[9px] text-primary-container tracking-widest leading-tight">
                MODO_SCAN: ATIVO<br/>SENSIBILIDADE: ALTA
              </div>
              <div className="absolute bottom-4 right-4 font-label text-[9px] text-white/20 tracking-widest text-right leading-tight">
                REF_X: 22.049<br/>REF_Y: 11.884
              </div>
            </div>
          </section>

          {/* Photo Evidence Bento Grid */}
          <section className="grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-surface-container-high aspect-square group relative cursor-pointer overflow-hidden">
              <img alt="Defeito de Pintura" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0aZpUBSv1rlbZOdfAONAdh7qChqGbZQjvnYxmJ6d2MEhryS6M9SmCq4S2loujX4JVWegHVmBbjLTBRPj-i0yZSYTd-7H9aYlQ-cV9qPPE7UtXXg5dwvf5Vy6g6X_7jASicgyNUimOUkm27FQr-GnZPv9ec-0Mx9XWfj3M35zHvssSrRPoj7l42HnKMLAzCpaLDcyCznKFSlLdl3UUKPanv_MBqdejsqIFFRK3IxfmKGN204E28-bJ4u_X258mAjOJCs0a0R_lcVjm"/>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface-container-lowest/80 backdrop-blur-sm">
                <p className="font-label text-[9px] tracking-widest text-white">MACRO_QUINA_TRASEIRA</p>
              </div>
            </div>
            <div className="col-span-1 bg-surface-container-high aspect-square group relative cursor-pointer overflow-hidden">
              <img alt="Detalhe da Roda" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQOfdxP4-MtvN2QUxUe6bi3rSn4BqSlK_fbX7EhEMvK1tbEwAuEtq9DIEqxK9C45i62Frf_QkUyOar0U3VC1VNj6nGbl_M4xkK-0crZNcwtXY9O7Q0GH8Zb8rGbd0olLrNjOkK_w8IT4AqMpAQ2InCIjqWgmcl5E1OIhpfcjCxRnY1l8CWhPAprnZmdzFSe3jyy-TvZPeVLBOqdIkFJ5Z3psS5h2stKs-ucuW8ezWTB_gHy5CA0hW8bAX6uhupIuWSQagdC0ZigMFY"/>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface-container-lowest/80 backdrop-blur-sm">
                <p className="font-label text-[9px] tracking-widest text-white">ZONA_RODA_02</p>
              </div>
            </div>
            <div className="col-span-1 bg-surface-container-lowest flex flex-col items-center justify-center border-2 border-dashed border-white/5 hover:border-primary-container transition-colors group cursor-pointer">
              <span className="material-symbols-outlined text-white/20 group-hover:text-primary-container mb-2">add_a_photo</span>
              <p className="font-label text-[10px] tracking-widest text-white/40 group-hover:text-white uppercase">Enviar Foto</p>
            </div>
          </section>
        </div>

        {/* Right Column: Checklists & Legal */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Status & Technical Checklist */}
          <section className="bg-surface-container-high p-8">
            <h3 className="font-label text-xs font-bold tracking-[0.2em] text-white uppercase mb-8">02 // ANÁLISE TÉCNICA</h3>
            <div className="space-y-6">
              {/* Checklist Item */}
              <div className="flex items-center justify-between p-4 bg-surface-container-low group cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary-container text-lg" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="font-label text-xs tracking-widest text-white/80 uppercase">Teste de Micragem</span>
                </div>
                <span className="font-label text-[10px] text-primary-container font-bold">120μm</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low group cursor-pointer border-l-2 border-tertiary-container">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-tertiary-container text-lg">pending</span>
                  <span className="font-label text-xs tracking-widest text-white/80 uppercase">Integridade dos Vidros</span>
                </div>
                <span className="font-label text-[10px] text-tertiary-container font-bold">ESCANER</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low group cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-white/20 text-lg">radio_button_unchecked</span>
                  <span className="font-label text-xs tracking-widest text-white/40 uppercase">Análise de Odor Interno</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low group cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-white/20 text-lg">radio_button_unchecked</span>
                  <span className="font-label text-xs tracking-widest text-white/40 uppercase">Nível de Fluidos do Motor</span>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Security Section */}
          <section className="bg-surface-container-high p-8 border-l-4 border-primary-container">
            <h3 className="font-label text-xs font-bold tracking-[0.2em] text-white uppercase mb-4">03 // SEGURANÇA JURÍDICA</h3>
            <p className="font-body text-[10px] text-white/40 leading-relaxed uppercase tracking-widest mb-6">
                Ao finalizar este check-in, o técnico confirma que todas as condições pré-existentes foram documentadas. A assinatura do cliente reconhece o estado atual do veículo antes dos procedimentos de detalhamento.
            </p>
            {/* Signature Field */}
            <div className="bg-surface-container-lowest h-32 w-full mb-6 relative flex items-center justify-center overflow-hidden">
               {/* Note: omitted the 100kb background texture to save bandwidth on rendering and keep aesthetic clean */}
              <span className="font-label text-[9px] text-white/10 uppercase tracking-[0.5em] absolute top-2 left-2 italic">BLOQUEIO_ID_DIGITAL</span>
              <div className="w-4/5 h-[1px] bg-white/20 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 font-label text-[8px] text-white/20">COLOQUE A ASSINATURA AQUI</div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button className="w-full bg-primary-container text-white py-4 font-label font-black text-xs tracking-[0.3em] uppercase transition-all duration-150 active:scale-95 shadow-[0_0_20px_rgba(227,27,35,0.2)]">
                  AUTORIZAR E BLOQUEAR SCAN
              </button>
              <button className="w-full bg-surface-bright text-white/60 py-3 font-label font-bold text-[10px] tracking-widest uppercase hover:text-white transition-colors">
                  IMPRIMIR CÓPIA FÍSICA
              </button>
            </div>
          </section>

          {/* Telemetry Chip */}
          <div className="bg-tertiary-container/10 p-4 flex items-center gap-4">
            <div className="w-2 h-2 bg-tertiary-container animate-pulse"></div>
            <div>
              <p className="font-label text-[9px] font-bold text-tertiary-container tracking-widest">STATUS DO SISTEMA: OTIMIZADO</p>
              <p className="font-label text-[8px] text-tertiary-container/60 uppercase">Sincronizando dados com a nuvem de precisão...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
