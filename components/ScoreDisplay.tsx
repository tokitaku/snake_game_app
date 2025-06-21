
import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="text-2xl font-semibold text-yellow-400 bg-gray-800 px-6 py-3 rounded-lg shadow-md">
      スコア: <span className="font-bold">{score}</span>
    </div>
  );
};

export default ScoreDisplay;
    