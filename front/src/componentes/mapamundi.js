import React from 'react';
import { ReactComponent as WorldMap } from '../assets/Mundi3.svg';
import './mapamundi.css';

export default function MapaMundi() {
  const handleTerritoryClick = (id) => {
    console.log('Território clicado:', id);
    // Aqui você pode disparar uma ação, mudar o estado, etc.
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <WorldMap
        onClick={(e) => {
          if (e.target.id) handleTerritoryClick(e.target.id);
        }}
        className="hoverable-map"
      />
    </div>
  );
}
