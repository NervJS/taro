import { TransformResult } from '@tarojs/transformer-wx'

export interface IComponentObj {
  name?: string,
  path: string | null,
  type?: string
}

export interface IIsFileToBeTaroComponentReturn {
  isTaroComponent: boolean,
  transformResult: TransformResult
}

export interface IBuildResult {
  js: string,
  wxss: string,
  wxml: string
}

export interface IDependency {
  style: string[],
  script: string[],
  json: string[],
  media: string[]
}
