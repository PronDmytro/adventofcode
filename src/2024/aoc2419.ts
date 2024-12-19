import { run } from 'aoc-copilot';

type MemoType<T> = Record<string, T>;

async function solve([rawPatterns, _, ...designs]: string[], part: number): Promise<number> {
  const patterns = rawPatterns.split(", ");
  return part === 1 ? part1(patterns, designs) : part2(patterns, designs);
}

function part1(patterns: string[], designs: string[]): number {
  let possibleCount = 0;
  const memo: Record<string, boolean> = {};

  for (const design of designs) {
    if (canFormDesign(design, patterns, memo)) {
      possibleCount++;
    }
  }

  return possibleCount;
}

function part2(patterns: string[], designs: string[]): number {
  let totalCount = 0;
  const memo: Record<string, number> = {};

  for (const design of designs) {
    totalCount += countWays(design, patterns, memo);
  }

  return totalCount;
}

function canFormDesign(design: string, patterns: string[], memo: MemoType<boolean>): boolean {
  if (design in memo) {
    return memo[design] as boolean;
  }
  if (design === '') {
    return true;
  }

  for (const pattern of patterns) {
    if (design.startsWith(pattern) && canFormDesign(design.slice(pattern.length), patterns, memo)) {
      return (memo[design] = true);
    }
  }

  return (memo[design] = false);
}

function countWays(design: string, patterns: string[], memo: MemoType<number>): number {
  if (design in memo) {
    return memo[design] as number;
  }
  if (design === '') {
    return 1;
  }

  memo[design] = patterns.reduce((ways, pattern) =>
      ways + (design.startsWith(pattern) ? countWays(design.slice(pattern.length), patterns, memo) : 0)
    , 0);

  return memo[design];
}

run(__filename, solve, { skipTests: true });
