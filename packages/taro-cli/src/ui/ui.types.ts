import { IProjectConfig, IH5Config } from '@tarojs/taro/types/compile'
import { IBuildHooks } from '../util/types'

export interface IBuildData {
  appPath: string
  projectConfig: IProjectConfig
  sourceDirName: string
  outputDirName: string
  sourceDir: string
  entryFilePath: string
  entryFileName: string
  tempPath: string
  rnTempPath: string
}

export interface IH5BuildConfig extends IH5Config, IBuildHooks {
  env?: object
  defineConstants?: object
  plugins?: object
  designWidth?: number
  deviceRatio?: object
  sourceRoot?: string
  outputRoot?: string
  isWatch?: boolean
  babel?: object
  sass?: object
  csso?: object
  uglify?: object
}
