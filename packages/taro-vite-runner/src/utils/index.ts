import { NODE_MODULES_REG } from '@tarojs/helper'
import { isString } from '@tarojs/shared'
import { ViteH5BuildConfig, ViteMiniBuildConfig, VitePageMeta } from '@tarojs/taro/types/compile/viteCompilerContext'
import path from 'path'
import querystring from 'querystring'

import type { Target } from 'vite-plugin-static-copy'
import type { TaroCompiler as H5Compiler } from '../utils/compiler/h5'
import type { TaroCompiler as MiniCompiler } from '../utils/compiler/mini'


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

export function getComponentName (compiler: MiniCompiler | H5Compiler, componentPath: string) {
  let componentName: string
  if (NODE_MODULES_REG.test(componentPath)) {
    componentName = componentPath
      .replace(compiler.cwd, '')
      .replace(/\\/g, '/')
      .replace(path.extname(componentPath), '')
      .replace(/node_modules/gi, 'npm')
  } else {
    componentName = componentPath
      .replace(compiler.sourceDir, '')
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


// todo 关于mode 全部替换成这个
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