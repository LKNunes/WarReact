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

// Verificar status do lobby (se está fechado ou aberto)
router.get('/:lobbyId/status', (req, res) => {
  const lobbyId = req.params.lobbyId;

  const sql = 'SELECT status FROM lobbys WHERE id = ?';
  db.query(sql, [lobbyId], (err, results) => {
    if (err) return res.status(500).json({ erro: err });

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Lobby não encontrado' });
    }

    res.json({ status: results[0].status });
  });
});


router.post('/entrar', (req, res) => {
  const { lobby_id, jogador_id } = req.body;

  if (!lobby_id || !jogador_id) {
    return res.status(400).json({ erro: 'Campos obrigatórios' });
  }

  // 1) Primeiro consultar o status do lobby
  const sqlStatus = 'SELECT fechado FROM lobbys WHERE id = ?';
  db.query(sqlStatus, [lobby_id], (err, result) => {
    if (err) {
      console.error('Erro ao verificar status do lobby:', err);
      return res.status(500).json({ erro: 'Erro ao verificar status do lobby' });
    }

    if (result.length === 0) {
      return res.status(404).json({ erro: 'Lobby não encontrado' });
    }

    const status = result[0].status;
    console.log("teste");
    // 2) Se lobby estiver FECHADO, envia direto pra partida
    if (status === 'fechado') {
      // Verificar se a partida já existe para esse lobby
      const sqlBuscarPartida = 'SELECT id FROM partidas WHERE lobby_id = ? LIMIT 1';
      db.query(sqlBuscarPartida, [lobby_id], (err2, partidaResult) => {
        if (err2) {
          console.error('Erro ao buscar partida:', err2);
          return res.status(500).json({ erro: 'Erro ao buscar partida' });
        }

        if (partidaResult.length === 0) {
          return res.status(404).json({ erro: 'Partida para o lobby não encontrada' });
        }

        const partidaId = partidaResult[0].id;

        // Adiciona o jogador na partida_jogadores
        const sqlEntrarPartida = 'INSERT INTO partida_jogadores (partida_id, jogador_id) VALUES (?, ?)';
        db.query(sqlEntrarPartida, [partidaId, jogador_id], (err3) => {
          if (err3) {
            console.error('Erro ao adicionar jogador na partida:', err3);
            return res.status(500).json({ erro: 'Erro ao adicionar jogador na partida' });
          }

          return res.status(200).json({ mensagem: 'Jogador enviado diretamente para a partida', partidaId });
        });
      });
    } else {
      // 3) Se lobby estiver ABERTO, segue o fluxo normal de adicionar no lobby
      const sqlEntrarLobby = 'INSERT INTO lobby_jogadores (lobby_id, jogador_id) VALUES (?, ?)';
      db.query(sqlEntrarLobby, [lobby_id, jogador_id], (err4) => {
        if (err4) {
          console.error('Erro ao entrar no lobby:', err4);
          return res.status(500).json({ erro: 'Erro ao entrar no lobby' });
        }
        res.status(200).json({ mensagem: 'Entrou no lobby com sucesso' });
      });
    }
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

router.get('/lobby/:lobbyId', (req, res) => {
  const lobbyId = req.params.lobbyId;

  const sql = 'SELECT id AS partidaId FROM partidas WHERE lobby_id = ? LIMIT 1';
  db.query(sql, [lobbyId], (err, results) => {
    if (err) return res.status(500).json({ erro: err });

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Nenhuma partida encontrada para este lobby' });
    }

    res.json({ partidaId: results[0].partidaId });
  });
});


module.exports = router;
