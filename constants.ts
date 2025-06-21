
export const GRID_SIZE = 12; // Number of cells in width/height
export const CELL_SIZE_PIXELS = 24; // Corresponds to w-6, h-6 in Tailwind (1.5rem)
export const INITIAL_SPEED = 200; // Milliseconds per move
export const SPEED_INCREMENT = 10; // Milliseconds faster per food item
export const MIN_SPEED = 60; // Minimum speed (fastest)
export const NUMBER_OF_DUMMY_FOODS = 2; // Number of incorrect letters on the board

// Changed to A-Z sequence
export const WORD_LIST: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
// Example: ["A", "B", "C", ..., "Z"]