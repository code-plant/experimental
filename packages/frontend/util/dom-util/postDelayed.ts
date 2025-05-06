import { Cleanup } from "@this-project/util-types-common";

export function postDelayed(func: () => unknown, timeInMs: number): Cleanup {
  const timeout = setTimeout(func, timeInMs);
  return () => clearTimeout(timeout);
}
