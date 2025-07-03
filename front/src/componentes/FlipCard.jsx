import React, { useState } from 'react';
import './FlipCard.css';

export default function FlipCard({ tituloFrente, textoFrente, tituloVerso, textoVerso }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card-container">
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <div>
              <h3>{tituloFrente}</h3>
              <p>{textoFrente}</p>
            </div>
          </div>
          <div className="flip-card-back">
            <div>
              <h3>{tituloVerso}</h3>
              <p>{textoVerso}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
