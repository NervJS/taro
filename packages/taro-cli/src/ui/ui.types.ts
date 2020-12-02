import { IProjectConfig, IH5Config } from '@tarojs/taro/types/compile'

export interface IBuildData {
  appPath: string,
  projectConfig: IProjectConfig,
  sourceDirName: string,
  outputDirName: string,
  sourceDir: string,
  entryFilePath: string,
  entryFileName: string,
  tempPath: string,
  rnTempPath: string
}

export interface IH5BuildConfig extends IH5Config {
  env?: object,
  defineConstants?: object,
  plugins?: any[],
  designWidth?: number,
  deviceRatio?: object,
  sourceRoot?: string,
  outputRoot?: string,
  isWatch?: boolean,
  babel?: object,
  sass?: object,
  csso?: object,
  uglify?: object
}
