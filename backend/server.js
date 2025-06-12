const express = require('express');
const cors = require('cors');
const http = require('http');
const bcrypt = require('bcrypt');
const { Server } = require('socket.io');
require('dotenv').config();
const db = require('./database/db');

const app = express();
const server = http.createServer(app); // precisa disso para usar o socket
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// WebSocket conexão
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);
});

app.get('/', (req, res) => {
  res.send('API rodando...');
});

app.get('/usuarios', (req, res) => {
  db.query('SELECT id, nome_usuario, email, criado_em FROM jogadores', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

app.post('/jogadores', async (req, res) => {
  const { nome_usuario, email, senha } = req.body;

  if (!nome_usuario || !email || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 10);
    const sql = 'INSERT INTO jogadores (nome_usuario, email, senha_hash, criado_em) VALUES (?, ?, ?, NOW())';
    db.query(sql, [nome_usuario, email, senha_hash], (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao cadastrar jogador' });

      // Emite evento para todos os clientes
      io.emit('usuarioCadastrado', { id: result.insertId, nome_usuario, email });
      res.status(201).json({ mensagem: 'Jogador cadastrado com sucesso', id: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao processar senha' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
