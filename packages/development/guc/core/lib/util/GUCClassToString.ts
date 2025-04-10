import { GUCClass } from "../types/GUCClass";

export function GUCClassToString({ className, variants }: GUCClass): string {
  return [className, ...variants].reverse().join(":");
}
