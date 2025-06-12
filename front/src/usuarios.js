import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const buscarUsuarios = () => {
    axios.get('http://localhost:3001/usuarios')
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error('Erro ao buscar usuários:', err));
  };

  useEffect(() => {
    buscarUsuarios();

    socket.on('usuarioCadastrado', () => {
      buscarUsuarios();
    });

    return () => {
      socket.off('usuarioCadastrado');
    };
  }, []);

  return (
    <div className="p-6 w-full max-w-lg rounded shadow overflow-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">Lista de Usuários</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nome</th>
            <th className="px-4 py-2 border">Criado em:</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="text-center">
              <td className="border px-4 py-2">{usuario.id}</td>
              <td className="border px-4 py-2">{usuario.nome_usuario}</td>
              <td className="border px-4 py-2">{new Date(usuario.criado_em).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;
