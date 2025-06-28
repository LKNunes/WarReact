const express = require('express');
const router = express.Router();
const db = require('../database/db');


// Listar todas as partidas
router.get('/', (req, res) => {
  db.query('SELECT * FROM partidas', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM partidas WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    if (results.length === 0) return res.status(404).json({ erro: 'Partida não encontrada' });
    res.json(results[0]);
  });
});


router.get('/:id/jogadores', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT j.id, j.nome_usuario 
    FROM jogadores j
    INNER JOIN partida_jogadores pj ON pj.jogador_id = j.id
    WHERE pj.partida_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// Sair da partida
router.post('/sair', (req, res) => {
  const { partida_id, jogador_id } = req.body;
  // Código para remover jogador do lobby
  const sql = 'DELETE FROM partida_jogadores WHERE partida_id = ? AND jogador_id = ?'; //Desativado
  db.query(sql, [partida_id, jogador_id], (err, result) => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ mensagem: 'Saiu da partida' });
  });
});


router.post('/:id/criar', (req, res) => {
  const lobbyId = parseInt(req.params.id);
  const jogadorId = req.body.jogador_id;

  if (!jogadorId || !lobbyId) {
    return res.status(400).json({ erro: 'Jogador ID e Lobby ID são obrigatórios' });
  }

  // Criar a partida com o ID igual ao do lobby
  const sqlCriarPartida = 'INSERT INTO partidas (id, lobby_id, jogador_inicial_id, criado_em) VALUES (?, ?, ?, NOW())';

  db.query(sqlCriarPartida, [lobbyId, lobbyId, jogadorId], (err) => {
    if (err) {
      console.error('Erro ao criar partida:', err);
      return res.status(500).json({ erro: 'Erro ao criar partida' });
    }

    // Fechar o lobby
    const sqlFecharLobby = 'UPDATE lobbys SET status = "fechado" WHERE id = ?';
    db.query(sqlFecharLobby, [lobbyId], (err2) => {
      if (err2) {
        console.error('Erro ao fechar o lobby:', err2);
        return res.status(500).json({ erro: 'Erro ao fechar o lobby' });
      }

      // Buscar jogadores do lobby
      const sqlBuscarJogadores = 'SELECT jogador_id FROM lobby_jogadores WHERE lobby_id = ?';
      db.query(sqlBuscarJogadores, [lobbyId], (err3, jogadores) => {
        if (err3) {
          console.error('Erro ao buscar jogadores do lobby:', err3);
          return res.status(500).json({ erro: 'Erro ao buscar jogadores do lobby' });
        }

        if (jogadores.length === 0) {
          return res.status(400).json({ erro: 'Lobby não possui jogadores' });
        }

        const valores = jogadores.map(j => [lobbyId, j.jogador_id]);
        const sqlInserirPartidaJogadores = 'INSERT INTO partida_jogadores (partida_id, jogador_id) VALUES ?';

        db.query(sqlInserirPartidaJogadores, [valores], (err4) => {
          if (err4) {
            console.error('Erro ao inserir jogadores na partida:', err4);
            return res.status(500).json({ erro: 'Erro ao inserir jogadores na partida' });
          }

          // Responder sucesso uma única vez após todos os passos concluídos
          res.status(201).json({
            mensagem: 'Partida criada, lobby fechado e jogadores inseridos com sucesso',
            partidaId: lobbyId,
          });
        });
      });
    });
  });
});


// Buscar partida de um lobby específico
router.get('/lobby/:lobbyId', (req, res) => {
  const lobbyId = req.params.lobbyId;

  const sql = 'SELECT id FROM partidas WHERE lobby_id = ? LIMIT 1';

  db.query(sql, [lobbyId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar partida por lobby:', err);
      return res.status(500).json({ erro: 'Erro ao buscar partida' });
    }

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Nenhuma partida encontrada para este lobby' });
    }

    const partidaId = results[0].id;  // <- Aqui ele pega o ID da partida

    res.json({
      partidaId: partidaId,
    });
  });
});



module.exports = router;
