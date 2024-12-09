import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number): Promise<number> {
  const mappedInputs = inputs.map(row => row.split(""));
  return part === 1 ? part1(mappedInputs) : part2(mappedInputs);
}

function getDimensions(inputs: string[][]): { rows: number, cols: number } {
  return { rows: inputs.length, cols: inputs[0].length };
}

function part1(inputs: string[][], word = "XMAS"): number {
  const { rows, cols } = getDimensions(inputs);
  const wordLength = word.length;
  let count = 0;

  // Directions: [rowDelta, colDelta]
  const directions = [
    [0, 1],   // Horizontal right
    [0, - 1],  // Horizontal left
    [1, 0],   // Vertical down
    [- 1, 0],  // Vertical up
    [1, 1],   // Diagonal down-right
    [- 1, - 1], // Diagonal up-left
    [1, - 1],  // Diagonal down-left
    [- 1, 1],  // Diagonal up-right
  ];

  const isWordFound = (r: number, c: number, rowDelta: number, colDelta: number): boolean => {
    for (let i = 0; i < wordLength; i ++) {
      const newRow = r + i * rowDelta;
      const newCol = c + i * colDelta;
      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols || inputs[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  for (let r = 0; r < rows; r ++) {
    for (let c = 0; c < cols; c ++) {
      for (const [rowDelta, colDelta] of directions) {
        if (isWordFound(r, c, rowDelta, colDelta)) {
          count ++;
        }
      }
    }
  }

  return count;
}

function part2(inputs: string[][]): number {
  const { rows, cols } = getDimensions(inputs);
  let count = 0;

  for (let x = 1; x < rows - 1; x ++) {
    for (let y = 1; y < cols - 1; y ++) {
      if (inputs[x][y] === "A") {
        const tlbr =
          (inputs[x - 1][y - 1] === "M" && inputs[x + 1][y + 1] === "S") ||
          (inputs[x - 1][y - 1] === "S" && inputs[x + 1][y + 1] === "M");
        const trbl =
          (inputs[x - 1][y + 1] === "M" && inputs[x + 1][y - 1] === "S") ||
          (inputs[x - 1][y + 1] === "S" && inputs[x + 1][y - 1] === "M");
        if (tlbr && trbl) count ++;
      }
    }
  }

  return count;
}

run(__filename, solve, { testsOnly: true });
