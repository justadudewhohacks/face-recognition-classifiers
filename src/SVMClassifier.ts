import * as cv from 'opencv4nodejs';

import { ClassificationResult, Data, IClassifier } from './types';

export class SVMClassifier implements IClassifier {
  svm: cv.SVM
  classNames: string[]

  constructor(modelFile: string, classNames: string[]) {
    this.svm = new cv.SVM()
    this.svm.load(modelFile)
    this.classNames = classNames
  }

  runClassification(desc: Data): ClassificationResult {
    return { className: this.classNames[this.svm.predict(desc)] }
  }
}