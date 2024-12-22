import { run } from 'aoc-copilot';

const ITERATION_COUNT = 2000;
const MAX_SEED_MODULO = 16777216n;

async function solve(inputs: string[], part: number): Promise<number> {
  const numbers = inputs.map(num => BigInt(num));

  return (part === 1 ? part1(numbers) : part2(numbers)) as number;
}

function secretNumber(seed: bigint): bigint {
  seed = ((seed << 6n) ^ seed) % MAX_SEED_MODULO;
  seed = ((seed >> 5n) ^ seed) % MAX_SEED_MODULO;
  seed = ((seed << 11n) ^ seed) % MAX_SEED_MODULO;

  return seed;
}

function part1(numbers: bigint[]): bigint {
  return numbers.reduce((sum, num) => {
    let seed = num;
    for (let i = 0; i < ITERATION_COUNT; i++) {
      seed = secretNumber(seed);
    }
    return sum + seed;
  }, 0n);
}

function part2(numbers: bigint[]): number {
  const ranges: { [key: string]: number[] } = {};

  numbers.forEach((num) => {
    let seed = num;
    const visitedKeys = new Set<string>();
    const changeBuffer: number[] = [];

    for (let i = 0; i < ITERATION_COUNT; i++) {
      const nextSeed = secretNumber(seed);
      const change = Number((nextSeed % 10n) - (seed % 10n));
      changeBuffer.push(change);
      seed = nextSeed;

      if (changeBuffer.length === 4) {
        const key = changeBuffer.join(',');

        if (!visitedKeys.has(key)) {
          if (ranges[key] === undefined) {
            ranges[key] = [];
          }

          ranges[key].push(Number(nextSeed % 10n));
          visitedKeys.add(key);
        }
        changeBuffer.shift();
      }
    }
  });

  const sumRange = (range: number[]): number => range.reduce((sum, num) => sum + num, 0);
  return Math.max(...Object.values(ranges).map(sumRange));
}

run(__filename, solve, { skipTests: true });
