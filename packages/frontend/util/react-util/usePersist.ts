import { useRef } from "react";

export interface UsePersist<T> {
  current: T;
}

export function usePersist<T>(): UsePersist<T | undefined>;
export function usePersist<T>(
  defaultValue: (() => T) | (T extends (...args: any[]) => any ? never : T)
): UsePersist<T>;
export function usePersist<T>(
  defaultValue?: (() => T) | (T extends (...args: any[]) => any ? never : T)
) {
  const result: UsePersist<[UsePersist<T>?]> = useRef([]);
  if (!result.current[0])
    result.current = [
      {
        current:
          defaultValue instanceof Function
            ? defaultValue()
            : (defaultValue as T),
      },
    ];
  return result.current[0]!;
}
