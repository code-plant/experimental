import { CSSProperties, PropsWithChildren, useContext } from "react";
import { createPortal } from "react-dom";
import { ThemeContext } from ".";

export interface ModelessOverlayProps extends PropsWithChildren {
  open: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ModelessOverlay({
  children,
  open,
  className,
  style,
}: ModelessOverlayProps) {
  const { container } = useContext(ThemeContext);

  return (
    window &&
    createPortal(
      open ? (
        <div className={className} style={style}>
          {children}
        </div>
      ) : null,
      container
    )
  );
}
