
import React from 'react';
import { Coordinate, FoodItems, LetterFood } from '../types';
import { GRID_SIZE, CELL_SIZE_PIXELS } from '../constants';

interface BoardProps {
  snake: Coordinate[];
  foodItems: FoodItems | null;
  isGameOver: boolean;
}

const Board: React.FC<BoardProps> = ({ snake, foodItems, isGameOver }) => {
  const cells = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isSnakeSegment = snake.some(segment => segment.x === x && segment.y === y);
      const isSnakeHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
      
      let isFoodLetter = false;
      let foodLetterChar: string | null = null;

      if (foodItems) {
        if (foodItems.correctLetter.position.x === x && foodItems.correctLetter.position.y === y) {
          isFoodLetter = true;
          foodLetterChar = foodItems.correctLetter.letter;
        } else {
          const dummy = foodItems.dummyLetters.find(d => d.position.x === x && d.position.y === y);
          if (dummy) {
            isFoodLetter = true;
            foodLetterChar = dummy.letter;
          }
        }
      }
      
      let cellClass = "border border-gray-700 flex items-center justify-center text-xs font-mono";
      let cellContent = null;

      if (isSnakeHead) {
        cellClass += isGameOver ? " bg-red-700" : " bg-green-600";
      } else if (isSnakeSegment) {
        cellClass += isGameOver ? " bg-red-500 opacity-70" : " bg-green-400";
      } else if (isFoodLetter && foodLetterChar) {
        // Unified style for all letters (correct or dummy)
        cellClass += " bg-purple-600 rounded-sm"; 
        cellContent = <span className="text-white font-bold">{foodLetterChar}</span>;
      } else {
         cellClass += " bg-gray-800";
      }
      
      cells.push(
        <div
          key={`${x}-${y}`}
          className={cellClass}
          style={{ width: `${CELL_SIZE_PIXELS}px`, height: `${CELL_SIZE_PIXELS}px` }}
        >
          {cellContent}
        </div>
      );
    }
  }

  return (
    <div
      className={`grid shadow-2xl border-2 border-gray-600 rounded-md ${isGameOver ? 'opacity-60' : ''}`}
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        width: `${GRID_SIZE * CELL_SIZE_PIXELS}px`,
        height: `${GRID_SIZE * CELL_SIZE_PIXELS}px`,
        backgroundColor: '#1F2937', // bg-gray-800
      }}
    >
      {cells}
    </div>
  );
};

export default Board;
