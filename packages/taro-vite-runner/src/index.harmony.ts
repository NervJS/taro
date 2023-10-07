import { isString } from '@tarojs/shared'
import { type UserConfig, build } from 'vite'

import harmonyPreset from './harmony'
import { convertCopyOptions } from './utils'
import { TaroCompilerContext } from './utils/compiler/harmony'
import { componentConfig } from './utils/component'

import type { ViteHarmonyBuildConfig } from '@tarojs/taro/types/compile/viteCompilerContext'

export default async function (appPath: string, rawTaroConfig: ViteHarmonyBuildConfig) {
  const viteCompilerContext = new TaroCompilerContext(appPath, rawTaroConfig)
  const { taroConfig } = viteCompilerContext

  const plugins: UserConfig['plugins'] = [
    harmonyPreset(viteCompilerContext)
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
