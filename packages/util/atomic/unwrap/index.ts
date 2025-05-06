import { Result } from "@this-project/util-types-common";

export class UnwrapError<E> extends Error {
  constructor(public readonly error: E) {
    super(error?.toString?.() ?? String(error));
  }
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.type === "ok") {
    return result.value;
  }
  throw new UnwrapError(result.error);
}
