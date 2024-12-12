import { run } from 'aoc-copilot';

interface Perimeter {
  x: number;
  y: number;
  valid: boolean;
}

interface Details {
  area: number,
  perimeter: Record<DIRECTION, Perimeter[]>;
}

enum DIRECTION {
  UP = '0',
  RIGHT = '1',
  DOWN = '2',
  LEFT = '3',
}

async function solve(inputs: string[], part: number): Promise<number> {
  return part === 1 ? part1(inputs) : part2(inputs);
}

function part1(rows: string[]): number {
  return calculate(rows, (details) => details.area * Object.values(details.perimeter).reduce((sum, array) => sum + array.length, 0));
}


function part2(rows: string[]): number {
  const filterPerimeters = (array: Perimeter[], primary: 'x' | 'y', secondary: 'x' | 'y') => {
    array.sort((a, b) => a[primary] - b[primary]);

    for (let i = 0; i < array.length; i ++) {
      let check = array[i][primary];
      while (true) {
        check ++;
        const nextNode = array.find(node => node[primary] === check && node[secondary] === array[i][secondary]);

        if (nextNode !== undefined) {
          nextNode.valid = false;
          continue;
        }

        break;
      }
    }
  };

  return calculate(rows, (details) => {
    Object.keys(details.perimeter).forEach((direction) => {
      if ((direction) === DIRECTION.UP || direction === DIRECTION.DOWN) {
        filterPerimeters(details.perimeter[direction], 'x', 'y');
      }
      if (direction === DIRECTION.LEFT || direction === DIRECTION.RIGHT) {
        filterPerimeters(details.perimeter[direction], 'y', 'x');
      }
    });

    return details.area * Object.values(details.perimeter).reduce((sum, array) => sum + array.filter(perimeter => perimeter.valid).length, 0);
  });
}

function calculate(rows: string[], sumHandler: (details: Details) => number): number {
  const width = rows[0].length, height = rows.length;

  let alreadyFlooded = new Set<string>();
  let sum = 0;
  for (let y = 0; y < height; y ++) {
    for (let x = 0; x < width; x ++) {
      if (alreadyFlooded.has(`${ x },${ y }`)) {
        continue;
      }

      let details: Details = {
        area: 0,
        perimeter: { [DIRECTION.UP]: [], [DIRECTION.DOWN]: [], [DIRECTION.LEFT]: [], [DIRECTION.RIGHT]: [] },
      };

      let visited = new Set<string>();
      details = floodFill(rows, details, x, y, visited);
      alreadyFlooded = new Set([...alreadyFlooded, ...visited]);

      sum += sumHandler(details);
    }
  }

  return sum;
}

function floodFill(grid: string[], details: Details, x: number, y: number, area: Set<string>): Details {
  if (area.has(`${ x },${ y }`)) {
    return details;
  }

  area.add(`${ x },${ y }`);
  const width = grid[0].length, height = grid.length;
  const plant = grid[y][x];

  details.area ++;
  if (y === 0 || grid[y - 1][x] !== plant) {
    details.perimeter[DIRECTION.UP].push({ x, y, valid: true });
  }
  if (y === height - 1 || grid[y + 1][x] !== plant) {
    details.perimeter[DIRECTION.DOWN].push({ x, y, valid: true });
  }
  if (x === 0 || grid[y][x - 1] !== plant) {
    details.perimeter[DIRECTION.RIGHT].push({ x, y, valid: true });
  }
  if (x === width - 1 || grid[y][x + 1] !== plant) {
    details.perimeter[DIRECTION.LEFT].push({ x, y, valid: true });
  }

  if (y !== 0 && grid[y - 1][x] === plant) {
    details = floodFill(grid, details, x, y - 1, area);
  }
  if (y !== height - 1 && grid[y + 1][x] === plant) {
    details = floodFill(grid, details, x, y + 1, area);
  }
  if (x !== 0 && grid[y][x - 1] === plant) {
    details = floodFill(grid, details, x - 1, y, area);
  }
  if (x !== width - 1 && grid[y][x + 1] === plant) {
    details = floodFill(grid, details, x + 1, y, area);
  }

  return details;
}

run(__filename, solve, { testsOnly: true });
