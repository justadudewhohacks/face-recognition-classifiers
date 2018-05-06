import * as cv from 'opencv4nodejs';

import { DataSet } from './DataSet';
import { ITrainer } from './types';
import { flatten } from './utils';

export class SVMTrainer implements ITrainer {
  svm: cv.SVM

  constructor(opts?: any) {
    const {
      kernelType,
      c,
      gamma
    } = opts

    this.svm = new cv.SVM({ c, gamma, kernelType: cv.ml.SVM[kernelType] })
  }

  train(trainingSets: DataSet[], trainOpts: any = {}): any {
    const labeledInputs = flatten(
      trainingSets.map((trainDataForClass, label) =>
        trainDataForClass.data.map(
          descriptors => ({
            input: descriptors,
            label
          })
        )
      )
    )

    const trainData = new cv.TrainData(
      new cv.Mat(labeledInputs.map(t => t.input), cv.CV_32F),
      cv.ml.ROW_SAMPLE,
      new cv.Mat([labeledInputs.map(t => t.label)], cv.CV_32S)
    )

    trainOpts.trainAuto
      ? this.svm.trainAuto(trainData)
      : this.svm.train(trainData)

    return {
      saveFunction: (filename: string) => this.svm.save(filename),
      classNames: trainingSets.map(t => t.className)
    }
  }
}