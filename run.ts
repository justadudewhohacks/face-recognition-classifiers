import { existsModelFile, readModelFile, readTestDataSets, readTrainDataSets, saveModelFile } from './fileHandling';
import { NeuralNetworkClassifier } from './NeuralNetworkClassifier';
import { NeuralNetworkTrainer } from './NeuralNetworkTrainer';
import { IClassifier, ITrainer } from './types';

const ARG_FACE_SIZE = 1
const ARG_NUM_TRAIN_FACES = 2
const ARG_CLASSIFIER_TYPE = 3
const ARG_LOG_SINGLE_CLASSIFICATION_RESULTS = 4

const FACE_SIZE = parseInt(process.argv[ARG_FACE_SIZE + 1])
const NUM_TRAIN_FACES = parseInt(process.argv[ARG_NUM_TRAIN_FACES + 1])
const CLASSIFIER_TYPE = process.argv[ARG_CLASSIFIER_TYPE + 1]
const LOG_SINGLE_CLASSIFICATION_RESULTS = process.argv[ARG_LOG_SINGLE_CLASSIFICATION_RESULTS + 1] === '1'

checkFaceSize()
checkNumTrainingFaces()
checkClassifierType()

console.log('face size: ', FACE_SIZE)
console.log('num training samples: ', NUM_TRAIN_FACES)
console.log('classifier type: ', CLASSIFIER_TYPE)

function checkFaceSize() {
  if (FACE_SIZE === 105 || FACE_SIZE === 150)
    return

  console.log(`unknown face size '${FACE_SIZE}', expected argument ${ARG_NUM_TRAIN_FACES} to be one of:`)
  console.log(`105`)
  console.log(`150`)
  throw new Error(`unknown face size '${FACE_SIZE}'`)
}

function checkNumTrainingFaces() {
  if (NUM_TRAIN_FACES > 0)
    return

  console.log(`invalid num training samples '${NUM_TRAIN_FACES}', expected argument ${ARG_NUM_TRAIN_FACES} to be a positive integer`)
  throw new Error(`invalid num training samples '${NUM_TRAIN_FACES}'`)
}

function checkClassifierType() {
  if (['dist', 'svm', 'net'].some(type => type === CLASSIFIER_TYPE))
    return

  console.log(`unknown classifier type '${CLASSIFIER_TYPE}', expected argument ${ARG_CLASSIFIER_TYPE} to be one of:`)
  console.log(`dist - euclidean distance classifier`)
  console.log(`svm - SVM classifier`)
  console.log(`net - brain.NeuralNetwork classifier`)
  throw new Error(`unknown classifier type '${CLASSIFIER_TYPE}'`)
}

function getModelFilePrefix(): string {
  if (CLASSIFIER_TYPE === 'net') {
    return 'netmodel'
  } else {
    throw new Error(`unknown classifier type '${CLASSIFIER_TYPE}'`)
  }
}

function getModelFilename(): string {
  return `${getModelFilePrefix()}_faceSize_${FACE_SIZE}_numTrainFaces_${NUM_TRAIN_FACES}.json`
}

function getTrainer(): ITrainer {
  if (CLASSIFIER_TYPE === 'net') {
    return new NeuralNetworkTrainer()
  } else {
    throw new Error(`unknown classifier type '${CLASSIFIER_TYPE}'`)
  }
}

function getClassifier(): IClassifier {
  if (CLASSIFIER_TYPE === 'net') {
    return new NeuralNetworkClassifier(JSON.parse(readModelFile(getModelFilename()).toString()))
  } else {
    throw new Error(`unknown classifier type '${CLASSIFIER_TYPE}'`)
  }
}

if (!existsModelFile(getModelFilename())) {
  console.log(`model file does not exists for face size '${FACE_SIZE}', num training samples '${NUM_TRAIN_FACES}'`)
  console.log(`training...`)

  const trainer = getTrainer()
  const trainDataSets = readTrainDataSets(FACE_SIZE, NUM_TRAIN_FACES)
  console.time('training time')
  const trainedModel = trainer.train(trainDataSets)
  console.timeEnd('training time')
  console.log()

  saveModelFile(getModelFilename(), JSON.stringify(trainedModel))
}

const classifier = getClassifier()
const testDataSets = readTestDataSets(FACE_SIZE, NUM_TRAIN_FACES)

const results = testDataSets.map(
  testDataSet => ({
    className: testDataSet.className,
    numWrongClassifications: 0,
    numTestData: testDataSet.data.length
  })
)

testDataSets.forEach(
  (testDataSet) => testDataSet.data.forEach((desc) => {
    const { className } = testDataSet
    const result = classifier.runClassification(desc)

    if (LOG_SINGLE_CLASSIFICATION_RESULTS) {
      console.log(className, result.className, result.probability)
    }

    if (className !== result.className) {
      const curr = results.find(res => res.className === className)
      if (!curr) {
        throw new Error(`testDataSets does not contain className '${className}'`)
      }
      curr.numWrongClassifications = curr.numWrongClassifications + 1

      if (LOG_SINGLE_CLASSIFICATION_RESULTS) {
        console.log(`wrong classification result for className '${className}': ${result.className} (${result.probability})`)
      }
    }
  })
)

console.log()
console.log('result:')
console.log('----------')
console.log()
console.log('%s - training samples per class', NUM_TRAIN_FACES)
console.log('%s - face image size', FACE_SIZE)
console.log()

results.forEach((res) => {
  const { className, numWrongClassifications, numTestData } = res
  const numRecognized = numTestData - numWrongClassifications
  console.log(`${className}: ${Math.floor((numRecognized / numTestData) * 10000) / 100}% of faces recognized, ${numRecognized} of ${numTestData}`)
})

console.log()
console.log('----------')