export function flatten<T>(arrayOfArrays: T[][]): T[] {
  return arrayOfArrays.reduce((res, arr) => res.concat(arr), [])
}