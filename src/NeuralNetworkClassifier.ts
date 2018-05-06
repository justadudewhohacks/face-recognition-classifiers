import { ClassificationResult, Data, IClassifier } from './types';


const brain = require('brain.js')

export class NeuralNetworkClassifier implements IClassifier {
  net: any

  constructor(model: any) {
    this.net = new brain.NeuralNetwork()
    this.net.fromJSON(model)
  }

  getMostProbableClass(result: any): ClassificationResult {
    return Object.keys(result)
      .map(className => ({ className, probability: result[className] }))
      .reduce((best, curr) => best.probability < curr.probability ?  curr : best)
  }

  runClassification(desc: Data): ClassificationResult {
    return this.getMostProbableClass(this.net.run(desc))
  }
}