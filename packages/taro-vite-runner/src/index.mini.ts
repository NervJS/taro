import { isFunction, isString } from '@tarojs/shared'
import { build } from 'vite'

import miniPreset from './mini'
import { convertCopyOptions } from './utils'
import { TaroCompilerContext } from './utils/compiler/mini'
import { componentConfig } from './utils/component'

import type { ViteMiniBuildConfig } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { UserConfig } from 'vite'

export default async function (appPath: string, rawTaroConfig: ViteMiniBuildConfig) {
  const viteCompilerContext = new TaroCompilerContext(appPath, rawTaroConfig)
  const { taroConfig } = viteCompilerContext
  const plugins: UserConfig['plugins'] = [
    miniPreset(viteCompilerContext)
  ]

  // copy-plugin
  if (taroConfig.copy?.patterns?.length) {
    plugins.push(require('vite-plugin-static-copy').viteStaticCopy({
      targets: convertCopyOptions(taroConfig)
    }))
  }

  // custom vite plugins
  if (!isString(taroConfig.compiler) && taroConfig.compiler?.vitePlugins?.length) {
    plugins.push(...taroConfig.compiler.vitePlugins)
  }

  const commonConfig: UserConfig = {
    plugins
  }

  const modifyComponentConfig = taroConfig.modifyComponentConfig
  if (isFunction(modifyComponentConfig)) {
    modifyComponentConfig(componentConfig, taroConfig)
  }

  taroConfig.modifyViteConfig?.(commonConfig, {
    componentConfig
  })

  await build(commonConfig)
}
