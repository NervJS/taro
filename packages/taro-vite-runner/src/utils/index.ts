import { NODE_MODULES_REG } from '@tarojs/helper'
import { isString } from '@tarojs/shared'
import path from 'path'

import { TARO_COMPILER,TaroCompiler } from './taroCompiler'

import type { PluginContext } from 'rollup'
// import type { H5BuildConfig, MiniBuildConfig } from './types'

export function getCompiler (rollupPluginContext: PluginContext) {
  const info = rollupPluginContext.getModuleInfo(TARO_COMPILER)
  const compiler: TaroCompiler | undefined = info?.meta.compiler
  return compiler
}

export function prettyPrintJson (obj: Record<string, any>) {
  return JSON.stringify(obj, null, 2)
}

export function getComponentName (compiler: TaroCompiler, componentPath: string) {
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
