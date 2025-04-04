import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'

import type { PluginContext } from 'rollup'
import type { IMiniFilesConfig, IH5Config, IHarmonyConfig, IMiniAppConfig } from './config'
import type { IProjectConfig } from './config/project'
import type { IComponentConfig } from './hooks'
import type { IFileType } from './index'
import type { AppConfig, PageConfig } from '../index'

export interface ViteNativeCompMeta {
  name: string
  exportName: string
  scriptPath: string
  configPath: string
  config: PageConfig
  isNative: true
  templatePath: string
  cssPath?: string
  isPackage?: boolean
  isGenerated?: boolean
}

export interface ViteFileType {
  config: string
  script: string
  templ: string
  style: string
  xs?: string
}

export interface ViteAppMeta {
  name: string
  scriptPath: string
  configPath: string
  config: AppConfig
  isNative: false
}

export interface VitePageMeta {
  name: string
  scriptPath: string
  configPath: string
  config: PageConfig
  isNative: boolean
  templatePath?: string
  cssPath?: string
}

export interface ViteH5BuildConfig extends CommonBuildConfig, IH5Config<'vite'> {
  entryFileName?: string
  runtimePath?: string | string[]
}

export interface ViteHarmonyBuildConfig extends CommonBuildConfig, IHarmonyConfig {
  fileType: IFileType
  useETS?: boolean
  useJSON5?: boolean
  blended?: boolean
  runtimePath?: string | string[]
  isPure?: boolean
  taroComponentsPath: string
  cssVariables?: boolean  // 是否动态解析css变量
}

export interface CommonBuildConfig extends IProjectConfig<'vite'> {
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


export interface ViteMiniBuildConfig extends CommonBuildConfig, IMiniAppConfig<'vite'> {
  isBuildPlugin: boolean
  isSupportRecursive: boolean
  isSupportXS: boolean
  nodeModulesPath: string
  fileType: ViteFileType
  globalObject: string
  template: RecursiveTemplate | UnRecursiveTemplate
  runtimePath?: string | string[]
  taroComponentsPath: string
  blended?: boolean
  hot?: boolean
  injectOptions?: {
    include?: Record<string, string | string[]>
    exclude?: string[]
  }
  /** hooks */
  modifyComponentConfig: (componentConfig: IComponentConfig, config: Partial<ViteMiniBuildConfig>) => Promise<any>
}

export interface ViteCompilerContext<T> {
  cwd: string
  sourceDir: string
  taroConfig: T
  rawTaroConfig: T
  frameworkExts: string[]
  app: ViteAppMeta
  pages: VitePageMeta[]
  components?: VitePageMeta[]
  loaderMeta: any
  logger
  filesConfig: IMiniFilesConfig
  configFileList: string[]
  compilePage: (pageName: string) => VitePageMeta
  watchConfigFile: (rollupCtx: PluginContext) => void
  collectedDeps: (rollupCtx: PluginContext, id: string, filter, cache: Set<string> = new Set()) => Promise<Set<string>>
  getAppScriptPath: () => string
  getApp: () => ViteAppMeta
  getPages: () => VitePageMeta[]
  isApp: (id: string) => boolean
  isPage: (id: string) => boolean
  isComponent: (id: string) => boolean
  isNativePageORComponent: (templatePath: string) => boolean
  getPageById: (id: string) => VitePageMeta| undefined
  getComponentById: (id: string) => VitePageMeta| undefined
  getConfigFilePath: (filePath: string) => string
  getTargetFilePath: (filePath: string, targetExtName: string) => string
}

export interface ViteH5CompilerContext extends ViteCompilerContext<ViteH5BuildConfig> {
  getBrowserslist: () => void
  routerMeta: {
    routerCreator: string
    getRoutesConfig: (pageName?: string) => string
  }
  browserslist: string[]
}

export interface ViteHarmonyCompilerContext extends ViteCompilerContext<ViteHarmonyBuildConfig> {
  nativeExt: string[]
  fileType: ViteFileType
  commonChunks: string[]
  extraComponents: string[]
  nativeComponents : Map<string, ViteNativeCompMeta>
  getCommonChunks: () => string[]
  modifyHarmonyConfig: (config: Partial<AppConfig>) => void
  modifyHostPackage: (deps?: Record<string, string>, devDeps?: Record<string, string>) => Exclude<IHarmonyConfig['ohPackage'], void>
  resolvePageImportPath: (scriptPath: string, pageName: string) => string
  collectNativeComponents: (meta: ViteAppMeta | VitePageMeta | ViteNativeCompMeta) => ViteNativeCompMeta[]
  generateNativeComponent: (rollupCtx: PluginContext, meta: ViteNativeCompMeta, implicitlyLoadedAfterOneOf: string[] = []) => void
  getScriptPath: (filePath: string) => string
  getStylePath: (filePath: string) => string
  getConfigPath: (filePath: string) => string
}

export interface ViteMiniCompilerContext extends ViteCompilerContext<ViteMiniBuildConfig> {
  fileType: ViteFileType
  commonChunks: string[]
  nativeComponents : Map<string, ViteNativeCompMeta>
  getCommonChunks: () => string[]
  resolvePageImportPath: (scriptPath: string, pageName: string) => string
  collectNativeComponents: (meta: ViteAppMeta | VitePageMeta | ViteNativeCompMeta) => ViteNativeCompMeta[]
  generateNativeComponent: (rollupCtx: PluginContext, meta: ViteNativeCompMeta, implicitlyLoadedAfterOneOf: string[] = []) => void
  getScriptPath: (filePath: string) => string
  getTemplatePath: (filePath: string) => string
  getStylePath: (filePath: string) => string
  getConfigPath: (filePath: string) => string
}
