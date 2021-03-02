import {
  IProjectConfig,
  IH5Config,
  IOption,
  TogglableOptions,
  IDeviceRatio,
  ISassOptions
} from '@tarojs/taro/types/compile'

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
  env?: IOption,
  defineConstants?: IOption,
  plugins?: any[],
  designWidth?: number,
  deviceRatio?: IDeviceRatio,
  sourceRoot?: string,
  outputRoot?: string,
  isWatch?: boolean,
  babel?: Record<string, any>,
  sass?: ISassOptions,
  csso?: TogglableOptions,
  uglify?: TogglableOptions
}
