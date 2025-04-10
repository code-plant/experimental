import { Cleanup } from "@this-project/common-util-types";

export type Watcher<T> = (value: T) => void;

export interface WatchTarget<T> {
  watch(watcher: Watcher<T>, skipInit?: boolean): Cleanup;
  get(): T;
  set(value: T): void;
}

export function watchTarget<T>(initialValue: T): WatchTarget<T> {
  let value = initialValue;

  const watchers: Watcher<T>[] = [];

  function watch(watcher: Watcher<T>, skipInit = false) {
    if (!skipInit) watcher(value);
    const wrapped = (value: T) => watcher(value);
    watchers.push(wrapped);
    return () => {
      const index = watchers.indexOf(wrapped);
      if (index !== -1) watchers.splice(index, 1);
    };
  }

  function get() {
    return value;
  }

  function set(newValue: T) {
    if (value === newValue) return;
    value = newValue;
    watchers.forEach((watcher) => watcher(value));
  }

  return { watch, get, set };
}
