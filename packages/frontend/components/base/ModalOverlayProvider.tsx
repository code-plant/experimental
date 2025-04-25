"use client";

import { Cleanup } from "@this-project/util-common-types";
import { Disposer } from "@this-project/util-common-util/Disposer";
import {
  watchTarget,
  WatchTarget,
} from "@this-project/util-common-util/watchTarget";
import {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ModalOverlayComponentProps<T> {
  resolve(value: T): void;
  reject(reason?: any): void;
}

export interface ModalOverlayWatchTarget {
  count: number | undefined;
  isTop: boolean;
}

export interface ModalOverlayContextType {
  isTop: boolean;
  parent: EventTarget;
  add(): readonly [
    watchTarget: WatchTarget<ModalOverlayWatchTarget>,
    cleanup: Cleanup
  ];
}

export const ModalOverlayContext = createContext<ModalOverlayContextType>({
  isTop: true,
  parent: window,
  add: () => {
    throw new Error("top level");
  },
});

interface ModalOverlayProviderState {
  count: number;
  stack: WatchTarget<ModalOverlayWatchTarget>[];
}

export interface ModalOverlayProviderProps extends PropsWithChildren {
  enableHorizontalScroll?: boolean;
}

export const ModalOverlayProvider = memo(function OverlayProvider({
  children,
  enableHorizontalScroll,
}: ModalOverlayProviderProps) {
  const [state, setState] = useState<ModalOverlayProviderState>({
    count: 0,
    stack: [],
  });

  const add = useCallback(() => {
    let cancelled = false;
    const watch = watchTarget<ModalOverlayWatchTarget>({
      count: undefined,
      isTop: false,
    });
    setState((oldState) => {
      if (cancelled) return oldState;
      const { count, stack } = oldState;
      const newCount = count + 1;
      watch.set({ count: newCount, isTop: true });
      const last = stack[stack.length - 1];
      last?.set({ count: last.get().count, isTop: false });
      return {
        count: newCount,
        stack: [...stack, watch],
      };
    });
    const cleanup = () =>
      setState(({ count, stack }) => {
        cancelled = true;
        const removed = stack.filter(
          (x) => x.get().count !== watch.get().count
        );
        const last = removed[removed.length - 1];
        if (!last?.get().isTop) {
          last?.set({ count: last.get().count, isTop: true });
        }
        return {
          count,
          stack: removed,
        };
      });
    return [watch, cleanup] as const;
  }, [setState]);

  const isTop = state.stack.length === 0;

  const value = useMemo(() => ({ isTop, parent: window, add }), [isTop, add]);

  useEffect(() => {
    const disposer = new Disposer();
    if (isTop) {
      const previousOverflowY = document.body.style.overflowY;
      document.body.style.overflowY = "auto";
      disposer.add(() => {
        document.body.style.overflowY = previousOverflowY;
      });
      if (enableHorizontalScroll) {
        const previousOverflowX = document.body.style.overflowX;
        document.body.style.overflowX = "auto";
        disposer.add(() => {
          document.body.style.overflowX = previousOverflowX;
        });
      }
    } else {
      const previousOverflowY = document.body.style.overflowY;
      document.body.style.overflowY = "hidden";
      disposer.add(() => {
        document.body.style.overflowY = previousOverflowY;
      });
      if (enableHorizontalScroll) {
        const previousOverflowX = document.body.style.overflowX;
        document.body.style.overflowX = "hidden";
        disposer.add(() => {
          document.body.style.overflowX = previousOverflowX;
        });
      }
    }
    return disposer.disposable();
  }, [isTop]);

  return (
    <ModalOverlayContext.Provider value={value}>
      {children}
    </ModalOverlayContext.Provider>
  );
});
