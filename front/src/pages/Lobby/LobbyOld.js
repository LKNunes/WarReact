import { useEffect, useState } from 'react';
import axios from 'axios';

function Lobby() {
  const [lobbys, setLobbys] = useState([]);
  const [novoLobby, setNovoLobby] = useState('');
  const [lobbyAtual, setLobbyAtual] = useState(null);
  const [jogadoresNoLobby, setJogadoresNoLobby] = useState([]);
const jogadorId = localStorage.getItem('usuarioId');
  
  useEffect(() => {
    buscarLobbys();
  }, []);

  useEffect(() => {
    if (lobbyAtual) {
      buscarJogadoresNoLobby(lobbyAtual.id);
    }
  }, [lobbyAtual]);

  const buscarLobbys = async () => {
    try {
      const res = await axios.get('http://localhost:3001/lobbys');
      setLobbys(res.data);
    } catch (error) {
      console.error('Erro ao buscar lobbys:', error);
    }
  };

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
      await axios.post('http://localhost:3001/lobbys/entrar', {
        lobby_id: lobbyId,
        jogador_id: jogadorId,
      });
      const lobbySelecionado = lobbys.find((l) => l.id === lobbyId);
      setLobbyAtual(lobbySelecionado);
    } catch (error) {
      console.error('Erro ao entrar no lobby:', error);
      alert('Erro ao entrar no lobby');
    }
  };

  const sairDoLobby = async () => {
    try {
      await axios.post('http://localhost:3001/lobbys/sair', {
        jogador_id: jogadorId,
        lobby_id: lobbyAtual.id,
      });
      setLobbyAtual(null);
      setJogadoresNoLobby([]);
      buscarLobbys();
    } catch (error) {
      console.error('Erro ao sair do lobby:', error);
      alert('Erro ao sair do lobby');
    }
  };

  const buscarJogadoresNoLobby = async (lobbyId) => {
    try {
      const res = await axios.get(`http://localhost:3001/lobbys/${lobbyId}/jogadores`);
      setJogadoresNoLobby(res.data);
    } catch (error) {
      console.error('Erro ao buscar jogadores do lobby:', error);
    }
  };

  // Tela do lobby atual
  if (lobbyAtual) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Lobby: {lobbyAtual.nome}</h1>

        <h2 className="text-xl font-semibold mb-2">Jogadores conectados:</h2>
        <ul className="mb-4">
          {jogadoresNoLobby.length === 0 ? (
            <li>Nenhum jogador conectado</li>
          ) : (
            jogadoresNoLobby.map((jogador) => (
              <li key={jogador.id}>{jogador.nome_usuario}</li>
            ))
          )}
        </ul>

        <button
          className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
          onClick={() => buscarJogadoresNoLobby(lobbyAtual.id)}
        >
          Atualizar lista
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={sairDoLobby}
        >
          Sair do Lobby
        </button>
      </div>
    );
  }

  // Tela padrão (lista de lobbys)
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

export default Lobby;
