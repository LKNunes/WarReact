import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


export default function PartidaRoom() {
  const { id } = useParams(); // id da partida
  const [partida, setPartida] = useState(null);
  const [jogadores, setJogadores] = useState([]);
  const navigate = useNavigate();
  const jogadorId = localStorage.getItem('usuarioId');

  useEffect(() => {
    buscarPartida();
    buscarJogadores();
  }, []);

  const buscarPartida = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/partidas/${id}`);
      setPartida(res.data);
    } catch (error) {
      console.error('Erro ao buscar partida:', error);
    }
  };

  const buscarJogadores = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/partidas/${id}/jogadores`);
      setJogadores(res.data);
    } catch (error) {
      console.error('Erro ao buscar jogadores da partida:', error);
    }
  };

  const sairDaPartida = async () => {
    try {
      await axios.post(`http://localhost:3001/partidas/sair`, {
        jogador_id: jogadorId,
        partida_id: id,
      });
      navigate('/lobby');
    } catch (error) {
      console.error('Erro ao sair da partida:', error);
      alert('Erro ao sair da partida');
    }
  };

  if (!partida) {
    return <div>Carregando partida...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Partida: {partida.nome || `#${partida.id}`}</h1>

      <h2 className="text-xl font-semibold mb-2">Jogadores na partida:</h2>
      <ul className="mb-4">
        {jogadores.length === 0 ? (
          <li>Nenhum jogador na partida</li>
        ) : (
          jogadores.map((jogador) => (
            <li key={jogador.id}>{jogador.nome_usuario}</li>
          ))
        )}
      </ul>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={sairDaPartida}
      >
        Sair da Partida
      </button>
    </div>
  );
}
