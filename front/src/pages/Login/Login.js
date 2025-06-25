import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';  // <-- Importando o contexto

export default function Login() {
  const [modo, setModo] = useState('login'); // 'login' ou 'cadastro'
  const [form, setForm] = useState({ email: '', senha: '', nome_usuario: '' });
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();  // <-- Pegando a função login do contexto

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ email: '', senha: '', nome_usuario: '' });
    setMensagem('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    if (modo === 'login') {
      try {
        const res = await axios.post('http://localhost:3001/login', {
          email: form.email,
          senha: form.senha,
        });

        localStorage.setItem('usuarioNome', res.data.usuario.nome_usuario);
        localStorage.setItem('usuarioId', res.data.usuario.id);

        login();               // <-- Aqui: avisa o AuthContext que logou
        navigate('/lobby');    // Redireciona para o Lobby

      } catch (error) {
        setMensagem(error.response?.data?.erro || 'Erro ao logar');
      }
    } else {
      try {
         await axios.post('http://localhost:3001/cadastro', {
          nome_usuario: form.nome_usuario,
          email: form.email,
          senha: form.senha,
        });
        setMensagem('Cadastro realizado com sucesso! Faça login.');
        setModo('login');
        resetForm();
      } catch (error) {
        setMensagem(error.response?.data?.erro || 'Erro ao cadastrar');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">
        {modo === 'login' ? 'Login' : 'Cadastro'}
      </h2>

      {mensagem && <p className="mb-4 text-red-600">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {modo === 'cadastro' && (
          <input
            type="text"
            name="nome_usuario"
            placeholder="Nome de Usuário"
            value={form.nome_usuario}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {modo === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      <div className="mt-4 text-center">
        {modo === 'login' ? (
          <p>
            Não tem conta?{' '}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => {
                resetForm();
                setModo('cadastro');
              }}
            >
              Criar conta
            </button>
          </p>
        ) : (
          <p>
            Já tem conta?{' '}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => {
                resetForm();
                setModo('login');
                
              }}
            >
              Fazer login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
