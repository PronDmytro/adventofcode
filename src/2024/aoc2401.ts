import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number): Promise<number> {
  const { leftList, rightList } = parseInputs(inputs);
  return part === 1 ? part1(leftList, rightList) : part2(leftList, rightList);
}

function parseInputs(inputs: string[]): { leftList: number[], rightList: number[] } {
  const leftList: number[] = [];
  const rightList: number[] = [];
  const SPLIT_PATTERN = /\s+/;

  inputs.forEach((line) => {
    const tokens = line.trim().split(SPLIT_PATTERN);
    if (tokens.length === 2) {
      const left = parseInt(tokens[0]);
      const right = parseInt(tokens[1]);
      leftList.push(left);
      rightList.push(right);
    }
  });

  return { leftList, rightList };
}

function part1(leftList: number[], rightList: number[]): number {
  const leftSorted = [...leftList].sort((a, b) => a - b);
  const rightSorted = [...rightList].sort((a, b) => a - b);

  const distances = leftSorted.map((value, index) => Math.abs(value - rightSorted[index]));

  return distances.reduce((sum, distance) => sum + distance, 0);
}

function part2(leftList: number[], rightList: number[]): number {
  const frequencyMap: Record<number, number> = {};
  for (const num of rightList) {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;
  }

  let similarityScore = 0;
  for (const num of leftList) {
    similarityScore += num * (frequencyMap[num] || 0);
  }

  return similarityScore;
}

run(__filename, solve, { testsOnly: true });
