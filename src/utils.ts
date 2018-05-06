export function flatten<T>(arrayOfArrays: T[][]): T[] {
  return arrayOfArrays.reduce((res, arr) => res.concat(arr), [])
}

export function getModelFilename(modelFilePrefix: string, faceSize: number, numSamples: number, suffix: string, ext: string): string {
  return `${modelFilePrefix}__f_${faceSize}__n_${numSamples}${suffix}${ext}`
}