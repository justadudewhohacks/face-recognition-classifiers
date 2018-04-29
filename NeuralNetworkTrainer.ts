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
    this.net.train(trainData)

    return this.net.toJSON()
  }
}