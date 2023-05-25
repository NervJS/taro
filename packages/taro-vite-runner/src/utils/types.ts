import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { IH5Config, IMiniAppConfig, IProjectBaseConfig } from '@tarojs/taro/types/compile'
import type { IComponentConfig } from '../template/component'

export interface IFileType {
  style: string
  script: string
  templ: string
  config: string
  xs?: string
}

export interface CommonBuildConfig extends IProjectBaseConfig {
  entry: {
    app: string | string[]
  }
  mode: 'production' | 'development' | 'none'
  buildAdapter: string // weapp | swan | alipay | tt | qq | jd | h5
  platformType: string // mini | web
  /** special mode */
  isBuildNativeComp?: boolean
  /** hooks */
  onCompilerMake: (compilation) => Promise<any>
  onParseCreateElement: (nodeName, componentConfig) => Promise<any>
}

export interface MiniBuildConfig extends CommonBuildConfig, IMiniAppConfig {
  isBuildPlugin: boolean
  isSupportRecursive: boolean
  isSupportXS: boolean
  nodeModulesPath: string
  fileType: IFileType
  globalObject: string
  template: RecursiveTemplate | UnRecursiveTemplate
  runtimePath?: string | string[]
  taroComponentsPath?: string
  blended?: boolean
  hot?: boolean
  injectOptions?: {
    include?: Record<string, string | string[]>
    exclude?: string[]
  }
  /** hooks */
  modifyComponentConfig: (componentConfig: IComponentConfig, config: Partial<MiniBuildConfig>) => Promise<any>
}

export interface H5BuildConfig extends CommonBuildConfig, IH5Config {
  entryFileName?: string
  runtimePath?: string | string[]
}
