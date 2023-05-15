import { NODE_MODULES_REG } from '@tarojs/helper'
import { isString } from '@tarojs/shared'
import path from 'path'

import { Compiler } from '../utils/compiler/base'

import type { PluginContext } from 'rollup'
import type { Target } from 'vite-plugin-static-copy'
import type { TaroCompiler as H5Compiler,TaroCompiler as MiniCompiler  } from '../utils/compiler/mini'
import type { H5BuildConfig, MiniBuildConfig } from './types'

export function convertCopyOptions (taroConfig: MiniBuildConfig | H5BuildConfig) {
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

export function getCompiler<T extends MiniCompiler | H5Compiler> (rollupPluginContext: PluginContext) {
  const info = rollupPluginContext.getModuleInfo(Compiler.label)
  const compiler: T | undefined = info?.meta.compiler
  return compiler
}

export function getMiniCompiler (rollupPluginContext: PluginContext) {
  return getCompiler<MiniCompiler>(rollupPluginContext)
}

export function getH5Compiler (rollupPluginContext: PluginContext) {
  return getCompiler<H5Compiler>(rollupPluginContext)
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
