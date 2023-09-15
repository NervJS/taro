import { isString } from '@tarojs/shared'
import { type UserConfig, build } from 'vite'

import harmonyPreset from './harmony'
import { convertCopyOptions } from './utils'
import { TaroCompiler } from './utils/compiler/harmony'
import { componentConfig } from './utils/component'

import type { HarmonyBuildConfig } from './utils/types'

export default async function (appPath: string, taroConfig: HarmonyBuildConfig) {
  const compiler = new TaroCompiler(appPath, taroConfig)

  const plugins: UserConfig['plugins'] = [
    harmonyPreset(compiler)
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
    plugins,
  }

  taroConfig.modifyViteConfig?.(commonConfig, {
    componentConfig
  })
  await build(commonConfig)
}
