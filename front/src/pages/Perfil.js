import DiceRoller from "../componentes/dado";


function Perfil() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Perfil</h1>
      <p>Informações do jogador.</p>
      <DiceRoller />
    </div>
  );
}

export default Perfil;
