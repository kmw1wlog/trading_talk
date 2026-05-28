export function hashString(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function seededNumber(seed: string, min: number, max: number) {
  const hash = hashString(seed);
  const ratio = (hash % 1000) / 1000;
  return min + (max - min) * ratio;
}
