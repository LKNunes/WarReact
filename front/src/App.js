import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Lobby from './pages/Lobby/Lobby';
import Partida from './pages/Partida/Partida';
import Perfil from './pages/Perfil';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lobby" element={<Lobby />} />       {/* Aqui entra LobbyList e LobbyRoom */}
        <Route path="/lobby/:id" element={<Lobby />} />   {/* Room do lobby */}
        <Route path="/Partida/partida" element={<Partida />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;
