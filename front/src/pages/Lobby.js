import { useEffect, useState } from 'react';
import axios from 'axios';

function Lobby() {
  const [lobbys, setLobbys] = useState([]);
  const [novoLobby, setNovoLobby] = useState('');

  useEffect(() => {
    buscarLobbys();
  }, []);

  const buscarLobbys = async () => {
    const res = await axios.get('http://localhost:3001/lobbys');
    setLobbys(res.data);
  };

  const criarLobby = async () => {
    if (!novoLobby.trim()) return;
    await axios.post('http://localhost:3001/lobbys/criar', {
      nome: novoLobby,
      dono_id: 1 // Substitua pelo ID do usuário logado
    });
    setNovoLobby('');
    buscarLobbys();
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
        <button className="bg-blue-500 text-white px-4 py-2" onClick={criarLobby}>
          Criar Lobby
        </button>
      </div>

      <ul className="space-y-2">
        {lobbys.map((lobby) => (
          <li key={lobby.id} className="border p-3 rounded flex justify-between">
            <span>{lobby.nome}</span>
            <button className="bg-green-500 text-white px-3 py-1 rounded">Entrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;
