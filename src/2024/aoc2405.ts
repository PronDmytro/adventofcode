import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number): Promise<number> {
  const [rules, updates] = parseInputs(inputs);
  const dependencyMap: Map<number, Set<number>> = new Map();

  for (const rule of rules) {
    const [left, right] = rule.split('|').map(Number);
    dependencyMap.set(left, (dependencyMap.get(left) ?? new Set()).add(right));
  }

  let resultSum = 0;
  for (const update of updates) {
    resultSum += calculateUpdateImpact(update, dependencyMap, part);
  }

  return resultSum;
}

function calculateUpdateImpact(update: string, dependencyMap: Map<number, Set<number>>, part: number): number {
  const numbers = update.split(',').map(Number);
  const orderedNumbers = numbers.toSorted((a, b) => dependencyMap.get(a)?.has(b) ? - 1 : 1);
  const isInOrder = numbers.every((num, index) => num === orderedNumbers[index]);
  const middleIndex = Math.floor(numbers.length / 2);

  if (part === 1 && isInOrder) {
    return numbers[middleIndex];
  }
  if (part === 2 && !isInOrder) {
    return orderedNumbers[middleIndex];
  }
  return 0;
}

function parseInputs(inputs: string[]): string[][] {
  return inputs.join('\n').split('\n\n').map(p => p.split('\n'));
}

run(__filename, solve, { testsOnly: true });
