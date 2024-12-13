import { run } from 'aoc-copilot';


type Coordinates = { x: number; y: number };

async function solve(inputs: string[], part: number): Promise<number> {
  const offset = part === 2 ? 10000000000000 : 0;
  let buttonA: Coordinates = { x: 0, y: 0 };
  let buttonB: Coordinates = { x: 0, y: 0 };
  let tokens = 0;

  for (const line of inputs) {
    if (line.startsWith("Button")) {
      const { key, coords } = parseButtonLine(line);
      key === "A" ? (buttonA = coords) : (buttonB = coords)
    } else if (line.startsWith("Prize")) {
      const [c, d] = parsePrizeLine(line, offset);
      const { x: x1, y: y1 } = buttonA;
      const { x: x2, y: y2 } = buttonB;

      const a = (c * y2 - d * x2) / (x1 * y2 - y1 * x2);
      const b = (d * x1 - c * y1) / (x1 * y2 - y1 * x2);

      if (Number.isInteger(a) && Number.isInteger(b)) {
        tokens += Math.floor(3 * a + b);
      }
    }
  }

  return tokens;
}

function parseButtonLine(line: string): { key: string; coords: Coordinates } {
  const parts = line.split(" ");
  const key = parts[1].split(":")[0];
  const x = parseInt(parts[2].slice(2, - 1), 10);
  const y = parseInt(parts[3].slice(2), 10);
  return { key, coords: { x, y } };
}

function parsePrizeLine(line: string, offset: number): [number, number] {
  const parts = line.split(" ");
  const c = parseInt(parts[1].slice(2, - 1), 10) + offset;
  const d = parseInt(parts[2].slice(2), 10) + offset;
  return [c, d];
}

run(__filename, solve, { skipTests: true });
