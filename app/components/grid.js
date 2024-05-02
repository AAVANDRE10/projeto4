import React, { useState, useEffect } from 'react';

const Grid = ({ scale }) => {
  const sizes = {
    pequeno: 25,
    médio: 50,
    grande: 100
  };

  const [weights, setWeights] = useState(Array(10000).fill(0));
  const [size, setSize] = useState(100);
  const [cellSize, setCellSize] = useState(0);
  const [matrix, setMatrix] = useState(generateMatrix(Array(10000).fill(0), 100));
  const [matrixActive, setMatrixActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState('médio');

  useEffect(() => {
    function calculateCellSize() {
      const windowWidth = window.innerWidth;
      const resolution = 0.4;
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
    if (!matrixActive) return;
    const index = row * size + col;
    const newWeights = [...weights];
    const currentWeight = newWeights[index];
    newWeights[index] = currentWeight < 5 ? currentWeight + 1 : 1;
    setWeights(newWeights);
    setZoomOrigin({ x: col, y: row });
  };

  const handleToggleMatrix = () => {
    setMatrixActive(prevActive => !prevActive);
  };

  const handleSaveChanges = () => {
    console.log("Matriz de pesos:", matrix);
  };

  const handleSizeChange = (event) => {
    const newSize = sizes[event.target.value];
    setSize(newSize);
    setSelectedSize(event.target.value);
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  };
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const weight = matrix ? (matrix[row] ? (matrix[row][col] || 0) : 0) : 0;
      gridSquares.push(
        <div
          key={`${row}-${col}`}
          className={`square bg-gray-300 border border-gray-400 flex items-center justify-center text-lg font-bold`}
          style={squareStyle}
          onClick={() => handleSquareClick(row, col)}
        >
          {weight}
        </div>
      );
    }
  }

  const gridContainerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: `${zoomOrigin.x * cellSize}px ${zoomOrigin.y * cellSize}px`,
  };

  const backgroundImageStyle = {
    backgroundImage: 'url("assets/floor1.png")',
    backgroundSize: `100%`,
    backgroundRepeat: 'no-repeat'
  };

  return (
    <>
      <label>
        Escolha o tamanho da matriz:
        <select value={selectedSize} onChange={handleSizeChange}>
          {Object.entries(sizes).map(([key, value]) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </label>
      <span className="ml-2">{size}x{size}</span> 
      <div className="grid-container" style={{ ...gridContainerStyle, ...backgroundImageStyle }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {gridSquares}
        </div>
      </div>
      <button onClick={handleSaveChanges} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Salvar Alterações</button>
      <button onClick={handleToggleMatrix} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        {matrixActive ? 'Desativar Matriz' : 'Ativar Matriz'}
      </button>
    </>
  );
};

export default Grid;