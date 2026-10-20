import React from 'react';
import { useLiveMachines } from './useLiveMachines';
import './App.css';

function App() {
  // Puxa as máquinas diretamente do seu servidor Node.js (na porta 3001)
  const { machines, loading, error } = useLiveMachines(3000);

  if (loading) return <div className="mensagem">A carregar telemetria da ferramentaria...</div>;
  if (error) return <div className="mensagem erro">Erro de ligação: {error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Monitorização CNC - Ferramentaria</h1>
        <div className="status-servidor">🟢 Servidor Online</div>
      </header>
      
      <div className="machines-grid">
        {machines.map(machine => (
          <div key={machine.id} className="machine-card">
            <h2>{machine.name}</h2>
            <hr />
            <p><strong>Modelo:</strong> {machine.model}</p>
            <p><strong>Tipo:</strong> {machine.type}</p>
            <p><strong>Comando:</strong> {machine.controller}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;