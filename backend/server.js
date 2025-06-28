const express = require('express');
const cors = require('cors');
const http = require('http');
const bcrypt = require('bcrypt');
const { Server } = require('socket.io');
require('dotenv').config();
const db = require('./database/db');

const app = express();

// 1) Ativa CORS e JSON antes das rotas
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const partidasRoutes = require('./routes/partidas');
app.use('/partidas', partidasRoutes);

const lobbyRoutes = require('./routes/Lobby');
app.use('/lobbys', lobbyRoutes);



const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// WebSocket conexão
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);
});

// Teste simples
app.get('/', (req, res) => {
  res.send('API rodando...');
});

// Buscar todos os jogadores
app.get('/usuarios', (req, res) => {
  db.query('SELECT id, nome_usuario, email, criado_em FROM jogadores', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

//cadastrar usuario
app.post('/cadastro', async (req, res) => {
  const { nome_usuario, email, senha } = req.body;

  if (!nome_usuario || !email || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 10);
    const sql = 'INSERT INTO jogadores (nome_usuario, email, senha_hash, criado_em) VALUES (?, ?, ?, NOW())';
    db.query(sql, [nome_usuario, email, senha_hash], (err, result) => {
      if (err) {
        console.log('Erro no banco:', err);
        return res.status(500).json({ erro: 'Erro ao cadastrar jogador' });
      }

      io.emit('usuarioCadastrado', {
        id: result.insertId,
        nome_usuario,
        email,
        criado_em: new Date().toISOString(),
      });

      res.status(201).json({ mensagem: 'Jogador cadastrado com sucesso', id: result.insertId });
    });
  } catch (error) {
    console.log('Erro ao processar senha:', error);
    res.status(500).json({ erro: 'Erro ao processar senha' });
  }
});


// Login de jogador
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  db.query('SELECT * FROM jogadores WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: err });

    if (results.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const usuario = results[0];
    const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaConfere) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }
    
    res.json({
      mensagem: 'Login bem-sucedido',
      usuario: {
        id: usuario.id,
        nome_usuario: usuario.nome_usuario,
        email: usuario.email,
        criado_em: usuario.criado_em,
      },
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
