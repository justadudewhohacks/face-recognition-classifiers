import * as cmd from 'commander';

import { argOrDefault, validateRequiredArgs } from './src/cmdUtils';
import { existsModelFile, readModelFile, readTrainDataSets, saveModelFile } from './src/fileHandling';
import { NeuralNetworkClassifier } from './src/NeuralNetworkClassifier';
import { NeuralNetworkTrainer } from './src/NeuralNetworkTrainer';
import { runClassification } from './src/runClassification';
import { getModelFilename } from './src/utils';

cmd
  .option('-f, --face_size <n>', 'face image size. (105 | 150)', parseInt)
  .option('-n, --num_samples <n>', 'number of training samples used per class', parseInt)
  .option('-L, --log', 'Log individual classifcation results')
  .option('-e, --error_threshold <n>', 'error threshold (training parameter)', parseFloat)
  .option('-r, --learning_rate <n>', 'learning rate (training parameter)', parseFloat)
  .option('-m, --momentum <n>', 'momentum (training parameter)', parseFloat)
  .option('-a, --activation <n>', 'activation function sigmoid: | relu | leaky-relu | tanh')
  .option('-l, --hidden_layers <n>', 'number and sizes of hidden layers (array of numbers), example: 128,90,60')
  .parse(process.argv)

validateRequiredArgs(cmd.face_size, cmd.num_samples)

const errorThresh = argOrDefault(cmd.error_threshold, 0.001)
const learningRate = argOrDefault(cmd.learning_rate, 0.01)
const momentum = argOrDefault(cmd.momentum, 0.05)
const activation = argOrDefault(cmd.activation, 'sigmoid')
const hiddenLayers: number[] = argOrDefault(cmd.hidden_layers, [], (layers: string) => layers.split(',').map(l => parseInt(l)))

console.log()
console.log('face size:', cmd.face_size)
console.log('number of training samples:', cmd.num_samples)
console.log('error threshold:', errorThresh)
console.log('learning rate:', learningRate)
console.log('momentum:', momentum)
console.log('activation:', activation)
console.log('hiddenLayers:', hiddenLayers)
console.log()

const layersSuffix = hiddenLayers.length ? `__${hiddenLayers.join('_')}` : ''
const modelParamsSuffix = `__e_${errorThresh}__r_${learningRate}__m_${momentum}__a_${activation}${layersSuffix}`
const modelFileName = getModelFilename('net', cmd.face_size, cmd.num_samples, modelParamsSuffix, '.json')

const opts = {
  hiddenLayers,
  activation,
  binaryThresh: 0.5
}

const trainOpts = {
  errorThresh,
  learningRate,
  momentum,
  log: true
}


if (!existsModelFile(modelFileName)) {
  console.log('model file does not exists:', modelFileName)
  console.log('training...')

  const trainer = new NeuralNetworkTrainer(opts)
  const trainDataSets = readTrainDataSets(cmd.face_size, cmd.num_samples)
  console.time('training time')
  const trainedModel = trainer.train(trainDataSets, trainOpts)
  console.timeEnd('training time')
  console.log()

  saveModelFile(modelFileName, JSON.stringify(trainedModel))
} else {
  console.log('found model file:', modelFileName)
}

const classifier = new NeuralNetworkClassifier(JSON.parse(readModelFile(modelFileName).toString()))

runClassification(classifier, { faceSize: cmd.face_size, numTrainFaces: cmd.num_samples, isLogSingleResults: cmd.log })