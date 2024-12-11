import { run } from "aoc-copilot";

const cache = new Map<string, number>();

async function solve(inputs: string[], part: number): Promise<number> {
  const mappedInput = inputs[0].split(/\s+/).map(num => parseInt(num));
  const blinks = part === 1 ? 25 : 75;

  return mappedInput.reduce((sum, num) => sum + calculateBlinkSum(num, 0, blinks), 0);
}

function calculateBlinkSum(number: number, currentBlink: number, maxBlinks: number): number {
  const key = `${ number },${ currentBlink }`;

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  if (currentBlink === maxBlinks) {
    return 1;
  }

  if (number === 0) {
    const result = calculateBlinkSum(1, currentBlink + 1, maxBlinks);
    cache.set(key, result);
    return result;
  }

  const numberStr = number.toString();
  const length = numberStr.length;

  let result: number;
  if (length % 2 === 0) {
    const left = parseInt(numberStr.slice(0, length / 2));
    const right = parseInt(numberStr.slice(length / 2));
    result = calculateBlinkSum(left, currentBlink + 1, maxBlinks) + calculateBlinkSum(right, currentBlink + 1, maxBlinks);
  } else {
    result = calculateBlinkSum(number * 2024, currentBlink + 1, maxBlinks);
  }

  cache.set(key, result);
  return result;
}

run(__filename, solve, { testsOnly: true });
