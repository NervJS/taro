import { isString } from '@tarojs/shared'
import { createServer } from 'vite'

import h5Preset from './h5'
import { convertCopyOptions } from './utils'
import { componentConfig } from './utils/component'

import type { InlineConfig, UserConfig } from 'vite'
import type { H5BuildConfig } from './utils/types'

export default async function (appPath: string, taroConfig: H5BuildConfig) {
  const plugins: UserConfig['plugins'] = [
    h5Preset(appPath, taroConfig)
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

  taroConfig.modifyViteConfig?.(commonConfig, componentConfig)

  // @TODO pretty print
  const server = await createServer(commonConfig)
  await server.listen()
  server.printUrls()
}
