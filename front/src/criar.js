import { useState } from 'react';
import axios from 'axios';

function Criar({ onCadastrado }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/jogadores', {
        nome_usuario: nome,
        email,
        senha,
      });
      setSucesso('Jogador cadastrado com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
      if (onCadastrado) onCadastrado(); // AVISA O PAI PARA ATUALIZAR LISTA
    } catch (error) {
      setErro('Erro ao cadastrar jogador.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 w-full max-w-sm rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-black">Cadastrar Jogador</h2>

      {erro && <p className="text-red-600 mb-2">{erro}</p>}
      {sucesso && <p className="text-green-600 mb-2">{sucesso}</p>}

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}

export default Criar;
