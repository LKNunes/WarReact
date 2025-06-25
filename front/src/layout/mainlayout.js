import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';


export default function MainLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">War Online</h1>
        <nav className="space-x-4">
          <Link to="/lobby">Lobby</Link>
          <Link to="/perfil">Perfil</Link>
          <button onClick={handleLogout} className="hover:underline">
            logout
          </button>
        </nav>
      </header>

      <main className="flex-grow p-4">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white text-center p-2 text-sm">
        © 2025 War Online. Todos os direitos reservados.

      </footer>
    </div>
  );
}
