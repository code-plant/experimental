import { isPrintable } from "./char/isPrintable";

export function nonPrintableChars(input: string): undefined | string[] {
  const result = new Set<string>();
  input.split("").forEach((char) => {
    if (!isPrintable(char)) {
      result.add(char);
    }
  });
  if (result.size) {
    return [...result];
  }
  return undefined;
}
