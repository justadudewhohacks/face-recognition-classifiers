import { DataSet } from './DataSet';
import { ClassificationResult, Data, IClassifier } from './types';

export class EuclideanDistanceClassifier implements IClassifier {
  descriptorsByClass: DataSet[]

  constructor(descriptorsByClass: DataSet[]) {
    this.descriptorsByClass = descriptorsByClass
  }

  euclideanDistance(desc1: number[], desc2: number[]): number {
    return Math.sqrt(
      desc1
        .map((val, i) => val - desc2[i])
        .reduce((res, diff) => res + Math.pow(diff, 2), 0)
    )
  }

  computeMeanDistance(descriptors: number[][], queryDesc: number[]): number {
    return descriptors
      .reduce((res, desc) => res + this.euclideanDistance(desc, queryDesc), 0)
      / descriptors.length
  }

  runClassification(desc: Data): ClassificationResult {
    const results = this.descriptorsByClass.map(
      ({ className, data }) => ({
        className,
        distance: this.computeMeanDistance(data, desc)
      })
    )
    return results.reduce((res, curr) => curr.distance < res.distance ? curr : res)
  }
}