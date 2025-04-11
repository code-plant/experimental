export interface ThemeBase {
  color: Partial<Record<string, [light: string, dark: string]>>;
}
