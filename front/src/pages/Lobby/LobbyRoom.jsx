import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function LobbyRoom() {
  const { id } = useParams();
  const [lobby, setLobby] = useState(null);
  const [jogadores, setJogadores] = useState([]);
  const navigate = useNavigate();
  const jogadorId = localStorage.getItem('usuarioId');

  useEffect(() => {
    if (!jogadorId) {
      navigate('/login');
      return;
    }
    buscarLobby();
    buscarJogadores();
  }, [id, jogadorId, navigate]);

  const buscarLobby = async () => {
    try {
      const res = await axios.get('http://localhost:3001/lobbys');
      const lobbyEncontrado = res.data.find((l) => l.id == id);
      setLobby(lobbyEncontrado);
    } catch (error) {
      console.error('Erro ao buscar lobby:', error);
    }
  };

  const buscarJogadores = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/lobbys/${id}/jogadores`);
      setJogadores(res.data);
    } catch (error) {
      console.error('Erro ao buscar jogadores do lobby:', error);
    }
  };

  const sairDoLobby = async () => {
    try {
      await axios.post('http://localhost:3001/lobbys/sair', {
        jogador_id: jogadorId,
        lobby_id: id,
      });
      navigate('/lobby');
    } catch (error) {
      console.error('Erro ao sair do lobby:', error);
      alert('Erro ao sair do lobby');
    }
  };

  const CriarPartida = async () => {
    try {
      const res = await axios.post(`http://localhost:3001/partidas/${id}/criar`, {
        jogador_id: jogadorId,
        lobby_id: id,
      });

      const partidaId = res.data.partidaId;
      navigate(`/partida/${partidaId}`);
    } catch (error) {
      console.error('Erro ao criar partida:', error);
      alert('Erro ao criar partida');
    }
  };

  if (!lobby) return <p>Carregando lobby...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lobby: {lobby?.nome}</h1>

      <h2 className="text-xl font-semibold mb-2">Jogadores conectados:</h2>
      <ul className="mb-4">
        {jogadores.length === 0 ? (
          <li>Nenhum jogador conectado</li>
        ) : (
          jogadores.map((jogador) => (
            <li key={jogador.id}>{jogador.nome_usuario}</li>
          ))
        )}
      </ul>

      <button
        className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
        onClick={buscarJogadores}
      >
        Atualizar lista
      </button>

      <button
        className="bg-red-500 text-white px-4 py-2 mr-2 rounded"
        onClick={sairDoLobby}
      >
        Sair do Lobby
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={CriarPartida}
      >
        Criar Partida
      </button>
    </div>
  );
}
