import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { IH5Config, IMiniAppConfig, IProjectBaseConfig } from '@tarojs/taro/types/compile'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type Webpack from 'webpack'
import type { PrerenderConfig } from '../prerender/prerender'

export interface IOption {
  [key: string]: any
}

export interface IComponent {
  name: string
  path: string
  isNative: boolean
  stylePath?: string
  templatePath?: string
}

export interface IComponentObj {
  name?: string
  path: string | null
  type?: string
}

export interface IChain {
  [key: string]: any
}

export interface IFileType {
  style: string
  script: string
  templ: string
  config: string
  xs?: string
}

export interface CommonBuildConfig extends IProjectBaseConfig {
  entry?: Webpack.EntryObject
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
  prerender?: PrerenderConfig
  template: RecursiveTemplate | UnRecursiveTemplate
  runtimePath?: string | string[]
  taroComponentsPath?: string
  blended?: boolean
  hot?: boolean
  /** hooks */
  modifyComponentConfig: (componentConfig: IComponentConfig, config: Partial<MiniBuildConfig>) => Promise<any>
}

export interface H5BuildConfig extends CommonBuildConfig, IH5Config {
  entryFileName?: string
  runtimePath?: string | string[]
}

export type AddPageChunks = (pages: Map<string, string[]>, pagesNames?: string[]) => void
