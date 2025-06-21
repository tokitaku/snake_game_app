
export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Coordinate {
  x: number;
  y: number;
}

export enum GameStatus {
  IDLE,
  PLAYING,
  GAME_OVER,
}

export interface LetterFood {
  letter: string;
  position: Coordinate;
}

export interface FoodItems {
  correctLetter: LetterFood;
  dummyLetters: LetterFood[];
}
