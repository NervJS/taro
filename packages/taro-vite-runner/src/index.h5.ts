import { isString } from '@tarojs/shared'
import { merge } from 'lodash'
import { build, createServer } from 'vite'

import h5Preset from './h5'
import assets from './h5/assets'
import mpaPlugin from './h5/mpa'
import { componentConfig } from './template/component'
import { convertCopyOptions, getMode } from './utils'
import { TaroCompiler } from './utils/compiler/h5'

import type { InlineConfig, UserConfig } from 'vite'
import type { H5BuildConfig } from './utils/types'

export default async function (appPath: string, taroConfig: H5BuildConfig) {
  const defaultConifg = {
    staticDirectory: 'static',
    viteOutput: {
      chunkFileNames: 'js/[name].[hash].js',
      assetFileNames: '[ext]/[name].[hash][extname]'
    }
  }

  const isProd = getMode(taroConfig) === 'production'
  const compiler = new TaroCompiler(appPath, merge(defaultConifg, taroConfig))

  const plugins: UserConfig['plugins'] = [
    h5Preset(compiler)
  ]

  // assets
  if (isProd) [
    plugins.push(assets(compiler))
  ]

  // mpa
  if (taroConfig.router?.mode === 'multi') {
    plugins.push(mpaPlugin(compiler))
  }

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

  const mode = getMode(taroConfig)

  if (mode === 'production') {
    await build(commonConfig)
  } else {
    // @TODO pretty print
    const server = await createServer(commonConfig)
    await server.listen()
    server.printUrls()
  }
}
