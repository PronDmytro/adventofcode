import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number): Promise<number> {
  let totalSum: number = 0;
  const base = part === 1 ? 2 : 3;

  for (let input of inputs) {
    const [target, ...numberParts] = (input.match(/-?\d+/g) ?? []).map(Number);

    for (let i = 0; i < base ** (numberParts.length - 1); i ++) {
      const possibleCombination = i.toString(base).padStart((base ** (numberParts.length - 1) - 1).toString(base).length, '0');

      const result = calculateResultFromParts(numberParts, possibleCombination);
      if (result === target) {
        totalSum += target;
        break;
      }
    }
  }
  return totalSum;
}

function calculateResultFromParts(parts: number[], combination: string): number {
  return parts.reduce((previousValue, currentValue, index) => {
    if (combination[index - 1] === '0') return previousValue + currentValue;
    else if (combination[index - 1] === '1') return previousValue * currentValue;
    else return parseInt(`${ previousValue }${ currentValue }`);
  });
}

run(__filename, solve, { testsOnly: true });
