/**
 * Splits an array into two parts based on a predicate function.
 * The elements that satisfy the predicate are collected in the `taken` array,
 * and the rest are collected in the `excluded` array.
 * The original array is not mutated.
 */
export function takeWhile<T>(
  arr: T[],
  predicate: (element?: T) => boolean,
): { taken: T[]; excluded: T[] } {
  let i = 0;

  while (i < arr.length && predicate(arr[i])) {
    i++;
  }

  return {
    taken: arr.slice(0, i),
    excluded: arr.slice(i),
  };
}
