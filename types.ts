import { DataSet } from './DataSet';

export type Data = number[]

export type ClassificationResult = {
  className: string
  probability: number
}

export interface ITrainer {
  train: (trainingSets: DataSet[]) => any
}

export interface IClassifier {
  runClassification: (desc: Data) => ClassificationResult
}