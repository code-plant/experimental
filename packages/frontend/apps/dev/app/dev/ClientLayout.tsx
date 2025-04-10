import {
  ThemeContextConfig,
  ThemeProvider,
} from "@this-project/frontend-components-base/ThemeProvider";
import { PropsWithChildren } from "react";

const CONFIG: ThemeContextConfig = { modalZIndex: 42 };

export function ClientLayout({ children }: PropsWithChildren) {
  return <ThemeProvider config={CONFIG}>{children}</ThemeProvider>;
}
