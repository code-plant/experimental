import { GUCClass } from "../types/GUCClass";

export function stringToGUCClass(string: string): GUCClass {
  const [className, ...variants] = string.split(":").reverse();
  return {
    className,
    variants,
  };
}
