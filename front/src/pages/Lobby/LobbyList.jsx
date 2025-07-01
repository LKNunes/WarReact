import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../AlertContext';

export default function LobbyList() {
  const [lobbys, setLobbys] = useState([]);
  const [novoLobby, setNovoLobby] = useState('');
  const navigate = useNavigate();
  const jogadorId = localStorage.getItem('usuarioId');
  const { showAlert } = useAlert();

  useEffect(() => {
    buscarLobbys();
  }, []);

  const buscarLobbys = async () => {
    try {
      const res = await axios.get('http://localhost:3001/lobbys');
      setLobbys(res.data);
    } catch (error) {
      console.error('Erro ao buscar lobbys:', error);
      showAlert('Erro ao buscar lobbys.', 'error');
    }
  };

  async function verificarSeEstaNoLobby(lobbyId, jogadorId) {
    try {
      const response = await axios.get(`http://localhost:3001/lobbys/${lobbyId}/jogador/${jogadorId}`);
      console.log(response.data);

      if (response.data.presente) {
        showAlert('Jogador está no lobby', 'info');
      } else {
        showAlert('Jogador NÃO está no lobby', 'warning');
      }
    } catch (error) {
      console.error('Erro ao verificar jogador no lobby:', error);
      showAlert('Erro ao verificar jogador no lobby.', 'error');
    }
  }

  const criarLobby = async () => {
    if (!novoLobby.trim()) {
      showAlert('Digite um nome para o lobby.', 'warning');
      return;
    }

    try {
      await axios.post('http://localhost:3001/lobbys/criar', {
        nome: novoLobby,
        dono_id: jogadorId,
      });
      setNovoLobby('');
      showAlert('Lobby criado com sucesso!', 'success');
      buscarLobbys();
    } catch (error) {
      console.error('Erro ao criar lobby:', error);
      showAlert('Erro ao criar lobby.', 'error');
    }
  };

  const entrarNoLobby = async (lobbyId) => {
    try {
      // 1) Verificar o status do lobby
      const statusResponse = await axios.get(`http://localhost:3001/lobbys/${lobbyId}/status`);
      const status = statusResponse.data.status;

      if (status === 'fechado') {
        const partidaResponse = await axios.get(`http://localhost:3001/partidas/lobby/${lobbyId}`);
        const partidaId = partidaResponse.data.partidaId;

        showAlert('O lobby já está fechado. Você será redirecionado para a partida.', 'warning');
        setTimeout(() => navigate(`/partida/${partidaId}`), 2000);
        return;
      }

      // 2) Se o lobby ainda estiver aberto, verificar se o jogador já está no lobby
      const resposta = await axios.get(`http://localhost:3001/lobbys/${lobbyId}/jogador/${jogadorId}`);

      if (resposta.data.presente) {
        showAlert('Você já está neste lobby!', 'info');
        setTimeout(() => navigate(`/lobby/${lobbyId}`), 2000);
        return;
      }

      // 3) Se não estiver, enviar o POST para entrar no lobby
      await axios.post('http://localhost:3001/lobbys/entrar', {
        lobby_id: lobbyId,
        jogador_id: jogadorId,
      });

      showAlert('Entrando no lobby...', 'success');
      setTimeout(() => navigate(`/lobby/${lobbyId}`), 1500);
    } catch (error) {
      console.error('Erro ao entrar no lobby:', error);
      showAlert('Erro ao tentar entrar no lobby.', 'error');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lobbys</h1>

      <div className="flex mb-4 gap-2">
        <input
          className="border p-2 text-black"
          placeholder="Nome do lobby"
          value={novoLobby}
          onChange={(e) => setNovoLobby(e.target.value)}
        />
        <button
          className="bg-blue-500 text-black px-4 py-2"
          onClick={criarLobby}
        >
          Criar Lobby
        </button>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
