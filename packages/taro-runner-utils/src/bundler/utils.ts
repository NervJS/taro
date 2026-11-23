import { networkInterfaces } from 'node:os'
import path from 'node:path'

import { chalk, fs, PLATFORMS, recursiveMerge, resolveMainFilePath } from '@tarojs/helper'
import { isArray, isBoolean, isFunction, PLATFORM_TYPE } from '@tarojs/shared'

import type { ICopyOptions, IMiniFilesConfig } from '@tarojs/taro/types/compile'

export const emptyTogglableObj = {
  enable: false,
  config: {}
}

export const addLeadingSlash = (url = '') => (url.charAt(0) === '/' ? url : '/' + url)
export const addTrailingSlash = (url = '') => (url.charAt(url.length - 1) === '/' ? url : url + '/')
export const hasBasename = (p = '', prefix = '') => new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(p) || p === prefix
export const stripBasename = (p = '', prefix = '') => hasBasename(p, prefix) ? p.substr(prefix.length) : p
export const stripTrailingSlash = (p = '') => (p.charAt(p.length - 1) === '/' ? p.substring(0, p.length - 1) : p)
export const addHtmlSuffix = (p = '') => `${p}.html`

export const formatOpenHost = (host?: string) => {
  let result = host
  // 配置host为0.0.0.0时,可以转换为ip打开, 其他以配置host默认打开
  if (!result || result === '0.0.0.0' || result.startsWith('local-ip')) {
    // 设置localhost为初值, 防止没正确获取到host时以0.0.0.0打开
    result = 'localhost'
    const interfaces = networkInterfaces()
    for (const devName in interfaces) {
      const isEnd = interfaces[devName]?.some(item => {
        // 取IPv4, 不为127.0.0.1的内网ip
        if (['IPv4', 4, '4'].includes(item.family) && item.address !== '127.0.0.1' && !item.internal) {
          result = item.address
          return true
        }
        return false
      })
      // 若获取到ip, 结束遍历
      if (isEnd) {
        break
      }
    }
  }
  return result
}

export const parsePublicPath = (publicPath = '/') => {
  return ['', 'auto'].includes(publicPath) ? publicPath : addTrailingSlash(publicPath)
}

export function isSpecialFormat (key: string, value: string) {
  if (key === 'src' && /{{.*?}}/.test(value)) {
    // in .wxml, the value url in <web-view src="{{url}}"/> should not be requested, it is a state value in page data
    return true
  }

  return false
}

interface ShouldProcessCommonStylesOptions {
  hasCommonStyles: boolean
  hasAppStyle: boolean
  isWeappSubPackageIndieEnabled: boolean
}

export function isWeappSubPackageIndieEnabled (platform: string | undefined, newBlended: boolean): boolean {
  return platform === 'weapp' && newBlended
}

export function shouldProcessCommonStyles ({
  hasCommonStyles,
  hasAppStyle,
  isWeappSubPackageIndieEnabled
}: ShouldProcessCommonStylesOptions): boolean {
  return hasCommonStyles && (!isWeappSubPackageIndieEnabled || hasAppStyle)
}

export function computeForceCustomWrapperForIndependentPackage (
  pagePaths: string[],
  pages: Iterable<{ name: string, path: string, isNative?: boolean }>,
  filesConfig: IMiniFilesConfig,
  getConfigFilePath: (filePath: string) => string
): boolean {
  const inPkg = new Set(pagePaths)
  for (const page of pages) {
    if (!inPkg.has(page.path) || page.isNative) continue
    const content = filesConfig[getConfigFilePath(page.name)]?.content as { forceCustomWrapper?: boolean } | undefined
    if (content?.forceCustomWrapper) return true
  }
  return false
}

export function buildMultiPlatformExtensions (baseExts: string[]): string[] {
  const taroEnv = process.env.TARO_ENV
  const taroPlatform = process.env.TARO_PLATFORM
  const prefixes = [taroEnv, taroPlatform].filter(Boolean) as string[]
  const result: string[] = []
  for (const prefix of prefixes) {
    for (const ext of baseExts) {
      const candidate = `.${prefix}${ext}`
      if (!result.includes(candidate)) {
        result.push(candidate)
      }
    }
  }
  for (const ext of baseExts) {
    if (!result.includes(ext)) {
      result.push(ext)
    }
  }
  return result
}

