import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MapaMundi from '../../componentes/mapamundi';
import  Flipcard from '../../componentes/FlipCard.jsx'


export default function PartidaRoom() {
  const { id } = useParams();
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
    }
  };

  if (!partida) {
    return <div className="p-4">Carregando partida...</div>;
  }

  return (
    <div className="min-h-screen flex">

      {/* Sidebar Esquerda */}
      <div className="w-80 bg-black text-white p-4 overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Partida: #{partida.id}</h1>

        <h2 className="text-lg font-semibold mb-2">Jogadores:</h2>
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
          onClick={sairDaPartida}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full mb-6"
        >
          Sair da Partida
        </button>

        {/* Exemplo de espaço para Objetivo */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Objetivo:</h2>
                  <Flipcard
                  tituloFrente="Objetivo"
                  textoFrente="Cloque para revelar"
                  tituloVerso="Elimine"
                  textoVerso="O Azul!"
                />
        </div>

        {/* Exemplo de espaço para Cartas */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Cartas:</h2>
          <p>Aqui vai a lista de cartas...</p>
        </div>
      </div>

      {/* Mapa Mundi ocupando todo o resto da tela */}
      <div className="flex-grow relative bg-blue-200">
        <MapaMundi />
      </div>

    </div>
  );
}
