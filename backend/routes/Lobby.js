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

module.exports = router;
