"use client";

import { PropsWithChildren, useMemo } from "react";

import { ThemeContext, ThemeContextType } from ".";

export interface ThemeContextConfig {
  modalZIndex: number;
}

function useTheme(config: ThemeContextConfig): ThemeContextType {
  return useMemo(
    () => ({ container: globalThis.document?.body, ...config }),
    [config]
  );
}

export interface ThemeProviderProps extends PropsWithChildren {
  config: ThemeContextConfig;
}

export function ThemeProvider({ children, config }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={useTheme(config)}>
      {children}
    </ThemeContext.Provider>
  );
}
