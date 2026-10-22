require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Permite que o seu React (rodando em outra porta) acesse este servidor
app.use(cors());
app.use(express.json());

// Inicializa a conexão com o Supabase usando as chaves do seu arquivo .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("ERRO: As chaves do Supabase não foram encontradas no arquivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Cria a rota para buscar os dados das máquinas e o seu estado em tempo real
app.get('/api/machines', async (req, res) => {
  console.log("👉 [1/3] Recebi um pedido do React para a rota /api/machines");

  try {
    const { data: machines, error: machinesError } = await supabase
      .from('machines')
      .select('*');

    if (machinesError) {
      console.error("❌ Erro ao buscar máquinas:", machinesError.message);
      return res.status(500).json({ error: machinesError.message });
    }

    // Proteção: Se a tabela estiver vazia ou nula
    if (!machines) {
      console.log("⚠️ Nenhuma máquina encontrada na tabela.");
      return res.json([]);
    }

    console.log(`✅ [2/3] Encontrei ${machines.length} máquinas. A juntar com a telemetria...`);

    // (Dentro da rota GET /api/machines, procure este bloco e substitua)
    // ...
    const machinesWithStatus = await Promise.all(machines.map(async (machine) => {
      const { data: logs, error: logsError } = await supabase
        .from('telemetry_logs')
        // ADICIONAMOS TODAS AS COLUNAS AQUI:
        .select('status, oee, current_program, part_count, spindle_load, feed_rate, spindle_speed, wire_tension, tonnage, strokes_per_min, active_alarms')
        .eq('machine_id', machine.id)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (logsError) console.error(`❌ Erro:`, logsError.message);

      const latest = logs && logs.length > 0 ? logs[0] : {};

      return {
        ...machine,
        status: latest.status || 'Desconectada',
        oee: latest.oee || 0,
        current_program: latest.current_program || '-',
        part_count: latest.part_count || 0,
        spindle_load: latest.spindle_load || 0,
        feed_rate: latest.feed_rate || 0,
        spindle_speed: latest.spindle_speed || 0,
        wire_tension: latest.wire_tension || 0,
        tonnage: latest.tonnage || 0,
        strokes_per_min: latest.strokes_per_min || 0,
        active_alarms: latest.active_alarms || [],
        voltage: latest.voltage || 0,
        current: latest.current || 0
      };
    }));
    // ...

    console.log("🚀 [3/3] Tudo pronto! A enviar dados completos para o React.");
    res.json(machinesWithStatus);

  } catch (erroGeral) {
    // Esta é a rede de segurança que apanha falhas silenciosas!
    console.error("💥 ERRO CRÍTICO NA ROTA:", erroGeral);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Define a porta e liga o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor da Ferramentaria rodando com sucesso na porta ${PORT}`);
});

// Rota POST: Recebe dados em tempo real do chão de fábrica (Node-RED)
app.post('/api/telemetry', async (req, res) => {
  // Pega nos dados que o Node-RED (ou simulador) enviou no corpo da requisição
  const telemetryData = req.body;

  // Grava diretamente na tabela telemetry_logs do Supabase
  const { data, error } = await supabase
    .from('telemetry_logs')
    .insert([telemetryData]);

  if (error) {
    console.error("Erro ao gravar telemetria:", error.message);
    return res.status(500).json({ error: "Falha ao gravar no banco de dados" });
  }

  // Devolve um 201 (Created) para confirmar que deu certo
  res.status(201).json({ message: "Dados de produção registados com sucesso!" });
});