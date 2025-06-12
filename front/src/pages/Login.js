import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aqui você pode validar o login
    navigate('/lobby');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input type="text" placeholder="Usuário" className="w-full p-2 border mb-4 rounded" />
        <input type="password" placeholder="Senha" className="w-full p-2 border mb-4 rounded" />
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Entrar
        </button>
      </div>
    </div>
  );
}

export default Login;
