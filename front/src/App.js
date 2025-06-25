import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Lobby from './pages/Lobby/Lobby';
import Partida from './pages/Partida/Partida';
import Perfil from './pages/Perfil';
import MainLayout from './layout/mainlayout';
import PrivateRoute from './PrivateRoute';

import './App.css';

function App() {
  return (
    <Routes>

      {/* Rota pública: Login */}
      <Route path="/" element={<Login />} />

      {/* Rotas protegidas com Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="lobby" element={<Lobby />} />
        <Route path="lobby/:id" element={<Lobby />} />
        <Route path="/partida/" element={<Partida />} />
        <Route path="/partida/:id" element={<Partida />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

    </Routes>
  );
}

export default App;
