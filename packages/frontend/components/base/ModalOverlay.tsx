import { postDelayed } from "@this-project/frontend-util-dom-util/postDelayed";
import { stopPropagation } from "@this-project/frontend-util-react-util/stopPropagation";
import { useAsyncState } from "@this-project/frontend-util-react-util/useAsyncState";
import { useCallbackRef } from "@this-project/frontend-util-react-util/useCallbackRef";
import {
  CSSProperties,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { ThemeContext } from ".";
import {
  ModalOverlayContext,
  ModalOverlayContextType,
} from "./ModalOverlayProvider";

export interface ModalOverlayProps extends PropsWithChildren {
  open: boolean;
  className?: string;
  style?: CSSProperties;
  background?: string;
}

interface ModalOverlayInternalProviderProps extends PropsWithChildren {
  isTop: boolean;
  parent: EventTarget;
}

function ModalOverlayInternalProvider({
  isTop,
  parent,
  children,
}: ModalOverlayInternalProviderProps) {
  const { add } = useContext(ModalOverlayContext);
  const contextValue: ModalOverlayContextType = useMemo(
    () => ({ add, parent, isTop }),
    [add, parent, isTop]
  );

  return (
    <ModalOverlayContext.Provider value={contextValue}>
      {children}
    </ModalOverlayContext.Provider>
  );
}

export function ModalOverlay({
  children,
  open,
  className,
  style,
  background = "#000000C0",
}: ModalOverlayProps) {
  const { modalZIndex, container } = useContext(ThemeContext);
  const { add } = useContext(ModalOverlayContext);
  const [isTop, setIsTop] = useAsyncState(false);
  const [ref, element] = useCallbackRef<HTMLDivElement>();

  useLayoutEffect(() => {
    if (!open) return;
    const [watchTarget, cleanup] = add();
    const cleanupWatch = watchTarget.watch(({ isTop }) => {
      postDelayed(() => setIsTop(isTop), 0);
    });
    return () => {
      cleanup();
      cleanupWatch();
    };
  }, [open, add, setIsTop]);

  const overflow = isTop ? "auto" : "hidden";
  return (
    window &&
    createPortal(
      open && (
        <div
          ref={ref}
          style={{
            pointerEvents: "auto",
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            zIndex: modalZIndex,
            maxWidth: "100%",
            maxHeight: "100%",
            overflowX: overflow,
            overflowY: overflow,
            background,
          }}
          onClick={stopPropagation}
        >
          {element && (
            <ModalOverlayInternalProvider isTop={isTop} parent={element}>
              {open ? (
                <div className={className} style={style}>
                  {children}
                </div>
              ) : null}
            </ModalOverlayInternalProvider>
          )}
        </div>
      ),
      container
    )
  );
}
