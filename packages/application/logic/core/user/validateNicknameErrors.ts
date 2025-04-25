export type ValidateNicknameError = {
  type: "too short";
};

export function validateNicknameErrors(
  input: string
): undefined | ValidateNicknameError[] {
  const result: ValidateNicknameError[] = [];

  if (input.length < 6) {
    result.push({ type: "too short" });
  }
  // TODO: add constraints

  if (result.length) {
    return result;
  }
  return undefined;
}
