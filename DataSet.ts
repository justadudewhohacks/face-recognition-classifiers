import { Data } from './types';

export class DataSet {
  readonly className: string
  readonly data: Data[]

  constructor(className: string, data: Data[]) {
    this.className = className
    this.data = data
  }
}