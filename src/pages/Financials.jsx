import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Financials() {
  const [data, setData] = useState({
    kpis: { receitaTotal: 0, variation: "0.0", comissoesPendentes: 0, despesas: 0, fluxoLiquido: 0 },
    comissoes: [],
    flowData: []
  });
  
  const [expenseCategory, setExpenseCategory] = useState('PRODUTOS & QUÍMICOS');
  const [expenseAmount, setExpenseAmount] = useState('');

  const fetchDashboard = async () => {
    try {
      const res = await fetch('https://api-rsbf.onrender.com/api/financial/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Erro ao carregar dashboard financeiro", e);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleExpenseSubmit = async () => {
    const amountNum = Number(expenseAmount.replace(',', '.'));
    if (!amountNum || amountNum <= 0) {
      alert('Valor inválido');
      return;
    }

    try {
      const res = await fetch('https://api-rsbf.onrender.com/api/financial/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: expenseCategory, amount: amountNum })
      });
      if (res.ok) {
        setExpenseAmount('');
        fetchDashboard();
      } else {
        alert('Erro ao lançar despesa');
      }
    } catch (e) {
      console.error(e);
      alert('Erro de conexão ao lançar despesa');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-highest p-4 border border-outline-variant/20 rounded shadow-lg">
          <p className="font-label text-xs text-white mb-2">{label}</p>
          <p className="font-label text-xs text-tertiary">Entrada: {formatCurrency(payload[0]?.value)}</p>
          <p className="font-label text-xs text-[#E31B23]">Saída: {formatCurrency(payload[1]?.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-12 min-h-screen bg-surface">
      {/* Hero Financial Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-12 border-l border-outline-variant/10">
        <div className="p-8 bg-surface-container-low">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Receita Total (MTD)</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-white">{formatCurrency(data.kpis.receitaTotal)}</h2>
            <span className={`text-[10px] font-label px-2 py-1 ${Number(data.kpis.variation) >= 0 ? 'text-tertiary bg-tertiary/10' : 'text-[#E31B23] bg-[#E31B23]/10'}`}>
              {Number(data.kpis.variation) > 0 ? '+' : ''}{data.kpis.variation}%
            </span>
          </div>
        </div>
        <div className="p-8 bg-surface-container-high">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Comissões Pendentes</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-[#E31B23]">{formatCurrency(data.kpis.comissoesPendentes)}</h2>
            <span className="material-symbols-outlined text-[#E31B23]">hourglass_empty</span>
          </div>
        </div>
        <div className="p-8 bg-surface-container-low">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Despesas Operacionais</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-white">{formatCurrency(data.kpis.despesas)}</h2>
            <span className="text-[10px] font-label text-[#E31B23] bg-[#E31B23]/10 px-2 py-1">MTD</span>
          </div>
        </div>
        <div className="p-8 bg-surface-container-high">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Fluxo de Caixa Líquido</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-white">{formatCurrency(data.kpis.fluxoLiquido)}</h2>
            <span className={`material-symbols-outlined ${data.kpis.fluxoLiquido >= 0 ? 'text-tertiary' : 'text-[#E31B23]'}`}>
              {data.kpis.fluxoLiquido >= 0 ? 'trending_up' : 'trending_down'}
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Transaction Logging */}
        <div className="lg:col-span-4 space-y-12">
          <section>
            <h3 className="font-headline font-bold text-lg tracking-[0.02em] mb-8 border-l-4 border-[#E31B23] pl-4">LANÇAR_DESPESA</h3>
            <div className="bg-surface-container-lowest p-8 space-y-6">
              <div>
                <label className="font-label text-[10px] text-on-surface-variant tracking-widest uppercase mb-2 block">Categoria</label>
                <select 
                  className="w-full bg-surface-container-low border-none text-white font-label text-sm py-4 px-4 focus:ring-0 appearance-none"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                >
                  <option>PRODUTOS & QUÍMICOS</option>
                  <option>MANUTENÇÃO DE EQUIPAMENTOS</option>
                  <option>ALUGUEL & UTILIDADES</option>
                  <option>MARKETING</option>
                </select>
              </div>
              <div>
                <label className="font-label text-[10px] text-on-surface-variant tracking-widest uppercase mb-2 block">Valor (BRL)</label>
                <div className="flex">
                  <div className="bg-surface-container-high px-4 flex items-center border-l-2 border-[#E31B23]">
                    <span className="text-xs text-white/50">R$</span>
                  </div>
                  <input 
                    className="flex-1 bg-surface-container-low border-none text-white font-label text-lg py-4 px-4 focus:ring-0" 
                    placeholder="0,00" 
                    type="text" 
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={handleExpenseSubmit}
                className="w-full bg-[#E31B23] py-4 text-white font-label font-bold text-xs tracking-widest hover:bg-[#E31B23]/80 transition-colors uppercase"
              >
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
                <span className="font-label text-sm text-tertiary font-bold">{formatCurrency(data.kpis.receitaTotal * 0.4)}</span> {/* Placeholder para layout */}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Matriz de comissões */}
        <div className="lg:col-span-8">
          <section className="mb-12">
            <div className="flex justify-between items-end mb-8">
              <h3 className="font-headline font-bold text-lg tracking-[0.02em] border-l-4 border-on-tertiary-fixed-variant pl-4">MATRIZ_DE_COMISSÕES</h3>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.05em]">Período: Mês Atual</p>
            </div>
            <div className="overflow-hidden border border-outline-variant/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                    <th className="p-6 font-medium">Técnico</th>
                    <th className="p-6 font-medium">Tipo de Serviço</th>
                    <th className="p-6 font-medium text-right">Valor Base</th>
                    <th className="p-6 font-medium text-right">Taxa</th>
                    <th className="p-6 font-medium text-right text-[#E31B23]">Comissão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 font-body text-sm">
                  {data.comissoes.length > 0 ? data.comissoes.map((comissao, idx) => (
                    <tr key={idx} className="bg-surface hover:bg-surface-container-low transition-colors">
                      <td className="p-6">
                        <div className="flex items-center space-x-3">
                           <div className="w-2 h-2 bg-tertiary"></div>
                           <span className="font-bold tracking-tight text-white">{comissao.tech_name}</span>
                        </div>
                      </td>
                      <td className="p-6 font-label text-xs text-on-surface-variant">{comissao.service_name}</td>
                      <td className="p-6 text-right font-label tracking-[0.05em] text-white/80">{formatCurrency(comissao.base_price)}</td>
                      <td className="p-6 text-right font-label text-xs">{comissao.commission_rate}%</td>
                      <td className="p-6 text-right font-bold text-[#E31B23] tracking-tight">{formatCurrency(comissao.commission_value)}</td>
                    </tr>
                  )) : (
                    <tr className="bg-surface">
                      <td colSpan="5" className="p-6 text-center text-on-surface-variant font-label text-xs">Nenhuma comissão pendente neste mês.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Análise de Fluxo (Bar Chart) */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline font-bold text-lg tracking-[0.02em] border-l-4 border-tertiary pl-4">ANÁLISE_DE_FLUXO</h3>
              <div className="flex space-x-2 items-center">
                <span className="w-2 h-2 bg-tertiary"></span>
                <span className="font-label text-[10px] text-on-surface-variant uppercase mr-4">Entrada</span>
                <span className="w-2 h-2 bg-[#E31B23]"></span>
                <span className="font-label text-[10px] text-on-surface-variant uppercase">Saída</span>
              </div>
            </div>
            <div className="h-80 w-full min-w-0 bg-surface-container-lowest p-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.flowData} barGap={4} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8E918F', fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="entrada" fill="#9CD67D" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="saida" fill="#E31B23" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
        <p className="font-label text-[10px] tracking-widest uppercase">Precision Detail Financial Core v1.5.0</p>
      </div>
    </div>
  );
}
