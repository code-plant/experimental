"use client";

import { ModalOverlayContext } from "@this-project/frontend-components-base/ModalOverlayProvider";
import { default as NextLink } from "next/link";
import {
  CSSProperties,
  HTMLAttributeAnchorTarget,
  PropsWithChildren,
  useContext,
} from "react";

export interface LinkBaseProps extends PropsWithChildren {
  style?: CSSProperties;
  className?: string;
  href: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  target?: HTMLAttributeAnchorTarget;
}

export interface LinkProps extends LinkBaseProps {
  external?: boolean;
}

export function Link(props: LinkProps) {
  const { isTop } = useContext(ModalOverlayContext);
  const { external, ...rest } = props;

  const Component = external ? ExternalLinkComponent : NextLink;

  return (
    <Component {...rest} tabIndex={isTop ? 0 : -1}>
      {rest.children}
    </Component>
  );
}

function ExternalLinkComponent({ ...rest }: LinkBaseProps) {
  return <a {...rest} />;
}
