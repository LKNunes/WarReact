import React from 'react';
import { ReactComponent as WorldMap } from '../assets/Mundi3.svg';
import './mapamundi.css';

export default function MapaMundi() {
  const handleTerritoryClick = (id) => {
    console.log('Território clicado:', id);
  };

  return (
    <div className="absolute inset-2 flex items-center justify-center overflow-hidden">
      <WorldMap
        onClick={(e) => {
          if (e.target.id) handleTerritoryClick(e.target.id);
        }}
        className="w-full h-full hoverable-map"
      />
    </div>
  );
}
