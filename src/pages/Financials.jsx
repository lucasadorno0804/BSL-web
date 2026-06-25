import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ReactMarkdown from 'react-markdown';

export default function Financials() {
  const [data, setData] = useState({
    kpis: { receitaTotal: 0, variation: "0.0", comissoesPendentes: 0, despesas: 0, fluxoLiquido: 0 },
    comissoes: [],
    flowData: []
  });
  
  const [categories, setCategories] = useState([
    'PRODUTOS & QUÍMICOS',
    'MANUTENÇÃO DE EQUIPAMENTOS',
    'ALUGUEL & UTILIDADES',
    'MARKETING'
  ]);
  const [expenseCategory, setExpenseCategory] = useState('PRODUTOS & QUÍMICOS');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [period, setPeriod] = useState('this_month');

  // AI Module State
  const [aiReport, setAiReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`https://api-rsbf.onrender.com/api/financial/dashboard?period=${period}`);
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
  }, [period]);

  const handleDownloadReport = () => {
    window.open(`https://api-rsbf.onrender.com/api/financial/export?period=${period}`, '_blank');
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingReport(true);
    setAiReport('');
    try {
      const res = await fetch(`https://api-rsbf.onrender.com/api/financial/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period })
      });
      if (res.ok) {
        const json = await res.json();
        setAiReport(json.markdown);
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao gerar insights.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro de conexão ao comunicar com a IA');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleAddCategory = () => {
    const newCat = window.prompt("Digite o nome da nova categoria:");
    if (newCat && newCat.trim()) {
      const uppercaseCat = newCat.trim().toUpperCase();
      if (!categories.includes(uppercaseCat)) {
        setCategories([...categories, uppercaseCat]);
      }
      setExpenseCategory(uppercaseCat);
    }
  };

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

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta movimentação? Essa ação afetará o caixa.')) return;
    
    try {
      const res = await fetch(`https://api-rsbf.onrender.com/api/financial/transaction/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchDashboard();
      } else {
        const errorData = await res.json();
        alert(`Erro ao excluir: ${errorData.error || 'Desconhecido'}`);
      }
    } catch (e) {
      console.error(e);
      alert('Erro de conexão ao excluir movimentação');
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

  const periodLabels = {
    'this_week': 'Esta Semana',
    'last_week': 'Sem. Passada',
    'this_month': 'Este Mês',
    'this_year': 'Este Ano'
  };

  const periodAbbr = {
    'this_week': 'WTD',
    'last_week': 'L-WTD',
    'this_month': 'MTD',
    'this_year': 'YTD'
  };

  return (
    <div className="p-4 md:p-12 min-h-screen bg-surface">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">Financeiro</h1>
        <div className="flex items-center gap-4">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-surface-container-low border border-outline-variant/20 text-white font-label text-xs py-2 px-4 focus:ring-0 appearance-none rounded"
          >
            <option value="this_week">Esta Semana</option>
            <option value="last_week">Semana Anterior</option>
            <option value="this_month">Este Mês</option>
            <option value="this_year">Este Ano</option>
          </select>
          <button 
            onClick={handleDownloadReport}
            className="bg-surface-container-high border border-outline-variant/20 hover:bg-surface-container-highest transition-colors text-white font-label font-bold text-xs py-2 px-4 rounded flex items-center gap-2 uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Baixar Relatório
          </button>
        </div>
      </div>

      {/* Hero Financial Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mb-8 md:mb-12 border-l border-outline-variant/10">
        <div className="p-6 md:p-8 bg-surface-container-low border-b sm:border-b-0 sm:border-r border-outline-variant/10">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Receita Total ({periodAbbr[period]})</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-white">{formatCurrency(data.kpis.receitaTotal)}</h2>
            <span className={`text-[10px] font-label px-2 py-1 ${Number(data.kpis.variation) >= 0 ? 'text-tertiary bg-tertiary/10' : 'text-[#E31B23] bg-[#E31B23]/10'}`}>
              {Number(data.kpis.variation) > 0 ? '+' : ''}{data.kpis.variation}%
            </span>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-surface-container-high border-b lg:border-b-0 lg:border-r border-outline-variant/10">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Comissões Pendentes</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-[#E31B23]">{formatCurrency(data.kpis.comissoesPendentes)}</h2>
            <span className="material-symbols-outlined text-[#E31B23]">hourglass_empty</span>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-surface-container-low border-b sm:border-b-0 sm:border-r border-outline-variant/10">
          <p className="font-label text-[10px] text-on-surface-variant tracking-widest mb-4 uppercase">Despesas Operacionais</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight text-white">{formatCurrency(data.kpis.despesas)}</h2>
            <span className="text-[10px] font-label text-[#E31B23] bg-[#E31B23]/10 px-2 py-1">{periodAbbr[period]}</span>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-surface-container-high">
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
                <div className="flex justify-between items-center mb-2">
                  <label className="font-label text-[10px] text-on-surface-variant tracking-widest uppercase block">Categoria</label>
                  <button 
                    onClick={handleAddCategory} 
                    className="font-label text-[10px] text-[#3b82f6] hover:text-[#3b82f6]/80 uppercase tracking-widest transition-colors"
                  >
                    + Nova Categoria
                  </button>
                </div>
                <select 
                  className="w-full bg-surface-container-low border-none text-white font-label text-sm py-4 px-4 focus:ring-0 appearance-none"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
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

          {/* Histórico de Movimentações */}
          <section className="mt-12">
            <h3 className="font-headline font-bold text-lg tracking-[0.02em] mb-8 border-l-4 border-on-surface-variant pl-4">HISTÓRICO_DE_MOVIMENTAÇÕES</h3>
            <div className="bg-surface-container-lowest p-6 max-h-[500px] overflow-y-auto custom-scrollbar space-y-4">
              {data.transactions && data.transactions.length > 0 ? (
                data.transactions.map((t) => (
                  <div key={t.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-surface-container-low border border-outline-variant/10 hover:border-outline-variant/30 transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${t.transaction_type === 'RECEITA' ? 'bg-tertiary' : 'bg-[#E31B23]'}`}></span>
                        <p className="font-label text-xs tracking-widest uppercase text-on-surface-variant">
                          {new Date(t.created_at).toLocaleDateString('pt-BR')} - {t.transaction_type}
                        </p>
                      </div>
                      <p className="font-label font-bold text-white uppercase">
                        {t.transaction_type === 'RECEITA' ? t.service_name || 'Avulso' : t.payment_method || 'Despesa'}
                      </p>
                      {t.client_name && (
                        <p className="font-label text-[10px] text-on-surface-variant uppercase mt-1">{t.client_name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <p className={`font-headline font-bold ${t.transaction_type === 'RECEITA' ? 'text-tertiary' : 'text-[#E31B23]'}`}>
                        {formatCurrency(t.amount)}
                      </p>
                      <button 
                        onClick={() => handleDeleteTransaction(t.id)}
                        className="text-on-surface-variant hover:text-[#E31B23] transition-colors sm:opacity-0 sm:group-hover:opacity-100 p-2"
                        title="Excluir movimentação"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center opacity-50">
                  <span className="material-symbols-outlined text-3xl mb-2">receipt_long</span>
                  <p className="font-label text-xs uppercase tracking-widest">Nenhuma movimentação</p>
                </div>
              )}
            </div>
          </section>


        </div>

        {/* Right Column: Análise de Fluxo */}
        <div className="lg:col-span-8">
          {/* Análise de Fluxo (Bar Chart) */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4 sm:gap-0">
              <h3 className="font-headline font-bold text-lg tracking-[0.02em] border-l-4 border-tertiary pl-4">ANÁLISE_DE_FLUXO</h3>
              <div className="flex space-x-2 items-center">
                <span className="w-2 h-2 bg-tertiary"></span>
                <span className="font-label text-[10px] text-on-surface-variant uppercase mr-4">Entrada</span>
                <span className="w-2 h-2 bg-[#E31B23]"></span>
                <span className="font-label text-[10px] text-on-surface-variant uppercase">Saída</span>
              </div>
            </div>
            <div className="h-64 md:h-80 w-full min-w-0 bg-surface-container-lowest p-4 md:p-8">
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

          {/* AI Strategy Report Section */}
          <section className="mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
              <h3 className="font-headline font-bold text-lg tracking-[0.02em] border-l-4 border-[#3b82f6] pl-4 uppercase">Consultoria IA</h3>
              <button 
                onClick={handleGenerateInsights}
                disabled={isGeneratingReport}
                className="bg-surface-container-high border border-[#3b82f6]/30 hover:border-[#3b82f6]/70 transition-colors text-white font-label font-bold text-xs py-2 px-4 rounded flex items-center gap-2 uppercase tracking-widest disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px] text-[#3b82f6]">auto_awesome</span>
                Gerar Relatório Estratégico
              </button>
            </div>

            <div className="bg-surface-container-lowest p-6 md:p-8 min-h-[150px] flex flex-col justify-center border border-surface-container-highest/50">
              {isGeneratingReport ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="w-full max-w-md h-1 bg-surface-container-high overflow-hidden rounded">
                    <div className="h-full bg-[#3b82f6] animate-pulse shadow-[0_0_15px_#3b82f6] w-1/3 origin-left translate-x-full animate-[scanner_1.5s_ease-in-out_infinite_alternate]"></div>
                  </div>
                  <style>{`@keyframes scanner { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }`}</style>
                  <p className="font-label text-xs tracking-[0.2em] text-[#3b82f6] uppercase animate-pulse">Processando Modelos Financeiros...</p>
                </div>
              ) : aiReport ? (
                <div className="prose prose-invert prose-sm md:prose-base max-w-none 
                                prose-headings:font-headline prose-headings:tracking-tight 
                                prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h3:text-[#3b82f6] 
                                prose-p:font-label prose-p:text-on-surface/80 prose-p:leading-relaxed
                                prose-li:font-label prose-li:text-on-surface/80
                                prose-strong:text-white">
                  <ReactMarkdown>{aiReport}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 opacity-30">
                  <span className="material-symbols-outlined text-4xl mb-4 text-on-surface">analytics</span>
                  <p className="font-label text-xs tracking-widest uppercase text-center">Nenhum relatório gerado.<br/>Clique no botão acima para analisar o período atual com IA.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

       <div className="mt-8 md:mt-16 flex flex-col md:flex-row items-start md:items-center justify-between border-t border-outline-variant/10 pt-8 opacity-50 gap-6 md:gap-0">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-12">
          <div>
            <p className="font-label text-[10px] tracking-widest uppercase mb-1">Status do Banco de Dados</p>
            <p className="text-[10px] font-bold text-tertiary uppercase">Sincronizado // Cloud-Sec</p>
          </div>
          <div>
            <p className="font-label text-[10px] tracking-widest uppercase mb-1">Integridade do Razão</p>
            <p className="text-[10px] font-bold text-white uppercase">Verificado 100%</p>
          </div>
        </div>
        <p className="font-label text-[10px] tracking-widest uppercase">v1.5.0</p>
      </div>
    </div>
  );
}
