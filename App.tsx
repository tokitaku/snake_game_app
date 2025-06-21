
import React, { useState, useEffect, useCallback } from 'react';
import { Direction, Coordinate, GameStatus, LetterFood, FoodItems } from './types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED, WORD_LIST, NUMBER_OF_DUMMY_FOODS } from './constants';
import Board from './components/Board';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import ScoreDisplay from './components/ScoreDisplay';
import WordProgressDisplay from './components/WordProgressDisplay';

const App: React.FC = () => {
  const [snake, setSnake] = useState<Coordinate[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItems | null>(null);
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  const [currentWord, setCurrentWord] = useState<string>(""); // Current target letter (A, B, ...)
  const [currentWordLetterIndex, setCurrentWordLetterIndex] = useState<number>(0); // Always 0 for single letter words
  const [masterWordListIndex, setMasterWordListIndex] = useState<number>(0); // Index for overall WORD_LIST

  const getRandomLetter = (exclude: string[] = []): string => {
    const वर्णमाला = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let letter: string;
    do {
      letter = वर्णमाला[Math.floor(Math.random() * वर्णमाला.length)];
    } while (exclude.includes(letter));
    return letter;
  };

  const placeFoodItems = useCallback((currentSnake: Coordinate[], word: string, letterIndex: number): void => {
    if (!word || letterIndex < 0 || letterIndex >= word.length) {
      setFoodItems(null);
      return;
    }

    const correctLetterChar = word[letterIndex];
    const occupiedCoordinates: Coordinate[] = [...currentSnake];
    
    let correctLetterPosition: Coordinate;
    do {
      correctLetterPosition = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (occupiedCoordinates.some(c => c.x === correctLetterPosition.x && c.y === correctLetterPosition.y));
    
    occupiedCoordinates.push(correctLetterPosition);

    const correctLetter: LetterFood = { letter: correctLetterChar, position: correctLetterPosition };
    const dummyLettersArray: LetterFood[] = [];
    const excludeForDummies = [correctLetterChar];

    for (let i = 0; i < NUMBER_OF_DUMMY_FOODS; i++) {
      const dummyChar = getRandomLetter(excludeForDummies);
      excludeForDummies.push(dummyChar);
      let dummyPosition: Coordinate;
      do {
        dummyPosition = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
      } while (occupiedCoordinates.some(c => c.x === dummyPosition.x && c.y === dummyPosition.y));
      occupiedCoordinates.push(dummyPosition);
      dummyLettersArray.push({ letter: dummyChar, position: dummyPosition });
    }
    
    setFoodItems({ correctLetter, dummyLetters: dummyLettersArray });

  }, []);
  
  const moveToNextWordInSequence = useCallback((currentSnake: Coordinate[]): void => {
    const nextMasterIndex = (masterWordListIndex + 1) % WORD_LIST.length;
    const newWord = WORD_LIST[nextMasterIndex];
    
    setCurrentWord(newWord);
    setCurrentWordLetterIndex(0); // For single letter words, this is always 0 for the target
    setMasterWordListIndex(nextMasterIndex);
    placeFoodItems(currentSnake, newWord, 0); // Food is the first (and only) letter
  }, [masterWordListIndex, placeFoodItems]);

  const initializeGame = useCallback(() => {
    const initialSnakeHead: Coordinate = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
    const initialSnake: Coordinate[] = [initialSnakeHead];
    setSnake(initialSnake);
    setDirection(Direction.RIGHT);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    
    const firstWordListIndex = 0;
    const firstWord = WORD_LIST[firstWordListIndex];
    setMasterWordListIndex(firstWordListIndex);
    setCurrentWord(firstWord);
    setCurrentWordLetterIndex(0);
    placeFoodItems(initialSnake, firstWord, 0); 
    
    setGameStatus(GameStatus.PLAYING);
  }, [placeFoodItems]);

  const advanceGameState = useCallback(() => {
    if (gameStatus !== GameStatus.PLAYING || !snake.length || !foodItems) return;

    const currentHead = snake[0];
    let newHead: Coordinate;

    switch (direction) {
      case Direction.UP:    newHead = { x: currentHead.x, y: currentHead.y - 1 }; break;
      case Direction.DOWN:  newHead = { x: currentHead.x, y: currentHead.y + 1 }; break;
      case Direction.LEFT:  newHead = { x: currentHead.x - 1, y: currentHead.y }; break;
      case Direction.RIGHT: newHead = { x: currentHead.x + 1, y: currentHead.y }; break;
      default: return; 
    }

    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      setGameStatus(GameStatus.GAME_OVER);
      return;
    }

    for (const segment of snake.slice(1)) { 
      if (segment.x === newHead.x && segment.y === newHead.y) {
        setGameStatus(GameStatus.GAME_OVER);
        return;
      }
    }
    
    const newSnakeSegments = [newHead, ...snake];

    for (const dummy of foodItems.dummyLetters) {
      if (newHead.x === dummy.position.x && newHead.y === dummy.position.y) {
        setGameStatus(GameStatus.GAME_OVER);
        return;
      }
    }

    if (newHead.x === foodItems.correctLetter.position.x && newHead.y === foodItems.correctLetter.position.y) {
      // Correct letter eaten (which is currentWord[0])
      setScore(prevScore => prevScore + 1);
      setSpeed(prevSpeed => Math.max(MIN_SPEED, prevSpeed - SPEED_INCREMENT));
      setSnake(newSnakeSegments); // Snake grows

      // Since words are single letters, collecting it means the "word" is complete.
      moveToNextWordInSequence(newSnakeSegments);
      
    } else {
      newSnakeSegments.pop(); // Did not eat anything, so move snake without growing
      setSnake(newSnakeSegments);
    }
  }, [snake, direction, foodItems, gameStatus, moveToNextWordInSequence]);


  useEffect(() => {
    if (gameStatus === GameStatus.PLAYING) {
      const timerId = setTimeout(advanceGameState, speed);
      return () => clearTimeout(timerId);
    }
  }, [gameStatus, speed, advanceGameState]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Start game from IDLE state (StartScreen) with Enter or Space key
    // Using `e.key === ' '` for space, and `e.key.toLowerCase() === 'spacebar'` for broader compatibility if needed.
    // The primary check for space should be `e.key === ' '`.
    if (gameStatus === GameStatus.IDLE && (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'spacebar')) {
       e.preventDefault(); 
       initializeGame();
       return;
    }
    // Restart game from GAME_OVER state with Enter or Space key
     if (gameStatus === GameStatus.GAME_OVER && (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'spacebar')) {
       e.preventDefault();
       initializeGame();
       return;
    }
    if (gameStatus !== GameStatus.PLAYING) return;

    let newPressedDirection: Direction | null = null;
    switch (e.key.toLowerCase()) { 
      case 'arrowup': case 'w': newPressedDirection = Direction.UP; break;
      case 'arrowdown': case 's': newPressedDirection = Direction.DOWN; break;
      case 'arrowleft': case 'a': newPressedDirection = Direction.LEFT; break;
      case 'arrowright': case 'd': newPressedDirection = Direction.RIGHT; break;
    }

    if (newPressedDirection !== null) {
      e.preventDefault(); // Prevent default browser action for arrow keys (scrolling)
      setDirection(prevDirection => {
        if ((prevDirection === Direction.UP && newPressedDirection === Direction.DOWN) ||
            (prevDirection === Direction.DOWN && newPressedDirection === Direction.UP) ||
            (prevDirection === Direction.LEFT && newPressedDirection === Direction.RIGHT) ||
            (prevDirection === Direction.RIGHT && newPressedDirection === Direction.LEFT)) {
          return prevDirection;
        }
        return newPressedDirection;
      });
    }
  }, [gameStatus, initializeGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 select-none max-w-lg mx-auto">
      <header className="mb-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight" style={{color: '#4ade80'}}> {/* green-400 */}
          ヘビ単語ゲーム
        </h1>
        <p className="text-xl text-gray-400">Snake Word Game</p>
      </header>

      {gameStatus === GameStatus.IDLE && <StartScreen onStart={initializeGame} />}
      
      {(gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.GAME_OVER) && (
        <>
          <WordProgressDisplay word={currentWord} lettersCollectedCount={currentWordLetterIndex} />
          <div className="my-3">
            <ScoreDisplay score={score} />
          </div>
        </>
      )}

      {(gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.GAME_OVER) && foodItems && snake.length > 0 && (
        <Board snake={snake} foodItems={foodItems} isGameOver={gameStatus === GameStatus.GAME_OVER} />
      )}
      
      {gameStatus === GameStatus.GAME_OVER && <GameOverScreen score={score} onRestart={initializeGame} />}

      {gameStatus !== GameStatus.IDLE && (
         <footer className="mt-6 text-center text-sm text-gray-500">
          <p>操作: 矢印キー または WASDキー</p>
          <p>目的: 表示される正しい文字を集めて単語を完成させよう！ダミー文字に注意！</p>
          {gameStatus === GameStatus.GAME_OVER && <p className="mt-1">エンターキー または スペースキーでリスタート</p>}
        </footer>
      )}
    </div>
  );
};

export default App;
