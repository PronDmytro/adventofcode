import { run } from 'aoc-copilot';

const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

async function solve(inputs: string[], part: number): Promise<number> {
  const mappedInputs = inputs.map(row => new Robot(row));

  return part === 1 ? part1(mappedInputs) : part2(mappedInputs);
}

function part1(robots: Robot[]): number {
  for (let i = 0; i < 100; i++) {
    for (const robot of robots) {
      robot.x = (robot.x + robot.vx + GRID_WIDTH) % GRID_WIDTH;
      robot.y = (robot.y + robot.vy + GRID_HEIGHT) % GRID_HEIGHT;
    }
  }

  let result = 1;
  for (const startX of [0, Math.floor(GRID_WIDTH / 2) + 1]) {
    for (const startY of [0, Math.floor(GRID_HEIGHT / 2) + 1]) {
      const endX = startX + Math.floor(GRID_WIDTH / 2);
      const endY = startY + Math.floor(GRID_HEIGHT / 2);

      result *= robots.filter(robot => robot.x >= startX && robot.x < endX && robot.y >= startY && robot.y < endY).length;
    }
  }

  return result;
}

function part2(robots: Robot[]): number {
  let step = 0;
  while (true) {
    step++;
    const seenPositions = new Set<string>();

    for (const robot of robots) {
      robot.x = (robot.x + robot.vx + GRID_WIDTH) % GRID_WIDTH;
      robot.y = (robot.y + robot.vy + GRID_HEIGHT) % GRID_HEIGHT;
      seenPositions.add(`${robot.x},${robot.y}`);
    }

    if (seenPositions.size === robots.length) {
      return step;
    }
  }
}

class Robot {
  x: number;
  y: number;
  vx: number;
  vy: number;

  constructor(row: string) {
    const match = row.match(/p=(?<x>-?\d+),(?<y>-?\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)/);
    if (!match || !match.groups) {
      throw new Error("Invalid row format");
    }

    this.x = parseInt(match.groups["x"], 10);
    this.y = parseInt(match.groups["y"], 10);
    this.vx = parseInt(match.groups["vx"], 10);
    this.vy = parseInt(match.groups["vy"], 10);
  }
}

run(__filename, solve, { skipTests: true });
