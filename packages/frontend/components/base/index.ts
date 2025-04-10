import { createContext } from "react";

export interface ThemeContextType {
  modalZIndex: number;
  container: HTMLElement;
}

export const ThemeContext = createContext<ThemeContextType>(undefined as any);
