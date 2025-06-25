import { useParams } from 'react-router-dom';
import LobbyList from './LobbyList';
import LobbyRoom from './LobbyRoom';


export default function Lobby() {
  const { id } = useParams();

  // Se tiver ID na URL → está dentro de um lobby (Room)
  // Se não → está na lista de lobbys
  return id ? <LobbyRoom /> : <LobbyList />;
}
