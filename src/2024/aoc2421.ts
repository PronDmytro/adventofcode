import { run } from 'aoc-copilot';

type Path = Map<string, number>;

const PART_DEPTH = [2, 25];
const NUMERIC_PAD = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  [' ', '0', 'A'],
];

const DIRECTION_PAD = [
  [' ', '^', 'A'],
  ['<', 'v', '>'],
];

const bestStepsMemo = new Map<string, string>();

async function solve(inputs: string[], part: number): Promise<number> {
  const computeComplexity = (code: string): number => {
    const depth = PART_DEPTH[part - 1];
    const nestedPath = findNestedPath(code, depth);
    return pathLength(nestedPath) * Number(code.slice(0, 3));
  };

  return inputs
    .map(computeComplexity)
    .reduce((sum, current) => sum + current, 0);
}

function findNestedPath(code: string, depth: number): Path {
  if (depth === 0) {
    return findMinPath(NUMERIC_PAD, new Map([[code, 1]]));
  }

  return findMinPath(DIRECTION_PAD, findNestedPath(code, depth - 1));
}

function findMinPath(pad: string[][], currentPath: Path): Path {
  const [, blankY] = findKey(pad, ' ');
  const resultPath = new Map<string, number>();

  for (const [steps, count] of currentPath.entries()) {
    steps
      .split('')
      .map((key, i, keys) => [keys[(i - 1 + keys.length) % keys.length], key])
      .map(([start, end]) => calculateSteps(pad, start, end, blankY))
      .forEach((step) => step && resultPath.set(step, (resultPath.get(step) ?? 0) + count));
  }

  return resultPath;
}

function pathLength(path: Path): number {
  return [...path.entries()]
    .map(([step, count]) => step.length * count)
    .reduce((sum, len) => sum + len, 0);
}

function calculateSteps(pad: string[][], start: string, end: string, blankY: number): string {
  const [xStart, yStart] = findKey(pad, start);
  const [xEnd, yEnd] = findKey(pad, end);

  const stepX = xStart < xEnd ? '>'.repeat(xEnd - xStart) : '<'.repeat(xStart - xEnd);
  const stepY = yStart < yEnd ? 'v'.repeat(yEnd - yStart) : '^'.repeat(yStart - yEnd);

  if (!stepX || !stepY) {
    return `${ stepX }${ stepY }A`;
  }

  return (
    !stepX || !stepY ? `${ stepX }${ stepY }A`
      : xStart === 0 && yEnd === blankY ? `${ stepX }${ stepY }A`
        : yStart === blankY && xEnd === 0 ? `${ stepY }${ stepX }A`
          : betterStep(`${ stepX }${ stepY }A`, `${ stepY }${ stepX }A`)!
  );
}

function betterStep(stepA: string, stepB: string): string {
  const memoKey = `${ stepA },${ stepB }`;
  if (bestStepsMemo.has(memoKey)) {
    return bestStepsMemo.get(memoKey)!;
  }

  bestStepsMemo.set(memoKey, stepA);
  let [pathA, pathB] = [new Map([[stepA, 1]]), new Map([[stepB, 1]])];
  let lengthA: number, lengthB: number;

  do {
    pathA = findMinPath(DIRECTION_PAD, pathA);
    pathB = findMinPath(DIRECTION_PAD, pathB);
  } while ((lengthA = pathLength(pathA)) === (lengthB = pathLength(pathB)));

  const bestStep = lengthA < lengthB ? stepA : stepB;
  bestStepsMemo.set(memoKey, bestStep);
  return bestStep;
}

function findKey(pad: string[][], char: string): [number, number] {
  const y = pad.findIndex((row) => row.includes(char));
  const x = pad[y]?.indexOf(char);
  return [x, y];
}

run(__filename, solve, { skipTests: true });
