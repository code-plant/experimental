export class EnvNotFoundError extends Error {
  constructor(public readonly key: string) {
    super(`Envuironment variable not found: ${key}`);
  }
}

export function env(key: string): string {
  const result = process.env[key];
  if (typeof result !== "string") {
    throw new EnvNotFoundError(key);
  }
  return result;
}
