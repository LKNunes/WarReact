import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Alert from '@mui/material/Alert';


export default function MainLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-gray-100">
      <header className="bg-black bg-opacity-40 backdrop-blur-md shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold tracking-wide">War Online</h1>

        <nav className="space-x-6 font-semibold flex items-center">
          <Link
            to="/lobby"
            className="hover:text-pink-400 transition-colors duration-300"
          >
            Lobby
          </Link>
          <Link
            to="/perfil"
            className="hover:text-pink-400 transition-colors duration-300"
          >
            Perfil
          </Link>
          <Link
            to="/partidas"
            className="hover:text-pink-400 transition-colors duration-300"
          >
            Partidas
          </Link>

          <button
            onClick={handleLogout}
            className="ml-4 bg-pink-500 hover:bg-pink-600 transition-colors duration-300 rounded px-3 py-1 font-semibold shadow-lg"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="flex-grow p-6 ">
        <div className="bg-black bg-opacity-30 backdrop-blur rounded-lg shadow-lg p-6 min-h-[400px]">
          <Outlet />
        </div>
      </main>

      <footer className="bg-black bg-opacity-40 backdrop-blur-md p-3 text-center text-sm font-light tracking-wide">
        © 2025 War Online. Todos os direitos reservados.
      </footer>
    </div>
  );
}
