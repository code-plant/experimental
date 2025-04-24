export function topoOrder<T>(
  input: T[],
  getDependencies: (node: T) => T[]
): T[] | null {
  interface Node {
    unresolvedDeps: Set<T>;
    value: T;
  }

  const nodes: Node[] = input.map((node) => ({
    unresolvedDeps: new Set(getDependencies(node)),
    value: node,
  }));

  const result: T[] = [];

  while (nodes.length) {
    const len = nodes.length;
    for (let i = 0; i < len; i++) {
      const node = nodes[i];
      if (node.unresolvedDeps.size == 0) {
        result.push(node.value);
        nodes.splice(i, 1);
        for (const other of nodes) {
          other.unresolvedDeps.delete(node.value);
        }
        break;
      }
    }
    if (len == nodes.length) {
      return null;
    }
  }

  return result;
}
