import { Cleanup } from "@this-project/common-util-types";

export function postDelayed(func: () => unknown, timeInMs: number): Cleanup {
  const timeout = setTimeout(func, timeInMs);
  return () => clearTimeout(timeout);
}
