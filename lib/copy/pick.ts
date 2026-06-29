// Pick a random element from a non-empty array. Pure, usable anywhere (server or
// client). UI copy is stored as arrays of phrasings so it varies per visit; this
// is how a variant is chosen. See useVariant for the React-stable version.
export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
