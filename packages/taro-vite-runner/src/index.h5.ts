import { isString } from '@tarojs/shared'
import { merge } from 'lodash'
import { build, createServer } from 'vite'

import h5Preset from './h5'
import { convertCopyOptions } from './utils'
import { TaroCompiler } from './utils/compiler/h5'
import { componentConfig } from './utils/component'

import type { InlineConfig, UserConfig } from 'vite'
import type { H5BuildConfig } from './utils/types'

export default async function (appPath: string, taroConfig: H5BuildConfig) {
  const defaultConifg = {
    staticDirectory: 'static',
    viteOutput: {
      entryFileNames: 'js/app.[hash].js',
      chunkFileNames: 'js/[name].[hash].js',
      assetFileNames: '[ext]/[name].[hash][extname]'
    }
  }

  const compiler = new TaroCompiler(appPath, merge(defaultConifg, taroConfig))

  const plugins: UserConfig['plugins'] = [
    h5Preset(compiler)
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

  const { mode } = taroConfig


  if (mode === 'production') {
    await build(commonConfig)
  } else {
    // @TODO pretty print
    const server = await createServer(commonConfig)
    await server.listen()
    server.printUrls()
  }
}
