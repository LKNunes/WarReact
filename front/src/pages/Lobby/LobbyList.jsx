import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function LobbyList() {
  const [lobbys, setLobbys] = useState([]);
  const [novoLobby, setNovoLobby] = useState('');
  const navigate = useNavigate();
  const jogadorId = localStorage.getItem('usuarioId');

  useEffect(() => {
    buscarLobbys();
  }, []);

  const buscarLobbys = async () => {
    try {
      const res = await axios.get('http://localhost:3001/lobbys');
      setLobbys(res.data);
    } catch (error) {
      console.error('Erro ao buscar lobbys:', error);
    }
  };

async function verificarSeEstaNoLobby(lobbyId, jogadorId) {
  try {
    const response = await axios.get(`http://localhost:3001/lobbys/${lobbyId}/jogador/${jogadorId}`);
    console.log(response.data);

    if (response.data.presente) {
      alert('Jogador está no lobby');
    } else {
      alert('Jogador NÃO está no lobby');
    }
  } catch (error) {
    console.error('Erro ao verificar jogador no lobby:', error);
  }
}

  const criarLobby = async () => {
    if (!novoLobby.trim()) return;

    try {
       await axios.post('http://localhost:3001/lobbys/criar', {
        nome: novoLobby,
        dono_id: jogadorId,
      });
      setNovoLobby('');
      buscarLobbys();
    } catch (error) {
      console.error('Erro ao criar lobby:', error);
    }
  };

const entrarNoLobby = async (lobbyId) => {
  try {
    // 1) Verificar se o jogador já está no lobby
    const resposta = await axios.get(`http://localhost:3001/lobbys/${lobbyId}/jogador/${jogadorId}`);

    if (resposta.data.presente) {
      alert('Você já está neste lobby!');
      navigate(`/lobby/${lobbyId}`);
      return;
    }

    // 2) Se não estiver, envia o POST para entrar
    await axios.post('http://localhost:3001/lobbys/entrar', {
      lobby_id: lobbyId,
      jogador_id: jogadorId,
    });

    navigate(`/lobby/${lobbyId}`);
  } catch (error) {
    console.error('Erro ao entrar no lobby:', error);
    alert('Erro ao entrar no lobby');
  }
};


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lobbys</h1>

      <div className="flex mb-4 gap-2">
        <input
          className="border p-2"
          placeholder="Nome do lobby"
          value={novoLobby}
          onChange={(e) => setNovoLobby(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={criarLobby}
        >
          Criar Lobby
        </button>
      </div>

      <ul className="space-y-2">
        {lobbys.map((lobby) => (
          <li
            key={lobby.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <span>{lobby.nome}</span>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => entrarNoLobby(lobby.id)}
            >
              Entrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
