'use client';
import { useState } from 'react';

const Grid = ({ onWeightChange }) => {
  const [weights, setWeights] = useState(Array(25).fill(0));

  const handleSquareClick = (row, col) => {
    const index = (row - 1) * 5 + (col - 1);
    const newWeights = [...weights];
    const currentWeight = newWeights[index];

    newWeights[index] = currentWeight < 5 ? currentWeight + 1 : 1;

    setWeights(newWeights);

    // Certifique-se de que onWeightChange é uma função antes de chamá-la
    if (typeof onWeightChange === 'function') {
      onWeightChange(`(${row}, ${col})`, newWeights[index]);
    }
  };

  const rows = 5;
  const cols = 5;

  return (
    <div className="grid-container">
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: rows }).map((_, row) => (
          Array.from({ length: cols }).map((_, col) => {
            const index = row * cols + col;
            const weight = weights[index];

            return (
              <div
                key={index}
                className={`square weight-${weight} p-4 bg-gray-300`}
                onClick={() => handleSquareClick(row + 1, col + 1)}
              >
                {weight}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Grid;