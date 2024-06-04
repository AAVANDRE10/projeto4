import React, { useState, useEffect } from 'react';

const Grid = ({ scale }) => {
  const sizes = {
    pequeno: 5,
    medio: 50,
    grande: 100
  };

  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [weights, setWeights] = useState(Array(10000).fill(0));
  const [size, setSize] = useState(50);
  const [cellSize, setCellSize] = useState(0);
  const [matrix, setMatrix] = useState(generateMatrix(Array(10000).fill(0), 50));
  const [matrixActive, setMatrixActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState('medio');
  const [path, setPath] = useState([]);

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

    if (!startPoint) {
      setStartPoint([row, col]);
    } else {
      setEndPoint([row, col]);
    }

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
    console.log(startPoint);
    console.log(endPoint);

    if (startPoint && endPoint) {
      const caminhoEncontrado = findShortestPath(matrix, startPoint, endPoint);
      console.log("Caminho encontrado:", caminhoEncontrado);
      setPath(caminhoEncontrado);
    } else {
      console.error("Ponto inicial ou final não definido!");
    }
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

  const isPath = (row, col) => {
    return path.some(([pathRow, pathCol]) => pathRow === row && pathCol === col);
  };

  const gridSquares = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const weight = matrix ? (matrix[row] ? (matrix[row][col] || 0) : 0) : 0;
      const isPathCell = isPath(row, col);
      const squareStyle = {
        height: `${cellSize}px`,
        fontSize: `${cellSize / 3}px`,
        backgroundColor: isPathCell ? 'rgba(0, 0, 255, 0.5)' : 'rgba(255, 255, 255, 0.5)',
      };
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

function findShortestPath(matrix, start, end) {
  const n = matrix.length;
  const distances = Array.from({ length: n }, () => Array(n).fill(Number.MAX_SAFE_INTEGER));
  distances[start[0]][start[1]] = matrix[start[0]][start[1]];

  const previous = Array.from({ length: n }, () => Array(n).fill(null));
  const visited = Array.from({ length: n }, () => Array(n).fill(false));
  const queue = [[start[0], start[1]]];

  while (queue.length !== 0) {
    const [x, y] = queue.shift();
    visited[x][y] = true;

    const neighbors = getNeighbors(x, y, matrix);
    for (const [nx, ny] of neighbors) {
      const newDistance = distances[x][y] + matrix[nx][ny];
      if (newDistance < distances[nx][ny]) {
        distances[nx][ny] = newDistance;
        previous[nx][ny] = [x, y];
        queue.push([nx, ny]);
      }
    }
  }

  const shortestPath = [];
  let current = [end[0], end[1]];
  while (current[0] !== start[0] || current[1] !== start[1]) {
    shortestPath.push(current);
    current = previous[current[0]][current[1]];
  }
  shortestPath.push([start[0], start[1]]);
  shortestPath.reverse();

  if (distances[end[0]][end[1]] === Number.MAX_SAFE_INTEGER) {
    console.error("Não foi possível encontrar um caminho.");
    return [];
  }

  console.log("Peso total do caminho final:", distances[end[0]][end[1]]);
  console.log("Caminho mais curto, coordenadas:", shortestPath);
  return shortestPath;
}

function getNeighbors(x, y, matrix) {
  const neighbors = [];
  const directions = [[-1, 0], [0, -1], [1, 0], [0, 1]]; // cima, esquerda, baixo, direita

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < matrix.length && ny >= 0 && ny < matrix[0].length && matrix[nx][ny] > 0) {
      neighbors.push([nx, ny]);
    }
  }

  return neighbors;
}