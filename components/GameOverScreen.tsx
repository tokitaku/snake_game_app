
import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="text-center p-6 bg-gray-800 rounded-lg shadow-xl mt-4">
      <h2 className="text-4xl font-bold mb-4 text-red-500">ゲームオーバー！</h2>
      <p className="text-2xl mb-6 text-gray-200">最終スコア: <span className="font-bold text-yellow-400">{score}</span></p>
      <button
        onClick={onRestart}
        className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        もう一度プレイ
      </button>
    </div>
  );
};

export default GameOverScreen;
