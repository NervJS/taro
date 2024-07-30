import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { AppConfig } from '@tarojs/taro'
import type { IH5Config, IHarmonyConfig, IMiniAppConfig, IProjectBaseConfig } from '@tarojs/taro/types/compile'
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
  newBlended?: boolean
  withoutBuild?: boolean
  noInjectGlobalStyle?: boolean
  /** hooks */
  onParseCreateElement: (nodeName, componentConfig) => Promise<any>
  modifyComponentConfig: (componentConfig: IComponentConfig, config: Partial<CommonBuildConfig>) => Promise<any>
}

export interface IMiniBuildConfig extends CommonBuildConfig, IMiniAppConfig {
  isBuildPlugin: boolean
  isSupportRecursive: boolean
  isSupportXS: boolean
  nodeModulesPath: string
  fileType: IFileType
  globalObject: string
  platform: string
  prerender?: PrerenderConfig
  template: RecursiveTemplate | UnRecursiveTemplate
  runtimePath?: string | string[]
  taroComponentsPath: string
  blended?: boolean
  hot?: boolean
}

export interface IH5BuildConfig extends CommonBuildConfig, IH5Config {
  entryFileName?: string
  runtimePath?: string | string[]
  /** special mode */
  // 不引入全局样式
  noInjectGlobalStyle?: boolean
}

export interface IHarmonyBuildConfig extends CommonBuildConfig, IHarmonyConfig {
  fileType: IFileType
  useETS?: boolean
  useJSON5?: boolean
  runtimePath?: string | string[]
  taroComponentsPath: string
  /** hooks */
  modifyHarmonyConfig: (config: Partial<AppConfig>) => void
  modifyHostPackage: (deps?: Record<string, string>, devDeps?: Record<string, string>) => Exclude<IHarmonyConfig['ohPackage'], void>
}

export type AddPageChunks = (pages: Map<string, string[]>, pagesNames?: string[]) => void
