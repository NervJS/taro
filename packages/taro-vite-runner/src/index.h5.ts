import { isString } from '@tarojs/shared'
import { ViteH5BuildConfig } from '@tarojs/taro/types/compile/viteCompilerContext'
import { build, createServer } from 'vite'

import h5Preset from './h5'
import { componentConfig } from './template/component'
import { convertCopyOptions, getMode } from './utils'
import { TaroCompilerContext } from './utils/compiler/h5'

import type { InlineConfig, UserConfig } from 'vite'

export default async function (appPath: string, rawTaroConfig: ViteH5BuildConfig) {
  const viteCompilerContext = new TaroCompilerContext(appPath, rawTaroConfig)
  const { taroConfig } = viteCompilerContext
  const isProd = getMode(taroConfig) === 'production'

  const plugins: UserConfig['plugins'] = [
    h5Preset(viteCompilerContext)
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

  const commonConfig: InlineConfig = {
    configFile: false,
    plugins
  }

  taroConfig.modifyViteConfig?.(commonConfig, {
    componentConfig
  })

  if (isProd) {
    await build(commonConfig)
  } else {
    // @TODO pretty print
    const server = await createServer(commonConfig)
    await server.listen()
    server.printUrls()
  }
}
