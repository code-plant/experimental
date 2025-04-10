import { useState } from "react";

export function useCallbackRef<T>(): [
  ref: (value: T | null) => void,
  value: T | null
] {
  const [value, ref] = useState<T | null>(null);
  return [ref, value];
}
