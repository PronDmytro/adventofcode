import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number): Promise<number | string> {
  const pairs = buildConnections(inputs);
  const connectionsResult: Set<string> = new Set();

  for (const [currentNode, connectedNodes] of pairs.entries()) {
    for (const neighbor of connectedNodes) {
      const connectionGroup: Set<string> = new Set([currentNode, neighbor]);
      for (const potentialConnection of connectedNodes) {
        if (part === 1 && isConnected(currentNode, neighbor, potentialConnection, pairs)) {
          addConnectionToSet(connectionsResult, [currentNode, neighbor, potentialConnection]);
        } else if ([...connectionGroup].every(node => pairs.get(node)?.has(potentialConnection))) {
          connectionGroup.add(potentialConnection);
        }
      }

      if (part === 2) {
        addConnectionToSet(connectionsResult, [...connectionGroup]);
      }
    }
  }

  return part === 1 ? connectionsResult.size : findLongestConnection(connectionsResult);
}

function addConnectionToSet(connectionsResult: Set<string>, connection: string[]): void {
  const sortStrings = (a: string, b: string): number => (a < b ? -1 : 1);
  connectionsResult.add(connection.sort(sortStrings).join(','));
}

function findLongestConnection(connectionsResult: Set<string>): string {
  return [...connectionsResult].reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    '',
  );
}

function buildConnections(inputs: string[]): Map<string, Set<string>> {
  const result = new Map<string, Set<string>>();
  inputs.forEach(input => {
    const [firstNode, secondNode] = input.split('-');
    addConnection(result, firstNode, secondNode);
    addConnection(result, secondNode, firstNode);
  });
  return result;
}

function addConnection(map: Map<string, Set<string>>, key: string, value: string): void {
  const connections = map.get(key) ?? new Set<string>();
  connections.add(value);
  map.set(key, connections);
}

function isConnected(node1: string, node2: string, other: string, pairs: Map<string, Set<string>>): boolean {
  const startsWithT = (node: string) => node.startsWith('t');
  return !!pairs.get(node2)?.has(other) && (startsWithT(node1) || startsWithT(node2) || startsWithT(other));
}

run(__filename, solve, { skipTests: true });
