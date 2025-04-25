export type Result<T, E = string> =
  | { type: "ok"; value: T }
  | { type: "error"; error: E };

export type ResultError<E = string> = { type: "error"; error: E };

export type ResultOk<T> = { type: "ok"; value: T };
