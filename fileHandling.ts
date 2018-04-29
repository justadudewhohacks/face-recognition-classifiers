import * as fs from 'fs';
import * as path from 'path';

import { DataSet } from './DataSet';

type PickDataFuncton = (descriptorFiles: string[]) => string[]

function readDescriptors(classDir: string, pickData: PickDataFuncton): number[][] {
  return pickData(fs.readdirSync(classDir))
    .map(descriptorFile => path.resolve(classDir, descriptorFile))
    .map(filepath => JSON.parse(fs.readFileSync(filepath).toString()))
}

function readDataSet(faceSize: number, pickData: PickDataFuncton): DataSet[] {
  const inputDir = path.resolve(__dirname, `data/${faceSize}x${faceSize}/descriptors`)
  const classNames = fs.readdirSync(inputDir) as string[]

  return classNames.map(className =>
    new DataSet(
      className,
      readDescriptors(path.resolve(inputDir, className), pickData)
    )
  )
}

export function readTrainDataSets(faceSize: number, numTrainData: number): DataSet[] {
  return readDataSet(faceSize, files => files.slice(0, numTrainData))
}

export function readTestDataSets(faceSize: number, numTrainData: number): DataSet[] {
  return readDataSet(faceSize, files => files.slice(numTrainData))
}

function getModelFilepath(filename: string): string {
  return path.resolve(__dirname, 'models', filename)
}

export function saveModelFile(filename: string, data: Buffer | string) {
  fs.writeFileSync(getModelFilepath(filename), data)
}

export function readModelFile(filename: string): Buffer | string {
  return fs.readFileSync(getModelFilepath(filename))
}

export function existsModelFile(filename: string): boolean {
  return fs.existsSync(getModelFilepath(filename))
}