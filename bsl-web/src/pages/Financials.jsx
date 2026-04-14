import React from 'react';

export default function Financials() {
  return (
    <div className="p-12 min-h-screen bg-surface">
      {/* Hero Financial Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-12 border-l border-outline-variant/10">
        <div className="p-8 bg-surface-container-low">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Receita Total (MTD)</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-white">$42,890.00</h2>
            <span className="text-[10px] font-label text-tertiary bg-tertiary/10 px-2 py-1">+12.4%</span>
          </div>
        </div>
        <div className="p-8 bg-surface-container-high">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Comissões Pendentes</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-primary-container">$8,412.50</h2>
            <span className="material-symbols-outlined text-primary-container">hourglass_empty</span>
          </div>
        </div>
        <div className="p-8 bg-surface-container-low">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Despesas Operacionais</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-white">$12,140.22</h2>
            <span className="text-[10px] font-label text-error bg-error/10 px-2 py-1">ALUGUEL/SUPRIMENTOS</span>
          </div>
        </div>
        <div className="p-8 bg-surface-container-high">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Fluxo de Caixa Líquido</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-white">$22,337.28</h2>
            <span className="material-symbols-outlined text-tertiary">trending_up</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Transaction Logging */}
        <div className="lg:col-span-4 space-y-12">
          <section>
            <h3 className="font-headline font-bold text-lg tracking-[0.02em] mb-8 border-l-4 border-primary-container pl-4">LANÇAR_DESPESA</h3>
            <div className="bg-surface-container-lowest p-8 space-y-6">
              <div>
                <label className="font-label text-[10px] text-on-surface-variant tracking-widest uppercase mb-2 block">Categoria</label>
                <select className="w-full bg-surface-container-low border-none text-white font-label text-sm py-4 px-4 focus:ring-0 appearance-none">
                  <option>PRODUTOS & QUÍMICOS</option>
                  <option>MANUTENÇÃO DE EQUIPAMENTOS</option>
                  <option>ALUGUEL & UTILIDADES</option>
                  <option>MARKETING</option>
                </select>
              </div>
              <div>
                <label className="font-label text-[10px] text-on-surface-variant tracking-widest uppercase mb-2 block">Valor (BRL)</label>
                <div className="flex">
                  <div className="bg-surface-container-high px-4 flex items-center border-l-2 border-primary-container">
                    <span className="text-xs text-white/50">R$</span>
                  </div>
                  <input className="flex-1 bg-surface-container-low border-none text-white font-label text-lg py-4 px-4 focus:ring-0" placeholder="0,00" type="text" />
                </div>
              </div>
              <button className="w-full bg-surface-bright py-4 text-white font-label font-bold text-xs tracking-widest hover:bg-surface-container-highest transition-colors uppercase">
                Confirmar Lançamento
              </button>
            </div>
          </section>

          <section>
            <h3 className="font-headline font-bold text-lg tracking-[0.02em] mb-8 border-l-4 border-tertiary pl-4">ENTRADA_DE_CAIXA</h3>
            <div className="bg-surface-container-high p-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <button className="bg-surface-container-lowest py-6 flex flex-col items-center justify-center border-l border-tertiary hover:bg-surface-bright transition-all">
                  <span className="material-symbols-outlined text-tertiary mb-2">qr_code_2</span>
                  <span className="font-label text-[10px] tracking-widest">PIX</span>
                </button>
                <button className="bg-surface-container-lowest py-6 flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-all">
                  <span className="material-symbols-outlined text-white mb-2">credit_card</span>
                  <span className="font-label text-[10px] tracking-widest">CARTÃO</span>
                </button>
                <button className="bg-surface-container-lowest py-6 flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-all">
                  <span className="material-symbols-outlined text-white mb-2">payments</span>
                  <span className="font-label text-[10px] tracking-widest">DINHEIRO</span>
                </button>
              </div>
              <div className="bg-surface-container-lowest p-6 flex items-center justify-between">
                <span className="font-label text-[10px] text-on-surface-variant uppercase">Volume Diário Pix</span>
                <span className="font-label text-sm text-tertiary font-bold">R$ 3.120,00</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Matriz de comissões */}
        <div className="lg:col-span-8">
          <section className="mb-12">
            <div className="flex justify-between items-end mb-8">
              <h3 className="font-headline font-bold text-lg tracking-[0.02em] border-l-4 border-on-tertiary-fixed-variant pl-4">MATRIZ_DE_COMISSÕES</h3>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.05em]">Período: Outubro 2023</p>
            </div>
            <div className="overflow-hidden border border-outline-variant/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                    <th className="p-6 font-medium">Técnico</th>
                    <th className="p-6 font-medium">Tipo de Serviço</th>
                    <th className="p-6 font-medium text-right">Valor Base</th>
                    <th className="p-6 font-medium text-right">Taxa</th>
                    <th className="p-6 font-medium text-right text-primary-container">Comissão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 font-body text-sm">
                  {/* Row 1 */}
                  <tr className="bg-surface hover:bg-surface-container-low transition-colors">
                    <td className="p-6">
                      <div className="flex items-center space-x-3">
                         <div className="w-2 h-2 bg-tertiary"></div>
                         <span className="font-bold tracking-tight text-white">Alex Rivera</span>
                      </div>
                    </td>
                    <td className="p-6 font-label text-xs text-on-surface-variant">CERAMIC_COATING_X2</td>
                    <td className="p-6 text-right font-label tracking-[0.05em] text-white/80">R$ 1.200,00</td>
                    <td className="p-6 text-right font-label text-xs">15%</td>
                    <td className="p-6 text-right font-bold text-primary-container tracking-tight">R$ 180,00</td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="bg-surface-container-low hover:bg-surface-container-high transition-colors">
                    <td className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-tertiary"></div>
                        <span className="font-bold tracking-tight text-white">Jordan Smith</span>
                      </div>
                    </td>
                    <td className="p-6 font-label text-xs text-on-surface-variant">INTERIOR_RESTORATION</td>
                    <td className="p-6 text-right font-label tracking-[0.05em] text-white/80">R$ 450,00</td>
                    <td className="p-6 text-right font-label text-xs">20%</td>
                    <td className="p-6 text-right font-bold text-primary-container tracking-tight">R$ 90,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Análise de Fluxo (Bar Chart Placeholder) */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline font-bold text-lg tracking-[0.02em] border-l-4 border-tertiary pl-4">ANÁLISE_DE_FLUXO</h3>
              <div className="flex space-x-2 items-center">
                <span className="w-2 h-2 bg-tertiary"></span>
                <span className="font-label text-[10px] text-on-surface-variant uppercase mr-4">Entrada</span>
                <span className="w-2 h-2 bg-primary-container"></span>
                <span className="font-label text-[10px] text-on-surface-variant uppercase">Saída</span>
              </div>
            </div>
            <div className="h-64 bg-surface-container-lowest p-8 relative flex items-end justify-between space-x-4">
              <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="w-full h-[1px] bg-white"></div>
                <div className="w-full h-[1px] bg-white"></div>
                <div className="w-full h-[1px] bg-white"></div>
                <div className="w-full h-[1px] bg-white"></div>
              </div>
              {/* Pseudo Bars */}
              {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((day, idx) => (
                <div key={idx} className="flex flex-col justify-end w-full space-y-1 group">
                  {/* Saída */}
                  <div className={`w-full bg-primary-container/20 hover:bg-primary-container transition-all`} style={{ height: `${20 + Math.random() * 50}%`}}></div>
                  {/* Entrada */}
                  <div className={`w-full bg-tertiary hover:bg-tertiary-fixed-dim transition-all`} style={{ height: `${40 + Math.random() * 50}%`}}></div>
                  <p className="font-label text-[8px] text-center mt-2 text-on-surface-variant">{day}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

       <div className="mt-16 flex items-center justify-between border-t border-outline-variant/10 pt-8 opacity-50">
        <div className="flex space-x-12">
          <div>
            <p className="font-label text-[10px] tracking-widest uppercase mb-1">Status do Banco de Dados</p>
            <p className="text-[10px] font-bold text-tertiary uppercase">Sincronizado // Cloud-Sec</p>
          </div>
          <div>
            <p className="font-label text-[10px] tracking-widest uppercase mb-1">Integridade do Razão</p>
            <p className="text-[10px] font-bold text-white uppercase">Verificado 100%</p>
          </div>
        </div>
        <p className="font-label text-[10px] tracking-widest uppercase">Precision Detail Financial Core v1.4.2</p>
      </div>
    </div>
  );
}
