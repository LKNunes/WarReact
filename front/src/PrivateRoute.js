import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;  // Você pode trocar isso por um Spinner se quiser
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}
