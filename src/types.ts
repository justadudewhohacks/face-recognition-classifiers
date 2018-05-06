import { DataSet } from './DataSet';

export type Data = number[]

export type ClassificationResult = {
  className: string
  probability?: number
  distance?: number
}

export interface ITrainer {
  train: (trainingSets: DataSet[], trainOpts?: any) => any
}

export interface IClassifier {
  runClassification: (desc: Data) => ClassificationResult
}