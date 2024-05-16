import React from 'react';

const ZoomControls = ({ onZoomIn, onZoomOut }) => {
  return (
    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 9999 }}>
      <button onClick={onZoomIn}>Zoom In</button>
      <button onClick={onZoomOut}>Zoom Out</button>
    </div>
  );
};

export default ZoomControls;