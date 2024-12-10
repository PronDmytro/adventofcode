import { run } from 'aoc-copilot';

type Position = [number, number];

const DIRECTIONS: Position[] = [
  [0, 1],  // right
  [1, 0],  // down
  [0, - 1], // left
  [- 1, 0], // up
];

async function solve(inputs: string[], part: number): Promise<number> {
  const mappedInput = inputs.map(line => line.split('').map(Number));

  return part === 1 ? part1(mappedInput) : part2(mappedInput);
}

function part1(input: number[][]): number {
  const trailheads = findTrailheads(input);
  return trailheads.reduce((sum, trailhead) => sum + scoreTrailhead(input, trailhead), 0);
}

function part2(input: number[][]): number {
  const trailheads = findTrailheads(input);
  return trailheads.reduce((accumulator, trailhead) => accumulator + findDistinctTrails(input, trailhead), 0);
}

function findTrailheads(map: number[][]): Position[] {
  const trailheads: Position[] = [];
  for (let r = 0; r < map.length; r ++) {
    const row = map[r];

    for (let c = 0; c < row.length; c ++) {
      const height = row[c];

      if (height === 0) {
        trailheads.push([r, c]);
      }
    }
  }

  return trailheads;
}

function isValidMove(map: number[][], x: number, y: number, currentHeight: number): boolean {
  const rows = map.length;
  const cols = map[0].length;

  return (
    0 <= x && x < rows &&
    0 <= y && y < cols &&
    map[x][y] === currentHeight + 1
  );
}

function scoreTrailhead(map: number[][], start: Position): number {
  const queue: Position[] = [start];
  const visited: Set<string> = new Set();
  visited.add(`${ start[0] },${ start[1] }`);
  const reachableNines: Set<string> = new Set();

  while (queue.length > 0) {
    const [x, y] = queue.shift() as Position;
    const currentHeight = map[x][y];

    for (const [dx, dy] of DIRECTIONS) {
      const nx = x + dx;
      const ny = y + dy;
      const positionKey = `${ nx },${ ny }`;

      if (isValidMove(map, nx, ny, currentHeight) && !visited.has(positionKey)) {
        queue.push([nx, ny]);
        visited.add(positionKey);

        if (map[nx][ny] === 9) {
          reachableNines.add(positionKey);
        }
      }
    }
  }

  return reachableNines.size;
}

function findDistinctTrails(map: number[][], start: Position): number {
  const stack: [Position, Position[]][] = [[start, [start]]];
  const trails = new Set<string>();

  while (stack.length > 0) {
    const [currentPosition, path] = stack.pop()!;
    const [x, y] = currentPosition;
    const currentHeight = map[x][y];

    for (const [dx, dy] of DIRECTIONS) {
      const [nx, ny] = [x + dx, y + dy];

      if (isValidMove(map, nx, ny, currentHeight)) {
        const newPath: Position[] = [...path, [nx, ny]];
        stack.push([[nx, ny], newPath]);

        if (map[nx][ny] === 9) {
          trails.add(JSON.stringify(newPath));
        }
      }
    }
  }

  return trails.size;
}

run(__filename, solve, { testsOnly: true });
