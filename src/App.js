import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // NOVO: Estado para controlar o filtro ativo na barra lateral
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');

  useEffect(() => {
    const carregarDados = () => {
      fetch('http://localhost:3001/api/machines')
        .then(resposta => {
          if (!resposta.ok) throw new Error("Falha na comunicação com o servidor");
          return resposta.json();
        })
        .then(dados => {
          setMachines(dados);
          setLoading(false);
        })
        .catch(erro => {
          console.error("Erro ao carregar:", erro);
          setError(erro.message);
          setLoading(false);
        });
    };

    carregarDados();
    const relogio = setInterval(carregarDados, 5000);
    return () => clearInterval(relogio);
  }, []);

  // NOVO: Função para classificar a máquina pelo nome
  const getCategoriaMaquina = (nome) => {
    const n = nome ? nome.toLowerCase() : '';
    if (n.includes('erosão') || n.includes('erosao')) return 'Erosão';
    if (n.includes('prensa')) return 'Prensa';
    // Identifica tornos (ex: Romi GL, Haas ST, etc)
    if (n.includes('gl') || n.includes('torno') || n.includes('st-')) return 'Torno';
    // O que sobrar consideramos Centro de Usinagem (Fresa)
    return 'CentroUsinagem';
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50 text-sky-700 font-bold">A inicializar sistema de telemetria...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-slate-50 text-red-600 font-bold">Erro de ligação: {error}</div>;

  // NOVO: Aplica o filtro antes de renderizar
  const maquinasFiltradas = machines.filter(machine => {
    if (filtroAtivo === 'Todas') return true;
    return getCategoriaMaquina(machine.name) === filtroAtivo;
  });

  return (
    <div className="bg-slate-50 font-body text-slate-800 min-h-screen selection:bg-sky-100 selection:text-sky-900 flex">
      
      {/* ================= BARRA LATERAL (FILTROS) ================= */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white z-50 flex flex-col justify-between border-r border-slate-200 shadow-sm hidden md:flex">
        <div className="flex flex-col">
          <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-200">
            <span className="material-symbols-outlined text-[32px] text-sky-600">precision_manufacturing</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-widest text-sky-700 uppercase font-headline">OmniTool</span>
              <span className="text-xs text-slate-500 font-medium tracking-tight">Telemetria Industrial</span>
            </div>
          </div>
          <div className="px-4 py-4">
            <div className="px-3 mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Filtrar Células</div>
            <nav className="space-y-1 flex flex-col">
              
              <button 
                onClick={() => setFiltroAtivo('Todas')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${filtroAtivo === 'Todas' ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs border border-sky-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${filtroAtivo === 'Todas' ? 'text-sky-600' : 'text-slate-400'}`}>dashboard</span>
                <span>Todas as Máquinas</span>
              </button>

              <button 
                onClick={() => setFiltroAtivo('CentroUsinagem')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${filtroAtivo === 'CentroUsinagem' ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs border border-sky-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${filtroAtivo === 'CentroUsinagem' ? 'text-sky-600' : 'text-slate-400'}`}>hardware</span>
                <span>Centros de Usinagem</span>
              </button>

              <button 
                onClick={() => setFiltroAtivo('Torno')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${filtroAtivo === 'Torno' ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs border border-sky-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${filtroAtivo === 'Torno' ? 'text-sky-600' : 'text-slate-400'}`}>laps</span>
                <span>Tornos CNC</span>
              </button>

              <button 
                onClick={() => setFiltroAtivo('Erosão')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${filtroAtivo === 'Erosão' ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs border border-sky-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${filtroAtivo === 'Erosão' ? 'text-sky-600' : 'text-slate-400'}`}>electric_bolt</span>
                <span>Erosão a Fio</span>
              </button>

              <button 
                onClick={() => setFiltroAtivo('Prensa')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${filtroAtivo === 'Prensa' ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs border border-sky-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${filtroAtivo === 'Prensa' ? 'text-sky-600' : 'text-slate-400'}`}>compress</span>
                <span>Estamparia (Prensa)</span>
              </button>

            </nav>
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-700 font-semibold">Rede CNC Mesh</span>
                <span className="text-[10px] text-emerald-600 font-medium font-mono">Servidor Online</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-sky-600 text-sm">sensors</span>
          </div>
        </div>
      </aside>

      {/* ================= ÁREA PRINCIPAL ================= */}
      <div className="md:pl-72 flex flex-col min-h-screen bg-slate-50 w-full">
        
        <header className="fixed top-0 md:left-72 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-sky-600 text-[18px]">schedule</span>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Escala Operacional</span>
                <span className="text-xs text-slate-700 font-medium">Turno Atual • Em Andamento</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors" type="button">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 pl-1">
              <div className="flex flex-col text-right leading-tight">
                <span className="text-xs font-bold text-slate-800 font-headline">Fábio Ribeiro</span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">Gestor de Produção</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-sky-200 shadow-xs">FR</div>
            </div>
          </div>
        </header>

        <main className="relative pt-28 w-full px-8 pb-12 bg-slate-50 flex-1">
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-700">// STATUS DE LINHA</span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Equipamentos em Tempo Real</h2>
            </div>
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-medium text-slate-700">Atualização a cada 60s</span>
            </span>
          </div>

          {/* LISTA DE MÁQUINAS FILTRADAS */}
          <div className="flex flex-col gap-4">
            {maquinasFiltradas.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-xs text-slate-500">
                Nenhuma máquina encontrada para este filtro.
              </div>
            ) : (
              maquinasFiltradas.map(machine => {
                const nomeStr = machine.name ? machine.name.toLowerCase() : '';
                const isErosao = nomeStr.includes('erosão') || nomeStr.includes('erosao');
                const isPrensa = nomeStr.includes('prensa');
                
                const emOperacao = machine.status === 'Usinando' || machine.status === 'Estampando';
                
                const borderColor = emOperacao ? 'border-sky-300' : 'border-slate-300';
                const dotColor = emOperacao ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400';
                const badgeBg = emOperacao ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-600';
                const typeLabel = isErosao ? 'Erosão a Fio' : isPrensa ? 'Estamparia' : (nomeStr.includes('gl') || nomeStr.includes('torno')) ? 'Torno CNC' : 'Centro de Usinagem';

                return (
                  <div key={machine.id} className={`bg-white rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs border ${borderColor} relative overflow-hidden group hover:shadow-md transition-all duration-300`}>
                    
                    {emOperacao && <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full blur-2xl pointer-events-none"></div>}
                    
                    {/* COLUNA 1: INFO E PROGRAMA */}
                    <div className="w-full lg:w-1/3 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-sky-700 font-bold">{typeLabel}</span>
                          <h3 className="text-base font-bold text-slate-900 leading-tight mt-0.5">{machine.name}</h3>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${badgeBg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                          {emOperacao ? 'EM OPERAÇÃO' : 'PARADA'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Programa Atual</span>
                        <span className="text-xs font-semibold text-slate-800 truncate block">{machine.current_program}</span>
                        <div className="flex justify-between items-center mt-2 text-[11px] font-mono text-slate-500">
                          <span>Contagem de Peças:</span>
                          <span className="font-bold text-sky-700 font-mono">{machine.part_count} UN</span>
                        </div>
                      </div>
                    </div>

                    {/* COLUNA 2: PARÂMETROS TEMPO REAL */}
                    <div className="w-full lg:w-1/3 grid grid-cols-2 gap-2 z-10">
                      {isErosao ? (
                        <>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                            <span className="text-[10px] text-slate-500 font-medium block">Tensão Elétrica</span>
                            <span className="text-sm font-bold font-mono text-slate-800 mt-0.5 block">{machine.voltage} <span className="text-[9px] font-normal text-slate-400">V</span></span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                            <span className="text-[10px] text-slate-500 font-medium block">Corrente</span>
                            <span className="text-sm font-bold font-mono text-slate-800 mt-0.5 block">{machine.current} <span className="text-[9px] font-normal text-slate-400">A</span></span>
                          </div>
                        </>
                      ) : isPrensa ? (
                        <>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                            <span className="text-[10px] text-slate-500 font-medium block">Força de Impacto</span>
                            <span className="text-sm font-bold font-mono text-slate-800 mt-0.5 block">{machine.tonnage} <span className="text-[9px] font-normal text-slate-400">TON</span></span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                            <span className="text-[10px] text-slate-500 font-medium block">Cadência</span>
                            <span className="text-sm font-bold font-mono text-slate-800 mt-0.5 block">{machine.strokes_per_min} <span className="text-[9px] font-normal text-slate-400">GPM</span></span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                            <span className="text-[10px] text-slate-500 font-medium block">Rotação Spindle</span>
                            <span className="text-sm font-bold font-mono text-slate-800 mt-0.5 block">{machine.spindle_speed} <span className="text-[9px] font-normal text-slate-400">RPM</span></span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                            <span className="text-[10px] text-slate-500 font-medium block">Carga / Avanço</span>
                            <span className="text-sm font-bold font-mono text-slate-800 mt-0.5 block">{machine.spindle_load}% <span className="text-[9px] font-normal text-slate-400">({machine.feed_rate} f)</span></span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* COLUNA 3: OEE E AÇÕES */}
                    <div className="w-full lg:w-1/3 flex flex-col justify-between h-full z-10">
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="text-slate-500 font-bold uppercase">OEE Global:</span>
                          <span className="font-mono text-sky-700 font-bold">{machine.oee}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${machine.oee}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="pt-4 mt-4 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[10px] font-mono text-slate-400 font-medium">Comando: {machine.controller}</span>
                        <button className="text-xs text-sky-700 font-bold hover:text-sky-800 hover:underline flex items-center gap-0.5" type="button">
                          Detalhes <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;