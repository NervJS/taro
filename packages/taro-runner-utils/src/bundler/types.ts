import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { AppConfig } from '@tarojs/taro'
import type { IH5Config, IHarmonyConfig, IMiniAppConfig, IProjectBaseConfig } from '@tarojs/taro/types/compile'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { PrerenderConfig } from './prerender'

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

export interface IBundlerSources {
  RawSource: new (value: string | Buffer) => any
  ConcatSource: new (...args: any[]) => any
}

export interface CommonBuildConfig<TEntry = Record<string, any>> extends IProjectBaseConfig {
  entry?: TEntry
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
  modifyComponentConfig: (componentConfig: IComponentConfig, config: Partial<CommonBuildConfig<TEntry>>) => Promise<any>
}

export interface IMiniBuildConfig<TEntry = Record<string, any>> extends CommonBuildConfig<TEntry>, IMiniAppConfig {
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
  behaviorsName: string
  blended?: boolean
  hot?: boolean
}

export interface IH5BuildConfig<TEntry = Record<string, any>> extends CommonBuildConfig<TEntry>, IH5Config {
  entryFileName?: string
  runtimePath?: string | string[]
  noInjectGlobalStyle?: boolean
}

export interface IHarmonyBuildConfig<TEntry = Record<string, any>> extends CommonBuildConfig<TEntry>, IHarmonyConfig {
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
