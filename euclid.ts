import * as cmd from 'commander';

import { validateRequiredArgs } from './src/cmdUtils';
import { EuclideanDistanceClassifier } from './src/EuclideanDistanceClassifier';
import { readTrainDataSets } from './src/fileHandling';
import { runClassification } from './src/runClassification';

cmd
  .option('-f, --face_size <n>', 'face image size. (105 | 150)', parseInt)
  .option('-n, --num_samples <n>', 'number of training samples used per class', parseInt)
  .option('-L, --log', 'Log individual classifcation results')
  .parse(process.argv)

validateRequiredArgs(cmd.face_size, cmd.num_samples)

console.log()
console.log('face size:', cmd.face_size)
console.log('number of training samples:', cmd.num_samples)
console.log()

const classifier = new EuclideanDistanceClassifier(readTrainDataSets(cmd.face_size, cmd.num_samples))

runClassification(classifier, { faceSize: cmd.face_size, numTrainFaces: cmd.num_samples, isLogSingleResults: cmd.log })