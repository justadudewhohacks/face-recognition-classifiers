import * as cmd from 'commander';

import { validateRequiredArgs, argOrDefault } from './src/cmdUtils';
import {
  ensureModelDir,
  existsModelFile,
  getModelFilepath,
  readModelFile,
  readTrainDataSets,
  saveModelFile,
} from './src/fileHandling';
import { runClassification } from './src/runClassification';
import { SVMClassifier } from './src/SVMClassifier';
import { SVMTrainer } from './src/SVMTrainer';
import { getModelFilename } from './src/utils';

const kernelTypes = [
  'RBF',
  'LINEAR',
  'SIGMOID',
  'CHI2',
  'INTER'
]

cmd
  .option('-f, --face_size <n>', 'face image size. (105 | 150)', parseInt)
  .option('-n, --num_samples <n>', 'number of training samples used per class', parseInt)
  .option('-a, --train_auto', 'use OpenCV trainAuto to figure out SVM parameters automatically')
  .option('-k, --kernel_type <n>', `kernel type (${kernelTypes.join(' | ')})`)
  .option('-c, --c <n>', 'c (training parameter)', parseFloat)
  .option('-g, --gamma <n>', 'gamma (training parameter)', parseFloat)
  .parse(process.argv)

validateRequiredArgs(cmd.face_size, cmd.num_samples)

const kernelType = argOrDefault(cmd.kernel_type, 'RBF', (kernelType: string) => {
  if (!kernelTypes.some(t => t === kernelType)) {
    console.log(`unkown kernel_type ${kernelType}, expected one of: ${kernelTypes.join(' | ')}`)
    throw new Error(`unkown kernel_type ${kernelType}`)
  }
  return kernelType
})
const c = argOrDefault(cmd.c, 12.5)
const gamma = argOrDefault(cmd.gamma, 5.0625)

console.log()
console.log('face size:', cmd.face_size)
console.log('number of training samples:', cmd.num_samples)
console.log('train auto:', cmd.train_auto ? 'yes' : 'no')
console.log('kernel type:', kernelType)
console.log('c:', c)
console.log('gamma:', gamma)
console.log()

const modelParamsSuffix = `${cmd.train_auto ? '__auto' : `__k_${kernelType}__c_${c}__g_${gamma}`}`
const modelFileName = getModelFilename('svm', cmd.face_size, cmd.num_samples, modelParamsSuffix, '.xml')

const opts = {
  kernelType,
  c,
  gamma
}

if (!existsModelFile(modelFileName)) {
  console.log('model file does not exists:', modelFileName)
  console.log('training...')

  const trainer = new SVMTrainer(opts)
  const trainDataSets = readTrainDataSets(cmd.face_size, cmd.num_samples)
  console.time('training time')
  const { saveFunction, classNames } = trainer.train(trainDataSets, { trainAuto: cmd.train_auto })
  console.timeEnd('training time')
  console.log()

  ensureModelDir()
  saveFunction(getModelFilepath(modelFileName))
  saveModelFile('classNames.json', JSON.stringify(classNames))
} else {
  console.log('found model file:', modelFileName)
}

const classifier = new SVMClassifier(
  getModelFilepath(modelFileName),
  JSON.parse(readModelFile('classNames.json').toString())
)

runClassification(classifier, { faceSize: cmd.face_size, numTrainFaces: cmd.num_samples, isLogSingleResults: cmd.log })