import * as fs from 'fs';
import * as path from 'path';

import { DataSet } from './DataSet';

type PickDataFuncton = (descriptorFiles: string[]) => string[]

function readDescriptors(classDir: string, pickData: PickDataFuncton): number[][] {
  return pickData(fs.readdirSync(classDir))
    .map(descriptorFile => path.resolve(classDir, descriptorFile))
    .map(filepath => JSON.parse(fs.readFileSync(filepath).toString()))
}

function getDescriptorsDir(faceSize: number) {
  return path.resolve(__dirname, `../data/${faceSize}x${faceSize}/descriptors`)
}

function readDataSet(faceSize: number, pickData: PickDataFuncton): DataSet[] {
  const inputDir = getDescriptorsDir(faceSize)
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

function getModelsDirpath(): string {
  return path.resolve(__dirname, '../models')
}

export function getModelFilepath(filename: string): string {
  return path.resolve(getModelsDirpath(), filename)
}

export function ensureModelDir() {
  if (!fs.existsSync(getModelsDirpath())) {
    fs.mkdirSync(getModelsDirpath())
  }
}

export function saveModelFile(filename: string, data: Buffer | string) {
  ensureModelDir()
  fs.writeFileSync(getModelFilepath(filename), data)
}

export function readModelFile(filename: string): Buffer | string {
  return fs.readFileSync(getModelFilepath(filename))
}

export function existsModelFile(filename: string): boolean {
  return fs.existsSync(getModelFilepath(filename))
}

export function getFullDataSetSize(faceSize: number) {
  const inputDir = getDescriptorsDir(faceSize)
  return fs.readdirSync(inputDir)
    .map(className => fs.readdirSync(path.resolve(inputDir, className)))
    .reduce((res, filesByClass) => res + filesByClass.length, 0)
}

export function getDataSetSizesByClass(faceSize: number) {
  const inputDir = getDescriptorsDir(faceSize)
  return fs.readdirSync(inputDir)
    .map(className => ({ className, size: fs.readdirSync(path.resolve(inputDir, className)).length }))
    .sort((s1, s2) => s1.size - s2.size)
}

export function getNumClasses(faceSize: number) {
  return fs.readdirSync(getDescriptorsDir(faceSize)).length
}