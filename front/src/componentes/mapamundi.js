import React from 'react';
import { ReactComponent as WorldMap } from '../assets/Mundi3.svg';
//import { ReactComponent as WorldMapMar } from '../assets/Mundi3Mar.svg';


import './mapamundi.css';

export default function MapaMundi() {
  const handleTerritoryClick = (id,name) => {
    console.log('Território clicado:', id);
        console.log('Nome:',name);

  };

  return (
<div className="absolute inset-2 flex items-center justify-center overflow-hidden">
  
  {//  <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
     // <WorldMapMar className="w-full h-full" />
    //</div>
    }

  <div className="absolute inset-0 z-10 w-full h-full">
    <WorldMap
      onClick={(e) => {
        if (e.target.id) handleTerritoryClick(e.target.id, e.target.getAttribute('data-name'));
      }}
      className="w-full h-full hoverable-map"
    />
  </div>
</div>


  );
}
