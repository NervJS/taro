import { NODE_MODULES_REG } from '@tarojs/helper'
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
