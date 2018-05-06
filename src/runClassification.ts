import { readTestDataSets } from './fileHandling';
import { IClassifier } from './types';

export type RunClassificationOptions = {
  faceSize: number
  numTrainFaces: number
  isLogSingleResults?: boolean
}

export function runClassification(classifier: IClassifier, opts: RunClassificationOptions) {

  const {
    faceSize,
    numTrainFaces,
    isLogSingleResults = false
  } = opts

  const testDataSets = readTestDataSets(faceSize, numTrainFaces)

  const results = testDataSets.map(
    testDataSet => ({
      className: testDataSet.className,
      numWrongClassifications: 0,
      numTestData: testDataSet.data.length
    })
  )

  const timestamps: number[] = []

  testDataSets.forEach(
    (testDataSet) => testDataSet.data.forEach((desc) => {
      const { className } = testDataSet

      const ts = Date.now()
      const result = classifier.runClassification(desc)
      timestamps.push(Date.now() - ts)

      if (isLogSingleResults) {
        console.log(className, result.className, result.probability || result.distance)
      }

      if (className !== result.className) {
        const curr = results.find(res => res.className === className)
        if (!curr) {
          throw new Error(`testDataSets does not contain className '${className}'`)
        }
        curr.numWrongClassifications = curr.numWrongClassifications + 1

        if (isLogSingleResults) {
          console.log(`wrong classification result for className '${className}': ${result.className} (${result.probability || result.distance})`)
        }
      }
    })
  )

  const toPercentage = (val: number) => `${Math.floor((val) * 10000) / 100}%`

  console.log()
  console.log('result:')
  console.log('----------')
  console.log()
  console.log('%s - training samples per class', numTrainFaces)
  console.log('%s - face image size', faceSize)
  console.log()

  results.forEach((res) => {
    const { className, numWrongClassifications, numTestData } = res
    const numRecognized = numTestData - numWrongClassifications
    console.log(`${className}: ${toPercentage(numRecognized / numTestData)} of faces recognized, ${numRecognized} of ${numTestData}`)
  })

  const percRecognizedTotal = results.map(res => ((res.numTestData - res.numWrongClassifications) / res.numTestData))
    .reduce((sum, curr) => sum + (curr || 0), 0)
    / results.length

  console.log()
  console.log(`${toPercentage(percRecognizedTotal)} of faces recognized`)
  console.log()

  const timeTotal = timestamps.reduce((sum, t) => sum + t, 0)
  console.log('total classification time: %s ms', timeTotal)
  console.log('average classification time: %s ms', timeTotal / timestamps.length)

  console.log()
  console.log('----------')

}