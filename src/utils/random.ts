export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function chance(probability: number): boolean {
  return Math.random() < probability
}
