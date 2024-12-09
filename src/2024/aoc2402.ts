import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number): Promise<number> {
  return part === 1 ? countSafeReports(inputs, isSafeReport) : countSafeReports(inputs, isSafeWithDampener);
}

function countSafeReports(inputs: string[], safetyCheck: (levels: number[]) => boolean): number {
  return inputs.reduce((safeCount, report) => {
    const levelDifferences = report.split(" ").map(Number);
    return safetyCheck(levelDifferences) ? safeCount + 1 : safeCount;
  }, 0);
}

function isSafeReport(levelDifferences: number[]): boolean {
  let isIncreasing = null;
  for (let i = 1; i < levelDifferences.length; i ++) {
    const diff = levelDifferences[i] - levelDifferences[i - 1];
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      return false;
    }

    const currentIncreasing = levelDifferences[i] > levelDifferences[i - 1];
    if (isIncreasing === null) {
      isIncreasing = currentIncreasing;
    } else if (isIncreasing !== currentIncreasing) {
      return false;
    }
  }
  return true;
}

function isSafeWithDampener(levelDifferences: number[]): boolean {
  if (isSafeReport(levelDifferences)) {
    return true;
  }
  for (let i = 0; i < levelDifferences.length; i ++) {
    const modifiedLevels = levelDifferences.slice(0, i).concat(levelDifferences.slice(i + 1));
    if (isSafeReport(modifiedLevels)) {
      return true;
    }
  }
  return false;
}

run(__filename, solve, { testsOnly: true });
