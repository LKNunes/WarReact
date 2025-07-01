import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAlert } from '../AlertContext';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';


export default function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    buscarPartidas();
  }, []);

  const handleVerPartida = (partidaId) => {
    navigate(`/partida/${partidaId}`);
  };

  const buscarPartidas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/partidas');
      setPartidas(res.data);
    } catch (error) {
      console.error('Erro ao buscar partidas:', error);
      showAlert('Erro ao carregar as partidas.', 'error');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2 ">Lista de Partidas</h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partidas.map((partida) => (
          <li
            key={partida.id}
            className="border p-3 rounded "
          >
            <strong>ID:</strong> {partida.id} <br />
            <strong>Lobby ID:</strong> {partida.lobby_id} <br />
            <strong>Status:</strong> {partida.status}

            <button
              onClick={() => handleVerPartida(partida.id)}
              className=" flex flex-wrap bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
            >
              Ver
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
}