export function getAssetsMaxSize (options: Record<string, any> = {}, defaultValue: number): number {
  // Note: limit 为 false 时，不限制大小 全部转为 base64
  const { limit } = options
  let maxSize: number
  if (isBoolean(limit)) {
    maxSize = limit ? 0 : Number.MAX_SAFE_INTEGER
  } else {
    maxSize = limit || defaultValue
  }
  return maxSize
}

export function getAssetRule (test: RegExp, defaultLimit: number, sourceRoot: string, options: Record<string, any> = {}) {
  const maxSize = getAssetsMaxSize(options, defaultLimit)
  return {
    test,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize
      }
    },
    generator: {
      emit: options.emitFile || options.emit,
      outputPath: options.outputPath,
      publicPath: options.publicPath,
      filename ({ filename }) {
        if (isFunction(options.name)) return options.name(filename)
        return options.name || filename.replace(sourceRoot + '/', '')
      }
    }
  }
}

export function getCssModuleOptions (cssModuleOptions: { namingPattern?: string, generateScopedName?: any }, cssLoaderOption?: Record<string, any>) {
  const { namingPattern, generateScopedName } = cssModuleOptions
  const defaultOptions = Object.assign(
    {
      importLoaders: 1,
      modules: {
        mode: namingPattern === 'module' ? 'local' : 'global',
        namedExport: false,
        exportLocalsConvention: 'as-is'
      }
    },
    {
      modules: isFunction(generateScopedName)
        ? { getLocalIdent: (context, _, localName) => generateScopedName(localName, context.resourcePath) }
        : { localIdentName: generateScopedName }
    }
  )

  defaultOptions.modules.namedExport = false
  defaultOptions.modules.exportLocalsConvention = 'as-is'

  return recursiveMerge({}, defaultOptions, cssLoaderOption)
}

export function getBaseSassOptions (implementation: any) {
  return {
    sourceMap: true,
    implementation,
    sassOptions: {
      outputStyle: 'expanded',
      silenceDeprecations: ['legacy-js-api'],
      importer (url, prev, done) {
        // 让 sass-loader 处理 @import 'xx.scss'
        const extname = path.extname(url)
        if (extname === '.scss' || extname === '.sass' || extname === '.css' || !extname) {
          return null
        } else {
          // 统一使用 node:fs 处理静态资源如 .png, 避免 webpack 寻找不到资源的问题
          const filePath = path.resolve(path.dirname(prev), url)
          fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
              // eslint-disable-next-line no-console
              console.log(err)
              return null
            } else {
              fs.readFile(filePath)
                .then(res => {
                  done({ contents: res.toString() })
                })
                .catch(err2 => {
                  // eslint-disable-next-line no-console
                  console.log(err2)
                  return null
                })
            }
          })
        }
      }
    }
  }
}

export function normalizeCopyPatterns (appPath: string, copy: ICopyOptions) {
  const globalIgnores: string[] = copy.options?.ignore ?? []
  return copy.patterns.map(({ from, to, ignore = [], ...extra }) => ({
    from,
    to: path.resolve(appPath, to),
    context: appPath,
    globOptions: {
      ignore: ignore.concat(globalIgnores)
    },
    ...extra
  }))
}

export const DEFAULT_MINI_TERSER_OPTIONS = {
  parse: {
    ecma: 8
  },
  compress: {
    ecma: 5,
    warnings: false,
    arrows: false,
    collapse_vars: false,
    comparisons: false,
    computed_props: false,
    hoist_funs: false,
    hoist_props: false,
    hoist_vars: false,
    inline: false,
    loops: false,
    negate_iife: false,
    properties: false,
    reduce_funcs: false,
    reduce_vars: false,
    switches: false,
    toplevel: false,
    typeofs: false,
    booleans: true,
    if_return: true,
    sequences: true,
    unused: true,
    conditionals: true,
    dead_code: true,
    directives: false,
    evaluate: true
  },
  output: {
    ecma: 5,
    comments: false,
    ascii_only: true
  }
}

export const DEFAULT_H5_TERSER_OPTIONS = {
  keep_fnames: true,
  output: {
    comments: false,
    keep_quoted_props: true,
    quote_keys: true,
    beautify: false
  },
  warnings: false
}

