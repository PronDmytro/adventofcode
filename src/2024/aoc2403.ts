import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number): Promise<number> {
  return part === 1 ? part1(inputs[0]) : part2(inputs[0]);
}

function part1(input: string): number {
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;

  let sum = 0;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    sum += x * y;
  }

  return sum;
}

function part2(input: string): number {
  let isEnabled = true;
  let sum = 0;
  let match;

  const regex = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g;

  while ((match = regex.exec(input)) !== null) {
    const instruction = match[0];

    if (instruction === "do()") {
      isEnabled = true;
    } else if (instruction === "don't()") {
      isEnabled = false;
    } else if (instruction.startsWith("mul(")) {
      if (isEnabled) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        sum += x * y;
      }
    }
  }

  return sum;
}

run(__filename, solve, { testsOnly: true });
