import { run } from 'aoc-copilot';

const SHIFT_AMOUNT = 8;

async function solve(inputs: string[], part: number): Promise<number | string> {
  const [initialA, initialB, initialC, ...program] = inputs.join('').match(/\d+/g)!.map(Number);
  const out: number[] = [];
  let [a, b, c] = [initialA, initialB, initialC];
  let pointer = 0;

  const executeProgram = () => {
    out.length = 0;
    pointer = 0;
    while (program[pointer] != null) {
      instructions[program[pointer]]();
      pointer += 2;
    }
  };

  const instructions = [
    () => (a = Math.floor(a / (1 << resolveOperand()))),
    () => (b = b ^ program[pointer + 1]),
    () => (b = resolveOperand() & 7),
    () => a && (pointer = program[pointer + 1] - 2),
    () => (b = b ^ c),
    () => out.push(resolveOperand() & 7),
    () => (b = Math.floor(a / (1 << resolveOperand()))),
    () => (c = Math.floor(a / (1 << resolveOperand()))),
  ];

  const resolveOperand = () => [0, 1, 2, 3, a, b, c][program[pointer + 1]];

  const findInitialA = (nextVal = 0, i = program.length - 1): number => {
    if (i < 0) return nextVal;
    for (let aVal = nextVal * SHIFT_AMOUNT; aVal < nextVal * SHIFT_AMOUNT + SHIFT_AMOUNT; aVal++) {
      a = aVal;
      executeProgram();
      if (out[0] === program[i]) {
        const finalVal = findInitialA(aVal, i - 1);
        if (finalVal >= 0) return finalVal;
      }
    }
    return -1;
  };

  if (part === 1) {
    executeProgram();
    return out.join(',');
  }

  return findInitialA();
}

run(__filename, solve, { skipTests: true });
