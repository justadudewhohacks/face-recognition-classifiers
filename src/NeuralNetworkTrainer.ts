import { DataSet } from './DataSet';
import { ITrainer } from './types';
import { flatten } from './utils';

const brain = require('brain.js')

export class NeuralNetworkTrainer implements ITrainer {
  net: any

  constructor(opts: any) {
    this.net = new brain.NeuralNetwork(opts)
  }

  train(trainingSets: DataSet[], trainOpts: any = {}): any {
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

    this.net.train(trainData, trainOpts)

    return this.net.toJSON()
  }
}