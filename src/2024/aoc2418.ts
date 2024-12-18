import { run } from 'aoc-copilot';

interface Position {
  x: number;
  y: number;
}

const WIDTH = 70;
const HEIGHT = 70;

const DIRECTIONS: Position[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

async function solve(inputs: string[], part: number): Promise<number | string> {
  const mappedInput: Position[] = inputs.map((line) => {
    const [x, y] = line.split(",").map(Number);
    return { x, y };
  });

  return part === 1 ? bfs(mappedInput) : part2(mappedInput);
}

function part2(data: Position[]): string {
  let low = 0;
  let high = data.length;

  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    bfs(data, mid) === 0 ? (high = mid) : (low = mid);
  }

  const breakpoint = data[high - 1];
  return `${ breakpoint.x },${ breakpoint.y }`;
}


function bfs(data: Position[], delay: number = 1024): number {
  const blocks = new Set(data.slice(0, delay).map(({ x, y }) => `${ x },${ y }`));

  const boundary = new Set([`0,0`]);
  const target = `${ WIDTH },${ HEIGHT }`;
  const seen = new Set<string>();

  let step = 0;

  while (boundary.size > 0) {
    const newBoundary = new Set<string>();

    for (const currentPos of boundary) {
      const [x, y] = currentPos.split(",").map(Number);

      if (currentPos === target) {
        return step;
      }

      if (seen.has(currentPos)) {
        continue;
      }
      seen.add(currentPos);

      for (const dir of DIRECTIONS) {
        const nx = x + dir.x;
        const ny = y + dir.y;
        const neighbor = `${ nx },${ ny }`;

        if (
          nx >= 0 &&
          nx <= WIDTH &&
          ny >= 0 &&
          ny <= HEIGHT &&
          !blocks.has(neighbor) &&
          !seen.has(neighbor)
        ) {
          newBoundary.add(neighbor);
        }
      }
    }

    boundary.clear();
    for (const pos of newBoundary) {
      boundary.add(pos);
    }
    step++;
  }

  return 0;
}

run(__filename, solve, { skipTests: true });
