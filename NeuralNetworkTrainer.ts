import { DataSet } from './DataSet';
import { ITrainer } from './types';
import { flatten } from './utils';

const brain = require('brain.js')

export class NeuralNetworkTrainer implements ITrainer {
  net: any

  constructor() {
    this.net = new brain.NeuralNetwork()
  }

  train(trainingSets: DataSet[]): any {
    const trainData = flatten(
      trainingSets.map(trainDataForClass =>
        trainDataForClass.data.map(
          descriptors => ({
            input: descriptors,
            output: { [trainDataForClass.className]: 1 }
          })
        )
      )
    )

    const trainOpts = {
      errorThresh: 0.001,
      log: true,
      learningRate: 0.05,
      momentum: 0.05
    }

    this.net.train(trainData, trainOpts)

    return this.net.toJSON()
  }
}