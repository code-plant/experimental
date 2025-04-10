import { useEffect } from "react";
import { usePersist, UsePersist } from "./usePersist";

export function useUnmounted(): UsePersist<boolean> {
  const result = usePersist(false);
  useEffect(() => {
    result.current = false;
    return () => {
      result.current = true;
    };
  }, [result]);
  return result;
}
