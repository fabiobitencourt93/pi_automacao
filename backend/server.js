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

// Cria a rota para buscar os dados das máquinas
app.get('/api/machines', async (req, res) => {
  const { data, error } = await supabase
    .from('machines') // Certifique-se de que a tabela no Supabase tem exatamente este nome
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
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