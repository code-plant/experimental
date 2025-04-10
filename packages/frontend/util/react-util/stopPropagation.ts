import { type SyntheticEvent } from "react";

export function stopPropagation<T extends SyntheticEvent>(e: T) {
  e.stopPropagation();
}
