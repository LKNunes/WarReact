const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar lobbys
router.get('/', (req, res) => {
  db.query('SELECT * FROM lobbys', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// Criar lobby
router.post('/criar', (req, res) => {
  const { nome, dono_id } = req.body;
  if (!nome || !dono_id) return res.status(400).json({ erro: 'Campos obrigatórios' });

  db.query('INSERT INTO lobbys (nome, dono_id) VALUES (?, ?)', [nome, dono_id], (err, result) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ mensagem: 'Lobby criado', id: result.insertId });
  });
});

router.post('/entrar', (req, res) => {
  const { lobby_id, jogador_id } = req.body;

  if (!lobby_id || !jogador_id) {
    return res.status(400).json({ erro: 'Campos obrigatórios' });
  }

  const sql = 'INSERT INTO lobby_jogadores (lobby_id, jogador_id) VALUES (?, ?)';

  db.query(sql, [lobby_id, jogador_id], (err, result) => {
    if (err) {
      console.error('Erro ao entrar no lobby:', err);
      return res.status(500).json({ erro: 'Erro ao entrar no lobby' });
    }
    res.status(200).json({ mensagem: 'Entrou no lobby com sucesso' });
  });
});


// Verificar se o jogador já está no lobby
router.get('/:lobbyId/jogador/:jogadorId', (req, res) => {
  const { lobbyId, jogadorId } = req.params;

  const sql = `
    SELECT * FROM lobby_jogadores
    WHERE lobby_id = ? AND jogador_id = ?
  `;

  db.query(sql, [lobbyId, jogadorId], (err, results) => {
    if (err) {
      console.error('Erro ao verificar jogador no lobby:', err);
      return res.status(500).json({ erro: 'Erro no servidor' });
    }

    const presente = results.length > 0;
    res.json({ presente });
  });
});

const entrarNoLobby = async (lobbyId, jogadorId) => {
  try {
    await axios.post('http://localhost:3001/lobbys/entrar', {
      lobby_id: lobbyId,
      jogador_id: jogadorId
    });
    alert('Você entrou no lobby!');
    // Aqui pode atualizar a lista, redirecionar, etc
  } catch (error) {
    console.error('Erro ao entrar no lobby:', error);
    alert('Falha ao entrar no lobby.');
  }
};

// Exemplo simples de rota para buscar jogadores no lobby
router.get('/:lobbyId/jogadores', (req, res) => {
  const lobbyId = req.params.lobbyId;

  const sql = `
    SELECT j.id, j.nome_usuario
    FROM jogadores j
    JOIN lobby_jogadores lj ON j.id = lj.jogador_id
    WHERE lj.lobby_id = ?
  `;

  db.query(sql, [lobbyId], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

router.post('/entrar', (req, res) => {
  const { lobby_id, jogador_id } = req.body;
  // Aqui, implemente o código para adicionar jogador ao lobby no banco
  // Exemplo fictício:
  const sql = 'INSERT INTO lobby_jogadores (lobby_id, jogador_id) VALUES (?, ?)';
  db.query(sql, [lobby_id, jogador_id], (err, result) => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ mensagem: 'Entrou no lobby' });
  });
});

// Sair do lobby
router.post('/sair', (req, res) => {
  const { lobby_id, jogador_id } = req.body;
  // Código para remover jogador do lobby
  const sql = 'DELETE FROM lobby_jogadores WHERE lobby_id = ? AND jogador_id = ?';
  db.query(sql, [lobby_id, jogador_id], (err, result) => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ mensagem: 'Saiu do lobby' });
  });
});

module.exports = router;
