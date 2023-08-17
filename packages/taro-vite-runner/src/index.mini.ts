import { isFunction, isString } from '@tarojs/shared'
import { build } from 'vite'

import miniPreset from './mini'
import { componentConfig } from './template/component'
import { convertCopyOptions } from './utils'

import type { UserConfig } from 'vite'
import type { MiniBuildConfig } from './utils/types'

export default async function (appPath: string, taroConfig: MiniBuildConfig) {
  const plugins: UserConfig['plugins'] = [
    miniPreset(appPath, taroConfig)
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
