import { IWxTransformResult } from '../util/types'

export interface IComponentObj {
  name?: string,
  path: string | null,
  type?: string
}

export interface IIsFileToBeTaroComponentReturn {
  isTaroComponent: boolean,
  transformResult: IWxTransformResult
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
