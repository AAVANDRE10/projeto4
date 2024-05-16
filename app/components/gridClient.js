'use client'
import dynamic from 'next/dynamic';
import { useState } from 'react';
import ZoomControls from './ZoomControls';

// Importa dinamicamente o componente Grid para torná-lo um componente cliente
const Grid = dynamic(() => import('./grid'), { ssr: false });

export default function GridClient() {
  const [scale, setScale] = useState(1); // Estado para controlar a escala do grid

  const handleZoomIn = () => {
    setScale(prevScale => prevScale * 1.2); // Aumenta a escala em 20%
  };

  const handleZoomOut = () => {
    setScale(prevScale => prevScale / 1.2); // Diminui a escala em 20%
  };

  return (
    <div style={{ position: 'relative' }}>
      <Grid scale={scale} />
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
    </div>
  );
}