import { Adapters } from './adapter'

export interface Options {
  isRoot?: boolean,
  isApp: boolean,
  outputPath: string,
  sourcePath: string,
  code: string,
  isTyped: boolean,
  isNormal?: boolean,
  env?: ENVS,
  adapter?: Adapters
}

export interface ENVS {
  TARO_ENV: string
}

export const transformOptions: Options = {} as any

export const setTransformOptions = (options: Options) => {
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      transformOptions[key] = options[key]
    }
  }
}
