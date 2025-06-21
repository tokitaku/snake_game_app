
import React from 'react';

interface WordProgressDisplayProps {
  word: string;
  lettersCollectedCount: number;
}

const WordProgressDisplay: React.FC<WordProgressDisplayProps> = ({ word, lettersCollectedCount }) => {
  if (!word) return null;

  return (
    <div className="text-center my-3 p-3 bg-gray-800 rounded-lg shadow-md w-full max-w-md">
      <p className="text-sm text-gray-400 mb-1 tracking-wider">現在の単語:</p>
      <div className="flex justify-center items-center space-x-1 flex-wrap">
        {word.split('').map((char, index) => (
          <span
            key={index}
            className={`text-2xl sm:text-3xl font-bold p-1 sm:p-2 m-0.5 rounded transition-colors duration-300 ease-in-out ${
              index < lettersCollectedCount
                ? 'text-purple-400 bg-purple-900 bg-opacity-70' // Collected letter
                : 'text-gray-600 bg-gray-700' // Pending letter
            }`}
            style={{ minWidth: '2rem', textAlign: 'center' }} // Ensure consistent sizing
          >
            {char.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordProgressDisplay;
