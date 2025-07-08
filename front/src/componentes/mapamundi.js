import React, { useState } from "react";
import WorldMap from '../componentes/mapa.jsx';

//import { ReactComponent as WorldMap } from '../componentes/mapa.jsx';
// import { ReactComponent as WorldMapMar } from '../assets/Mundi3Mar.svg';

import './mapamundi.css';



export default function MapaMundi() {
  const handleTerritoryClick = (id, name) => {
    console.log('Território clicado:', id);
    console.log('Nome:', name);
  };

const [tropas, setTropas] = useState({
    "territorio-1": 5,
    "territorio-2": 3,
    "territorio-3": 7,
  });
  
  return (
    <div className="absolute inset-2 flex items-center justify-center overflow-hidden">

      {/* Se quiser exibir a camada do mar, descomente abaixo */}
      {/*
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <WorldMapMar className="w-full h-full" />
      </div>
      */}

      <div className="absolute inset-0 z-10 w-full h-full">
        <WorldMap
          className="w-full h-full hoverable-map"
          tropas={tropas} // ✅ Aqui está o segredo
        />
      </div>

    </div>
  );
}
