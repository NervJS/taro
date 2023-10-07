import { isNpmPkg, NODE_MODULES_REG, recursiveMerge } from '@tarojs/helper'
import { isString } from '@tarojs/shared'
import { IPostcssOption } from '@tarojs/taro/types/compile'
import path from 'path'
import querystring from 'querystring'
import { sync as resolveSync } from 'resolve'

import createFilter from './createFilter'
import { logger } from './logger'

import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import type { ViteH5BuildConfig, 
  ViteH5CompilerContext, 
  ViteMiniBuildConfig, 
  ViteMiniCompilerContext, 
  VitePageMeta
} from '@tarojs/taro/types/compile/viteCompilerContext'
import type { CSSModulesOptions } from 'vite'
import type { Target } from 'vite-plugin-static-copy'


export function convertCopyOptions (taroConfig: ViteMiniBuildConfig | ViteH5BuildConfig) {
  const copy = taroConfig.copy
  const copyOptions: Target[] = []
  copy?.patterns.forEach(({ from, to }) => {
    const { base, ext } = path.parse(to)
    to = to
      .replace(new RegExp('^' + taroConfig.outputRoot + '/'), '')
    let rename

    if (ext) {
      to = to.replace(base, '')
      rename = base
    } else {
      rename = '/'
    }

    copyOptions.push({
      src: from,
      dest: to,
      rename
    })
  })
  return copyOptions
}

export function prettyPrintJson (obj: Record<string, any>) {
  return JSON.stringify(obj, null, 2)
}

export function getComponentName (viteCompilerContext: ViteH5CompilerContext | ViteMiniCompilerContext, componentPath: string) {
  let componentName: string
  if (NODE_MODULES_REG.test(componentPath)) {
    componentName = componentPath
      .replace(viteCompilerContext.cwd, '')
      .replace(/\\/g, '/')
      .replace(path.extname(componentPath), '')
      .replace(/node_modules/gi, 'npm')
  } else {
    componentName = componentPath
      .replace(viteCompilerContext.sourceDir, '')
      .replace(/\\/g, '/')
      .replace(path.extname(componentPath), '')
  }

  return componentName.replace(/^(\/|\\)/, '')
}

const virtaulModulePrefix ='\0'
const virtaulModulePrefixREG = new RegExp(`^${virtaulModulePrefix}`)

export function appendVirtualModulePrefix (id: string): string {
  return virtaulModulePrefix + id
}

export function stripVirtualModulePrefix (id: string): string {
  return id.replace(virtaulModulePrefixREG, '')
}

export function isVirtualModule (id: string): boolean {
  return virtaulModulePrefixREG.test(id)
}

export function isRelativePath (id: string | undefined): boolean {
  if (!isString(id)) return false

  if (path.isAbsolute(id)) return false

  if (/^[a-z][a-z0-9+.-]*:/i.test(id)) return false

  return true
}

export function stripMultiPlatformExt (id: string): string {
  return id.replace(new RegExp(`\\.${process.env.TARO_ENV}$`), '')
}

export const addTrailingSlash = (url = '') => (url.charAt(url.length - 1) === '/' ? url : url + '/')

export function getMode (config: ViteH5BuildConfig | ViteMiniBuildConfig) {
  const preMode = config.mode || process.env.NODE_ENV
  const modes: ('production' | 'development' | 'none')[] = ['production', 'development', 'none']
  const mode = modes.find(e => e === preMode)
    || (!config.isWatch || process.env.NODE_ENV === 'production' ? 'production' : 'development')
  return mode
}

export function genRouterResource (page: VitePageMeta) {
  return [
    'Object.assign({',
    `  path: '${page.name}',`,
    '  load: async function(context, params) {',
    `    const page = await import("${page.scriptPath}")`,
    '    return [page, context, params]',
    '  }',
    `}, ${JSON.stringify(page.config)})`
  ].join('\n')
}

export function getQueryParams (path: string) {
  return querystring.parse(path.split('?')[1])
}

export function generateQueryString (params: { [key: string] : string }): string {
  return querystring.stringify(params)
}

export function getPostcssPlugins (appPath: string, option = {} as IPostcssOption, excludePluginNames: string[]) {
  const plugins: any[] = []
  
  option.forEach(([pluginName, pluginOption, pluginPkg]) => {
    if (!pluginOption || excludePluginNames.includes(pluginName)) return
    if (Object.hasOwnProperty.call(pluginOption, 'enable') && !pluginOption.enable) return

    if (pluginPkg) {
      plugins.push(pluginPkg(pluginOption.config || {}))
      return
    }

    if (!isNpmPkg(pluginName)) {
      // local plugin
      pluginName = path.join(appPath, pluginName)
    }

    try {
      const pluginPath = resolveSync(pluginName, { basedir: appPath })
      plugins.push(require(pluginPath)(pluginOption.config || {}))
    } catch (e) {
      const msg = e.code === 'MODULE_NOT_FOUND' ? `缺少 postcss 插件 "${pluginName}", 已忽略` : e
      logger.info(msg)
    }
  })

  return plugins
}

export function getMinify (taroConfig: ViteMiniBuildConfig | ViteH5BuildConfig): 'terser' | 'esbuild' | boolean {
  const isProd = getMode(taroConfig) === 'production'
  return !isProd
    ? false
    : taroConfig.jsMinimizer === 'esbuild'
      ? taroConfig.esbuild?.minify?.enable === false
        ? false // 只有在明确配置了 esbuild.minify.enable: false 时才不启用压缩
        : 'esbuild'
      : taroConfig.terser?.enable === false
        ? false // 只有在明确配置了 terser.enable: false 时才不启用压缩
        : 'terser'
}


export function getCSSModulesOptions(taroConfig: ViteMiniBuildConfig | ViteH5BuildConfig): false | CSSModulesOptions {
  if (taroConfig.postcss?.cssModules?.enable !== true) return false
  const config = recursiveMerge(
    {},
    {
      namingPattern: 'module',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    taroConfig.postcss.cssModules.config
  )
  return {
    generateScopedName: config.generateScopedName,
  }
}


export function getBabelOption (taroConfig: ViteMiniBuildConfig | ViteH5BuildConfig): RollupBabelInputPluginOptions {
  const { compile = {} } = taroConfig
  const babelOptions: RollupBabelInputPluginOptions = {
    extensions: ['.js', '.jsx', 'ts', 'tsx', '.es6', '.es', '.mjs'],
    babelHelpers: 'runtime',
    skipPreflightCheck: true,
    compact: false,
  }

  let exclude: any[] = []
  let include: any[] = []

  if (compile.exclude?.length) {
    exclude = compile.exclude
  }  
  if (compile.include?.length) {
    include = compile.include
  }

  const filter = createFilter(include, exclude)
  babelOptions.filter = filter

  return babelOptions
}

