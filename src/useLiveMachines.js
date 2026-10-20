import { useState, useEffect } from 'react';

export function useLiveMachines(refreshIntervalMs = 3000) {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        // Vai buscar os dados ao servidor que acabou de ligar
        const response = await fetch('http://localhost:3001/api/machines');
        
        if (!response.ok) {
          throw new Error('Falha ao comunicar com o servidor');
        }
        
        const data = await response.json();
        setMachines(data);
        setError(null);
      } catch (err) {
        console.error("Erro:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Faz a primeira busca imediatamente
    fetchMachines();

    // Mantém a busca num ciclo contínuo (tempo real)
    const interval = setInterval(fetchMachines, refreshIntervalMs);

    // Limpa o ciclo se fecharmos o ecrã
    return () => clearInterval(interval);
  }, [refreshIntervalMs]);

  return { machines, loading, error };
}