export function getDefaultMiniProviderGlobals (): Record<string, string[]> {
  return {
    window: ['@tarojs/runtime', 'window'],
    document: ['@tarojs/runtime', 'document'],
    navigator: ['@tarojs/runtime', 'navigator'],
    requestAnimationFrame: ['@tarojs/runtime', 'requestAnimationFrame'],
    cancelAnimationFrame: ['@tarojs/runtime', 'cancelAnimationFrame'],
    Element: ['@tarojs/runtime', 'TaroElement'],
    Document: ['@tarojs/runtime', 'TaroDocument'],
    ShadowRoot: ['@tarojs/runtime', 'ShadowRoot'],
    SVGElement: ['@tarojs/runtime', 'SVGElement'],
    MutationObserver: ['@tarojs/runtime', 'MutationObserver'],
    history: ['@tarojs/runtime', 'history'],
    location: ['@tarojs/runtime', 'location'],
    URLSearchParams: ['@tarojs/runtime', 'URLSearchParams'],
    URL: ['@tarojs/runtime', 'URL']
  }
}

export function getMiniDefineConstants (config: {
  env?: Record<string, any>
  runtime?: Record<string, any>
  defineConstants?: Record<string, any>
  framework?: string
  buildAdapter?: string
}): Record<string, any>[] {
  const {
    env = {},
    runtime = {} as Record<string, boolean>,
    defineConstants = {},
    framework = 'react',
    buildAdapter = PLATFORMS.WEAPP
  } = config

  env.FRAMEWORK = JSON.stringify(framework)
  env.TARO_ENV = JSON.stringify(buildAdapter)
  env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || PLATFORM_TYPE.MINI)
  env.SUPPORT_TARO_POLYFILL = env.SUPPORT_TARO_POLYFILL || '"disabled"'
  const envConstants = Object.keys(env).reduce((target, key) => {
    target[`process.env.${key}`] = env[key]
    return target
  }, {})

  const runtimeConstants = {
    ENABLE_INNER_HTML: runtime.enableInnerHTML ?? true,
    ENABLE_ADJACENT_HTML: runtime.enableAdjacentHTML ?? false,
    ENABLE_SIZE_APIS: runtime.enableSizeAPIs ?? false,
    ENABLE_TEMPLATE_CONTENT: runtime.enableTemplateContent ?? false,
    ENABLE_CLONE_NODE: runtime.enableCloneNode ?? false,
    ENABLE_CONTAINS: runtime.enableContains ?? false,
    ENABLE_MUTATION_OBSERVER: runtime.enableMutationObserver ?? false
  }

  return [envConstants, defineConstants, runtimeConstants]
}

export function getH5DefineConstants (config: {
  env?: Record<string, any>
  defineConstants?: Record<string, any>
  buildAdapter?: string
  framework?: string
  useDeprecatedAdapterComponent?: boolean
}): Record<string, any>[] {
  const {
    env = {},
    defineConstants = {},
    buildAdapter = PLATFORMS.H5,
    framework = 'react',
    useDeprecatedAdapterComponent = false
  } = config

  env.FRAMEWORK = JSON.stringify(framework)
  env.TARO_ENV = JSON.stringify(buildAdapter)
  env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || PLATFORM_TYPE.WEB)
  env.SUPPORT_TARO_POLYFILL = env.SUPPORT_TARO_POLYFILL || '"disabled"'
  env.SUPPORT_DINGTALK_NAVIGATE = env.SUPPORT_DINGTALK_NAVIGATE || '"disabled"'
  const envConstants = Object.keys(env).reduce((target, key) => {
    target[`process.env.${key}`] = env[key]
    return target
  }, {})

  defineConstants.DEPRECATED_ADAPTER_COMPONENT = JSON.stringify(!!useDeprecatedAdapterComponent)
  return [envConstants, defineConstants]
}

