import { run } from 'aoc-copilot';

type Position = [number, number];
const WALKABLE_CELL = '.';
const PART_ONE_DISTANCE = 2;
const PART_TWO_DISTANCE = 20;
const MIN_SAVED_CHEATS = 100;

async function solve(inputs: string[], part: number): Promise<number> {
  const [grid, start, end] = initializeMap(inputs);
  const track: Position[] = findTrack(grid, start, end);
  const trackIndex: Record<string, number> = Object.fromEntries(
    track.map((pos, index) => [JSON.stringify(pos), index]),
  );

  const maxDistance = part === 1 ? PART_ONE_DISTANCE : PART_TWO_DISTANCE;
  return countCheats(grid, track, trackIndex, maxDistance);
}

function initializeMap(data: string[]): [string[][], Position, Position] {
  let start: Position;
  let end: Position;
  const grid = data.map((line, row) =>
    [...line].map((char, col) => {
      if (char === 'S') {
        start = [row, col];
        return WALKABLE_CELL;
      }
      if (char === 'E') {
        end = [row, col];
        return WALKABLE_CELL;
      }
      return char;
    }),
  );

  return [grid, start!, end!];
}

function findTrack(grid: string[][], start: Position, end: Position): Position[] {
  const track: Position[] = [start];
  const visited: Record<string, boolean> = { [JSON.stringify(start)]: true };

  while (JSON.stringify(track.at(-1)) !== JSON.stringify(end)) {
    const [lastR, lastC] = track.at(-1)!;
    const nextPosition = [
      [lastR + 1, lastC],
      [lastR - 1, lastC],
      [lastR, lastC + 1],
      [lastR, lastC - 1],
    ]
      .filter(([neighborRow, neighborColumn]) => grid[neighborRow]?.[neighborColumn] === WALKABLE_CELL)
      .find((neighbor) => !visited[JSON.stringify(neighbor)]);
    if (!nextPosition) break; // Prevent infinite loops in case of invalid maps
    track.push(nextPosition as Position);
    visited[JSON.stringify(nextPosition)] = true;
  }

  return track;
}

function countCheatsByPosition(
  grid: string[][],
  trackIndex: Record<string, number>,
  currentRow: number,
  currentColumn: number,
  maxDistance: number,
  minSaved: number,
): number {
  const currentIndex = trackIndex[JSON.stringify([currentRow, currentColumn])];
  let cheatCount = 0;

  for (let nr = currentRow - maxDistance; nr <= currentRow + maxDistance; nr++) {
    for (let nc = currentColumn - maxDistance; nc <= currentColumn + maxDistance; nc++) {
      const distance = Math.abs(nr - currentRow) + Math.abs(nc - currentColumn);
      const neighborIndex = trackIndex[JSON.stringify([nr, nc])];
      const saved = neighborIndex - currentIndex - distance;

      if (distance <= maxDistance && grid[nr]?.[nc] === WALKABLE_CELL && saved >= minSaved) {
        cheatCount++;
      }
    }
  }

  return cheatCount;
}

function countCheats(grid: string[][], track: Position[], trackIndex: Record<string, number>, maxDistance: number): number {
  return track.reduce((total, position) => total + countCheatsByPosition(grid, trackIndex, ...position, maxDistance, MIN_SAVED_CHEATS), 0);
}

run(__filename, solve, { skipTests: true });
