'use client'
import React, { useState, useEffect } from 'react';

const Grid = ({ onWeightChange }) => {
  const initialSize = 10;
  const initialWeights = Array(initialSize * initialSize).fill(0);
  const [weights, setWeights] = useState(initialWeights);
  const [size, setSize] = useState(initialSize);
  const [cellSize, setCellSize] = useState(0);
  const [matrix, setMatrix] = useState(generateMatrix(initialWeights, initialSize));
  const [zoomLevel, setZoomLevel] = useState(1);
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function calculateCellSize() {
      const windowWidth = window.innerWidth;
      const resolution = 0.4; // Porcentagem da resolução desejada
      const calculatedCellSize = Math.min(windowWidth * resolution / size, 100);
      setCellSize(calculatedCellSize);
    }

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);

    return () => window.removeEventListener('resize', calculateCellSize);
  }, [size]);

  useEffect(() => {
    setMatrix(generateMatrix(weights, size));
  }, [weights, size]);

  const handleSquareClick = (row, col) => {
    const index = (row - 1) * size + (col - 1);
    const newWeights = [...weights];
    const currentWeight = newWeights[index];
    newWeights[index] = currentWeight < 5 ? currentWeight + 1 : 1;
    setWeights(newWeights);
    if (typeof onWeightChange === 'function') {
      onWeightChange(`(${row}, ${col})`, newWeights[index]);
    }
  };

  const handleSliderChange = (event) => {
    const newSize = parseInt(event.target.value);
    setSize(newSize);
    setWeights(Array(newSize * newSize).fill(0));
  };

  const handleZoom = (direction) => {
    if (direction === 'in') {
      setZoomLevel(prevZoom => prevZoom + 0.1);
	    setSize(prevSize => prevSize + 1);
    } else {
      if (size > 1) {
        setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.1));
        setSize(prevSize => Math.max(prevSize - 1, 1));
      }
    }
  };

  const handleSaveChanges = () => {
    console.log("Matriz de pesos:", matrix);
  };

  const handleBackgroundClick = (event) => {
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;
    const offsetY = event.clientY - boundingRect.top;
    const x = (offsetX / boundingRect.width) * 100;
    const y = (offsetY / boundingRect.height) * 100;
    setBackgroundPosition({ x, y });
  };

  function generateMatrix(weights, size) {
    const newMatrix = [];
    for (let row = 0; row < size; row++) {
      const rowData = [];
      for (let col = 0; col < size; col++) {
        const index = row * size + col;
        rowData.push(weights ? (weights[index] || 0) : 0);
      }
      newMatrix.push(rowData);
    }
    return newMatrix;
  }

  const gridSquares = [];
  const squareStyle = {
    height: `${cellSize}px`,
    fontSize: `${cellSize / 3}px`,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // tornando os quadrados semi-transparentes
  };
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const weight = matrix ? (matrix[row] ? (matrix[row][col] || 0) : 0) : 0;
      gridSquares.push(
        <div
          key={`${row}-${col}`}
          className={`square bg-gray-300 border border-gray-400 flex items-center justify-center text-lg font-bold`}
          style={squareStyle}
          onClick={() => handleSquareClick(row + 1, col + 1)}
        >
          {weight}
        </div>
      );
    }
  }

  const backgroundImageStyle = {
    backgroundImage: 'url("assets/floor1.png")',
    backgroundSize: `${100 * zoomLevel}%`, // Aplique o zoom na imagem de fundo
    backgroundPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`, // Ajuste a posição da imagem de fundo
    backgroundRepeat: 'no-repeat'
  };

  return (
    <>
      <span className="ml-2">{size}x{size}</span>
      <div className="zoom-controls">
        <button onClick={() => handleZoom('in')}>Zoom In</button>
        <button onClick={() => handleZoom('out')}>Zoom Out</button>
      </div>
      <div className="grid-container" style={backgroundImageStyle} onClick={handleBackgroundClick}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {gridSquares}
        </div>
      </div>
      <button onClick={handleSaveChanges} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Salvar Alterações</button>
    </>
  );
};

export default Grid;