export function getH5HtmlPluginArgs (
  template: string,
  entry = '',
  chunks: string[] = [],
  config: Record<string, any> = {},
  pxTransformOptions: Record<string, any> = {}
) {
  const max = pxTransformOptions?.maxRootSize ?? 40
  const min = pxTransformOptions?.minRootSize ?? 20
  const baseFontSize = pxTransformOptions?.baseFontSize || (min > 1 ? min : 20)
  const designWidth = (input => typeof pxTransformOptions.designWidth === 'function'
    ? pxTransformOptions.designWidth(input)
    : (pxTransformOptions.designWidth || 750))(baseFontSize)
  const ratioMap = pxTransformOptions.deviceRatio || { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2 }
  const ratio = ratioMap[designWidth!] || 1
  const rootValue = baseFontSize / ratio * 2
  let htmlScript = ''
  if ((pxTransformOptions?.targetUnit ?? 'rem') === 'rem') {
    htmlScript = `!function(n){function f(){var e=n.document.documentElement,r=e.getBoundingClientRect(),width=r.width,height=r.height,arr=[width,height].filter(function(value){return Boolean(value)}),w=Math.min.apply(Math,arr),x=${rootValue}*w/${designWidth};e.style.fontSize=x>=${max}?"${max}px":x<=${min}?"${min}px":x+"px"}; n.addEventListener("resize",(function(){f();setTimeout(f,500)})),f()}(window);`
  }
  const args: Record<string, string | string[]> = {
    filename: `${entry || 'index'}.html`,
    script: htmlScript,
    template
  }
  if (entry && entry !== 'index') {
    args.chunks = [...chunks, entry]
  }
  const htmlPluginOption = config.htmlPluginOption ?? {}
  if (config.mode !== 'production' && Object.hasOwnProperty.call(htmlPluginOption, 'script')) {
    // eslint-disable-next-line no-console
    console.warn(
      chalk.yellowBright('配置文件覆盖 htmlPluginOption.script 参数会导致 pxtransform 脚本失效，请慎重使用！')
    )
  }
  return recursiveMerge(args, htmlPluginOption)
}

export function getCommonChunksList (buildNativePlugin?: { commonChunks?: string[] }, config: Record<string, any> = {}) {
  const { commonChunks } = config
  const defaultCommonChunks = buildNativePlugin?.commonChunks || ['runtime', 'vendors', 'taro', 'common']
  let customCommonChunks: string[] = defaultCommonChunks
  if (isFunction(commonChunks)) {
    customCommonChunks = commonChunks(defaultCommonChunks.concat()) || defaultCommonChunks
  } else if (isArray(commonChunks) && commonChunks.length) {
    customCommonChunks = commonChunks
  }
  return customCommonChunks
}

export function parseNativePluginConfig (sourceDir: string): {
  entry: Record<string, string[]>
  pluginConfig: Record<string, any>
  pluginMainEntry: string
} | null {
  const pluginDir = path.join(sourceDir, 'plugin')
  const pluginConfigPath = path.join(pluginDir, 'plugin.json')

  if (!fs.existsSync(pluginDir)) {
    // eslint-disable-next-line no-console
    console.log(chalk.red('插件目录不存在，请检查！'))
    return null
  }
  if (!fs.existsSync(pluginConfigPath)) {
    // eslint-disable-next-line no-console
    console.log(chalk.red('缺少插件配置文件，请检查！'))
    return null
  }

  const pluginConfig = fs.readJSONSync(pluginConfigPath)
  const entry: Record<string, string[]> = {}
  let pluginMainEntry = ''

  Object.keys(pluginConfig).forEach(key => {
    if (key === 'main') {
      const filePath = path.join(pluginDir, pluginConfig[key])
      const fileName = path.basename(filePath).replace(path.extname(filePath), '')
      pluginMainEntry = `${fileName}`
      entry[pluginMainEntry] = [resolveMainFilePath(filePath.replace(path.extname(filePath), ''))]
    } else if (key === 'publicComponents' || key === 'pages') {
      Object.keys(pluginConfig[key]).forEach(subKey => {
        const filePath = path.join(pluginDir, pluginConfig[key][subKey])
        entry[`${pluginConfig[key][subKey]}`] = [resolveMainFilePath(filePath.replace(path.extname(filePath), ''))]
      })
    }
  })

  return {
    entry,
    pluginConfig,
    pluginMainEntry
  }
}

export interface IComponentConfig {
  includes: Set<string>
  exclude: Set<string>
  includeAll: boolean
  thirdPartyComponents: Map<string, Set<string>>
  customRoutes: Set<string>
}

export function createComponentConfig (): IComponentConfig {
  return {
    includes: new Set(['view', 'catch-view', 'static-view', 'pure-view', 'scroll-view', 'image', 'static-image', 'text', 'static-text']),
    exclude: new Set(),
    includeAll: false,
    thirdPartyComponents: new Map(),
    customRoutes: new Set()
  }
}
