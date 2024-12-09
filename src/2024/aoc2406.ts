import { run } from 'aoc-copilot';

const MAX_STEPS = 6000;
const DIRECTIONS: Record<string, [number, number]> = {
  UP: [0, - 1],
  RIGHT: [1, 0],
  DOWN: [0, 1],
  LEFT: [- 1, 0],
};

async function solve(inputs: string[], part: number): Promise<number> {
  return part === 1 ? part1(inputs) : part2(inputs);
}

function part1(rows: string[]): number {
  const rowsMap = rows.map(row => row.split(''));
  let guardPosition: [number, number] = [
    rows[rows.findIndex(row => row.includes('^'))].indexOf('^'),
    rows.findIndex(row => row.includes('^')),
  ];
  let currentDirection = DIRECTIONS.UP;

  while (true) {
    const [x, y] = guardPosition;
    const [dx, dy] = currentDirection;
    const nextPosition: [number, number] = [x + dx, y + dy];

    if (isOutOfBound(nextPosition, rowsMap)) {
      break;
    }

    if (rowsMap[nextPosition[1]][nextPosition[0]] === '#') {
      currentDirection = getNextDirection(currentDirection);
    } else {
      rowsMap[y][x] = 'X';
      guardPosition = nextPosition;
    }
  }

  return countMarkedCells(rowsMap, 'X') + 1;
}

function part2(rows: string[]): number {
  const rowsMap = rows.map(row => row.split(''));
  const startPosition: [number, number] = [
    rows[rows.findIndex(row => row.includes('^'))].indexOf('^'),
    rows.findIndex(row => row.includes('^')),
  ];

  let nonEscapedGuards = 0;

  for (let x = 0; x < rowsMap[0].length; x ++) {
    for (let y = 0; y < rowsMap.length; y ++) {
      if (!canGuardEscape([x, y], rowsMap, startPosition)) {
        nonEscapedGuards ++;
      }
    }
  }

  return nonEscapedGuards;
}

function getNextDirection(currentDirection: [number, number]): [number, number] {
  return currentDirection === DIRECTIONS.UP ? DIRECTIONS.RIGHT
    : currentDirection === DIRECTIONS.RIGHT ? DIRECTIONS.DOWN
      : currentDirection === DIRECTIONS.DOWN ? DIRECTIONS.LEFT
        : DIRECTIONS.UP;
}

function isOutOfBound(position: [number, number], map: string[][]): boolean {
  const [x, y] = position;
  return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
}

function countMarkedCells(map: string[][], mark: string): number {
  return map.flat().filter(cell => cell === mark).length;
}

function canGuardEscape(startWall: [number, number], map: string[][], startPosition: [number, number]): boolean {
  let guardPosition = startPosition;
  let currentDirection = DIRECTIONS.UP;
  const testMap = JSON.parse(JSON.stringify(map));
  testMap[startWall[1]][startWall[0]] = '#';
  let steps = 0;
  let escaped = false;

  while (true) {
    const [gX, gY] = guardPosition;
    const [dx, dy] = currentDirection;
    const nextPosition: [number, number] = [gX + dx, gY + dy];

    if (isOutOfBound(nextPosition, testMap)) {
      escaped = true;
      break;
    }

    if (testMap[nextPosition[1]][nextPosition[0]] === '#') {
      currentDirection = getNextDirection(currentDirection);
    } else {
      guardPosition = nextPosition;
      steps ++;
    }

    if (steps > MAX_STEPS) {
      break;
    }
  }

  return escaped;
}


run(__filename, solve, { testsOnly: true });
