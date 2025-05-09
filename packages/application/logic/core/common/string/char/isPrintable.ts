const re = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]$/;

export function isPrintable(char: string): boolean {
  // TODO: implement it
  return re.exec(char) !== null;
}
