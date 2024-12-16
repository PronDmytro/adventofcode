import { run } from "aoc-copilot";

const DIRECTIONS: [number, number][] = [
  [-1, 0], // up
  [0, 1],  // right
  [1, 0],  // down
  [0, -1], // left
];

type Position = [number, number];
type QueueItem = { distance: number; row: number; col: number; direction: number };
type ParsedInput = { grid: string[][]; start: Position; end: Position };
type DijkstraResult = {
  bestDistance: number;
  distances: Record<string, number>;
};

async function solve(inputs: string[], part: number): Promise<number> {
  const { grid, start, end } = parseInput(inputs);

  const { bestDistance, distances: distancesForward } = dijkstra(grid, start, end);

  if (part === 1) {
    return bestDistance;
  }

  const { distances: distancesBackward } = dijkstra(grid, start, end, true);
  const optimalPositions = calculateOptimalPositions(grid, distancesForward, distancesBackward, bestDistance);

  return optimalPositions.size;
}

function parseInput(inputs: string[]): ParsedInput {
  const grid = inputs.map(line => line.split(''));

  let start: Position = [0, 0];
  let end: Position = [0, 0];

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 'S') start = [r, c];
      if (grid[r][c] === 'E') end = [r, c];
    }
  }

  return { grid, start, end };
}

/** Implements a Dijkstra-like traversal algorithm */
function dijkstra(
  grid: string[][],
  start: Position,
  end: Position,
  reverse: boolean = false,
): DijkstraResult {
  const queue: QueueItem[] = [];
  const distances: Record<string, number> = {};
  const visited = new Set<string>();
  const [startR, startC] = start;
  const [endR, endC] = end;

  for (let dir = 0; dir < DIRECTIONS.length; dir++) {
    const initialRow = reverse ? endR : startR;
    const initialCol = reverse ? endC : startC;
    queue.push({ distance: 0, row: initialRow, col: initialCol, direction: dir });
  }

  let bestDistance: number | null = null;

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const { distance, row, col, direction } = queue.shift()!;
    const key = `${ row },${ col },${ direction }`;

    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    if (!(key in distances)) {
      distances[key] = distance;
    }

    if (!reverse && row === endR && col === endC && bestDistance === null) {
      bestDistance = distance;
    }

    const nextDirection = reverse ? (direction + 2) % 4 : direction;
    const [dr, dc] = DIRECTIONS[nextDirection];
    const nextRow = row + dr;
    const nextCol = col + dc;

    if (isValidMove(grid, nextRow, nextCol)) {
      queue.push({ distance: distance + 1, row: nextRow, col: nextCol, direction });
    }

    queue.push({ distance: distance + 1000, row, col, direction: (direction + 1) % 4 });
    queue.push({ distance: distance + 1000, row, col, direction: (direction + 3) % 4 });
  }

  return { bestDistance: bestDistance!, distances };
}

function isValidMove(grid: string[][], row: number, col: number): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length && grid[row][col] !== '#';
}

function calculateOptimalPositions(
  grid: string[][],
  distancesForward: Record<string, number>,
  distancesBackward: Record<string, number>,
  bestDistance: number | null,
): Set<string> {
  if (bestDistance === null) {
    return new Set();
  }

  const optimalPositions = new Set<string>();
  const numRows = grid.length;
  const numCols = grid[0].length;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      for (let dir = 0; dir < DIRECTIONS.length; dir++) {
        const key = `${ row },${ col },${ dir }`;
        if (
          Number.isInteger(distancesForward[key]) &&
          Number.isInteger(distancesBackward[key]) &&
          distancesForward[key] + distancesBackward[key] === bestDistance
        ) {
          optimalPositions.add(`${ row },${ col }`);
        }
      }
    }
  }

  return optimalPositions;
}


run(__filename, solve, { skipTests: true });
