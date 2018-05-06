function checkFaceSize(faceSize: number) {
  if (faceSize === 105 || faceSize === 150)
    return

  console.log(`unknown face_size '${faceSize}', expected one of: (105 | 150)`)
  throw new Error(`unknown face_size '${faceSize}'`)
}

function checkNumTrainingFaces(numSamples: number) {
  if (numSamples > 0)
    return

  console.log(`invalid num_samples '${numSamples}', expected num_samples to be a positive integer`)
  throw new Error(`invalid num_samples '${numSamples}'`)
}

export function validateRequiredArgs(faceSize: number, numSamples: number) {
  checkFaceSize(faceSize)
  checkNumTrainingFaces(numSamples)
}

export function argOrDefault(arg: any, defaultValue: any, transformArg: (arg: any) => any = () => arg) {
  return arg === undefined ? defaultValue : transformArg(arg)
}