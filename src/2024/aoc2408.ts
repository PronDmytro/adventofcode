import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number): Promise<number | string> {
  const map = createCharacterMap(inputs);
  const antennas = organizeAntennas(map);
  const antiNodes = calculateAntiNodes(map, antennas, part);
  return antiNodes.size;
}

function createCharacterMap(inputs: string[]): string[][] {
  return inputs.map(row => row.split(''));
}

function organizeAntennas(map: string[][]): Map<string, string[]> {
  const antennas: Map<string, string[]> = new Map();
  for (const [y, row] of map.entries()) {
    for (const [x, frequency] of row.entries()) {
      if (frequency !== '.') {
        antennas.set(
          frequency,
          (antennas.get(frequency) ?? []).concat([`${ x },${ y }`]),
        );
      }
    }
  }
  return antennas;
}

function calculateAntiNodes(
  map: string[][],
  antennas: Map<string, string[]>,
  part: number,
): Set<string> {
  const antiNodes: Set<string> = new Set();
  const DOUBLE = 2;

  for (const [y, row] of map.entries()) {
    for (const x of row.keys()) {
      for (const locations of antennas.values()) {
        processAntennasForLocation(x, y, locations, part, antiNodes, DOUBLE);
      }
    }
  }

  return antiNodes;
}

function processAntennasForLocation(
  x: number,
  y: number,
  locations: string[],
  part: number,
  antiNodes: Set<string>,
  double: number,
) {
  for (const [i, position1] of locations.entries()) {
    const [x1, y1] = position1.split(',').map(Number);
    for (const position2 of locations.slice(i + 1)) {
      const [x2, y2] = position2.split(',').map(Number);
      if (
        (x === x1 && y === y1) ||
        (x === x2 && y === y2) ||
        ((x - x1) / (y - y1) === (x1 - x2) / (y1 - y2))
      ) {
        const distance1 = Math.abs(x - x1) + Math.abs(y - y1);
        const distance2 = Math.abs(x - x2) + Math.abs(y - y2);
        if (part === 2 || distance1 === distance2 * double || distance1 * double === distance2) {
          antiNodes.add(`${ x },${ y }`);
        }
      }
    }
  }
}

run(__filename, solve, { testsOnly: true });
