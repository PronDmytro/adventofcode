import { run } from 'aoc-copilot';

enum GridChar {
  WALL = '#',
  START = '@',
  BOX_LEFT = '[',
  BOX_RIGHT = ']',
  FREE_SPACE = '.',
  PART1_TARGET = 'O',
}

const MOVES = new Map<string, [number, number]>([
  ['<', [0, -1]],
  ['>', [0, 1]],
  ['^', [-1, 0]],
  ['v', [1, 0]],
]);

async function solve(inputs: string[], part: number): Promise<number> {
  const [rawGrid, rawMoves] = splitArrayByEmptyString(inputs);

  const grid = preprocessGrid(rawGrid, part);
  const moves = rawMoves.join('').split('');

  return part === 1 ? part1(grid, moves) : part2(grid, moves);
}

function part1(grid: string[][], moves: string[]): number {
  let [x, y] = findStartPosition(grid);

  executeMoves(grid, moves, x, y, false);

  return calculateResult(grid, GridChar.PART1_TARGET);
}

function part2(grid: string[][], moves: string[]): number {
  let [x, y] = findStartPosition(grid);

  executeMoves(grid, moves, x, y, true);

  return calculateResult(grid, GridChar.BOX_LEFT);
}

function splitArrayByEmptyString(arr: string[]): [string[], string[]] {
  const emptyStringIndex = arr.indexOf("");

  if (emptyStringIndex === -1) {
    return [arr, []];
  }

  const before = arr.slice(0, emptyStringIndex);
  const after = arr.slice(emptyStringIndex + 1);

  return [before, after];
}

function preprocessGrid(grid: string[], part: number): string[][] {
  if (part === 1) {
    return grid.map((row) => row.split(''));
  }

  return grid.map((row) =>
    row.replace(/#/g, '##')
      .replace(/O/g, '[]')
      .replace(/\./g, '..')
      .replace(/@/g, '@.')
      .split(""),
  );
}

function findStartPosition(grid: string[][]): [number, number] {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === GridChar.START) {
        return [x, y];
      }
    }
  }

  throw new Error("Position '@' not found");
}

function executeMoves(grid: string[][], moves: string[], startX: number, startY: number, enableShifting: boolean): void {
  let [x, y] = [startX, startY];

  for (const move of moves) {
    const [yOff, xOff] = MOVES.get(move)!;
    const [newX, newY] = getNextPosition(x, y, xOff, yOff);

    if (isMoveValid(grid, newX, newY)) {
      updateGridForMove(grid, x, y, newX, newY);
      [x, y] = [newX, newY];
      continue;
    }

    if (grid[newY][newX] === GridChar.WALL) {
      continue;
    }
    if (enableShifting) {
      [x, y] = handleShift(grid, x, y, newX, newY, yOff, xOff);
      continue;
    }
    [x, y] = handlePush(grid, x, y, newX, newY, xOff, yOff);
  }
}

function getNextPosition(x: number, y: number, xOff: number, yOff: number): [number, number] {
  return [x + xOff, y + yOff];
}

function isMoveValid(grid: string[][], newX: number, newY: number): boolean {
  return grid[newY][newX] === GridChar.FREE_SPACE;
}

function updateGridForMove(grid: string[][], x: number, y: number, newX: number, newY: number): void {
  grid[newY][newX] = GridChar.START;
  grid[y][x] = GridChar.FREE_SPACE;
}

function handleShift(grid: string[][], x: number, y: number, newX: number, newY: number, yOff: number, xOff: number): [number, number] {
  const [boxL_x, boxL_y, boxR_x, boxR_y] = getBoxBounds(grid, newY, newX);
  if (shiftBox(grid, true, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff)) {
    shiftBox(grid, false, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff);
    updateGridForMove(grid, x, y, newX, newY);
    return [newX, newY];
  }
  return [x, y];
}

function handlePush(grid: string[][], x: number, y: number, newX: number, newY: number, xOff: number, yOff: number): [number, number] {
  let [destX, destY] = getNextPosition(newX, newY, xOff, yOff);

  while (true) {
    if (grid[destY][destX] === GridChar.WALL) {
      break;
    }
    if (grid[destY][destX] === GridChar.FREE_SPACE) {
      grid[newY][newX] = GridChar.START;
      grid[y][x] = GridChar.FREE_SPACE;
      grid[destY][destX] = GridChar.PART1_TARGET;
      return [newX, newY];
    }
    [destX, destY] = getNextPosition(destX, destY, xOff, yOff);
  }
  return [x, y];
}

function shiftBox(grid: string[][], dryRun: boolean, boxL_y: number, boxL_x: number, boxR_y: number, boxR_x: number, yOff: number, xOff: number): boolean {
  const toDp = (x: number, y: number): number => y * grid[0].length + x;
  let queue = [[boxL_y, boxL_x, GridChar.BOX_LEFT], [boxR_y, boxR_x, GridChar.BOX_RIGHT]];
  let seen = new Set([toDp(boxL_y, boxL_x), toDp(boxR_y, boxR_x)]);

  if (!dryRun) {
    grid[boxL_y][boxL_x] = GridChar.FREE_SPACE;
    grid[boxR_y][boxR_x] = GridChar.FREE_SPACE;
  }

  while (queue.length) {
    const [currY, currX, char] = queue.pop()!;

    const newY = +currY + yOff;
    const newX = +currX + xOff;

    if (grid[newY][newX] === GridChar.WALL) {
      return false;
    }
    if (grid[newY][newX] !== GridChar.FREE_SPACE) {
      const [box2L_x, box2L_y, box2R_x, box2R_y] = getBoxBounds(grid, newY, newX);

      const val = toDp(box2L_y, box2L_x);
      if (!seen.has(val)) {
        seen.add(val);
        seen.add(toDp(box2R_y, box2R_x));

        queue.push([box2L_y, box2L_x, GridChar.BOX_LEFT], [box2R_y, box2R_x, GridChar.BOX_RIGHT]);

        if (!dryRun) {
          grid[box2L_y][box2L_x] = GridChar.FREE_SPACE;
          grid[box2R_y][box2R_x] = GridChar.FREE_SPACE;
        }
      }
    }

    if (!dryRun) {
      grid[newY][newX] = char as string;
    }
  }
  return true;
}

function getBoxBounds(grid: string[][], y: number, x: number): [number, number, number, number] {
  const boxL_x = grid[y][x] === GridChar.BOX_LEFT ? x : x - 1;
  const boxL_y = y;
  const boxR_x = boxL_x + 1;
  return [boxL_x, boxL_y, boxR_x, boxL_y];
}

function calculateResult(grid: string[][], targetChar: string): number {
  let result = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === targetChar) {
        result += y * 100 + x;
      }
    }
  }
  return result;
}

run(__filename, solve, { testsOnly: true });
