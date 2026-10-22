import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="mensagem">A carregar telemetria da ferramentaria...</div>;
  if (error) return <div className="mensagem erro">Erro de ligação: {error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Monitorização CNC - Ferramentaria</h1>
        <div className="status-servidor">🟢 Servidor Online</div>
      </header>
      
      <div className="machines-grid">
        {machines.map(machine => {
          const nomeStr = machine.name ? machine.name.toLowerCase() : '';
          const isErosao = nomeStr.includes('erosão') || nomeStr.includes('erosao');
          const isPrensa = nomeStr.includes('prensa');

          // Variável que verifica se a máquina está ativa (seja fresa ou prensa)
          const emOperacao = machine.status === 'Usinando' || machine.status === 'Estampando';

          return (
            <div 
              key={machine.id} 
              className="machine-card"
              style={{ 
                // Aplicamos a variável "emOperacao" para a borda ficar verde
                borderLeft: emOperacao ? '5px solid #28a745' : '5px solid #6c757d',
                padding: '15px', 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>{machine.name}</h2>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  // Aplicamos a variável "emOperacao" para as cores da etiqueta
                  backgroundColor: emOperacao ? '#d4edda' : '#e2e3e5',
                  color: emOperacao ? '#155724' : '#383d41',
                  fontWeight: 'bold'
                }}>
                  {/* Se estiver em operação, mostra 🟢 + o status real (Estampando/Usinando) */}
                  {emOperacao ? `🟢 ${machine.status}` : '⚪ Parada'}
                </span>
              </div>
              
              <hr style={{ margin: '15px 0' }}/>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9em' }}>
                <p><strong>OEE:</strong> {machine.oee}%</p>
                <p><strong>Peças:</strong> {machine.part_count}</p>
                <p><strong>Programa:</strong> {machine.current_program}</p>
                <p><strong>Comando:</strong> {machine.controller}</p>
              </div>
              
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Parâmetros em Tempo Real</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.95em' }}>
                  
                  {isErosao ? (
                    <>
                      <p style={{ margin: 0 }}>Tensão Elétrica: <strong>{machine.voltage || 55} V</strong></p>
                      <p style={{ margin: 0 }}>Corrente: <strong>{machine.current || 12} A</strong></p>
                      <p style={{ margin: 0 }}>Tensão Fio: <strong>{machine.wire_tension} g</strong></p>
                    </>
                  ) : isPrensa ? (
                    <>
                      <p style={{ margin: 0 }}>Força: <strong>{machine.tonnage} T</strong></p>
                      <p style={{ margin: 0 }}>Golpes: <strong>{machine.strokes_per_min} GPM</strong></p>
                    </>
                  ) : (
                    <>
                      <p style={{ margin: 0 }}>Rotação: <strong>{machine.spindle_speed} RPM</strong></p>
                      <p style={{ margin: 0 }}>Avanço: <strong>{machine.feed_rate} mm/min</strong></p>
                      <p style={{ margin: 0 }}>Carga Eixo: <strong>{machine.spindle_load}%</strong></p>
                    </>
                  )}
                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;