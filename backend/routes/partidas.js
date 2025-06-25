const express = require('express');
const router = express.Router();
const db = require('../database/db');



// Rota de teste (só pra ver se o módulo está carregando)
router.get('/', (req, res) => {
  res.send('Rota de partidas funcionando!');
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


// Rota para criar uma nova partida a partir de um lobby
router.post('/:id/criar', (req, res) => {
  const lobbyId = req.params.id;
  const jogadorId = req.body.jogador_id;

  if (!jogadorId || !lobbyId) {
    return res.status(400).json({ erro: 'Jogador ID e Lobby ID são obrigatórios' });
  }

  // 1) Criar partida
  const sqlCriarPartida = 'INSERT INTO partidas (lobby_id, jogador_inicial_id, criado_em) VALUES (?, ?, NOW())';

  db.query(sqlCriarPartida, [lobbyId, jogadorId], (err, result) => {
    if (err) {
      console.error('Erro ao criar partida:', err);
      return res.status(500).json({ erro: 'Erro ao criar partida' });
    }

    const partidaId = result.insertId;

    // 2) Buscar jogadores do lobby
    const sqlBuscarJogadores = 'SELECT jogador_id FROM lobby_jogadores WHERE lobby_id = ?';
    db.query(sqlBuscarJogadores, [lobbyId], (err2, jogadores) => {
      if (err2) {
        console.error('Erro ao buscar jogadores do lobby:', err2);
        return res.status(500).json({ erro: 'Erro ao buscar jogadores do lobby' });
      }

      if (jogadores.length === 0) {
        return res.status(400).json({ erro: 'Lobby não possui jogadores' });
      }

      // 3) Inserir jogadores na partida_jogadores
      const valores = jogadores.map(j => [partidaId, j.jogador_id]);
      const sqlInserirPartidaJogadores = 'INSERT INTO partida_jogadores (partida_id, jogador_id) VALUES ?';

      db.query(sqlInserirPartidaJogadores, [valores], (err3) => {
        if (err3) {
          console.error('Erro ao inserir jogadores na partida:', err3);
          return res.status(500).json({ erro: 'Erro ao inserir jogadores na partida' });
        }

        // 4) Retorna sucesso com ID da partida
        res.status(201).json({
          mensagem: 'Partida criada com sucesso',
          partidaId: partidaId,
        });
      });
    });
  });
});


module.exports = router;
