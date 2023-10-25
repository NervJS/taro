import { SOURCE_DIR } from '@tarojs/helper'
import ReactLikePlugin from '@tarojs/plugin-framework-react'
import Vue2Plugin from '@tarojs/plugin-framework-vue2'
import Vue3Plugin from '@tarojs/plugin-framework-vue3'
import { createFsFromVolume, IFs, Volume } from 'memfs'
import * as joinPath from 'memory-fs/lib/join'
import * as path from 'path'
import * as webpack from 'webpack'
import * as merge from 'webpack-merge'

import prodConf from '../../config/prod.conf'
import { customizeChain } from '../../index'
import { AppHelper } from '../../utils'
import { makeConfig } from '../../utils/chain'
import { componentConfig } from '../../utils/component'
import { BuildConfig } from '../../utils/types'
import baseConfig from './config'

interface EnsuredFs extends IFs {
  join: () => string
}

function ensureWebpackMemoryFs (fs: IFs): EnsuredFs {
  const newFs: EnsuredFs = Object.create(fs)
  newFs.join = joinPath

  return newFs
}

function run (webpackConfig: webpack.Configuration): Promise<webpack.Stats | undefined> {
  const compiler = webpack(webpackConfig)
  const fs = createFsFromVolume(new Volume())
  const ensuredFs = ensureWebpackMemoryFs(fs)

  compiler.outputFileSystem = ensuredFs

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err ?? stats?.hasErrors()) {
        const error = err ?? stats!.toJson().errors
        reject(error)
      } else {
        resolve(stats)
      }
    })
  })
}

function readDir (fs: IFs, dir: string) {
  let files: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach(item => {
    const filePath = path.join(dir, item)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      files = files.concat(readDir(fs, filePath))
    } else {
      files.push(filePath)
    }
  })
  return files
}

export function getOutput (stats, config: Partial<BuildConfig>) {
  const fs: IFs = stats.compilation.compiler.outputFileSystem

  const files = readDir(fs, config.outputRoot as string)
  const output = files.reduce((content, file) => {
    return `${content}
/** filePath: ${file} **/
${fs.readFileSync(file)}
`
  }, '')
  return output
}

export async function compile (app: string, customConfig: Partial<BuildConfig> = {
  framework: 'react'
}) {
  process.env.TARO_ENV = 'h5'

  const appPath = path.resolve(__dirname, '../fixtures', app)

  process.chdir(appPath)

  const customChain = customConfig.webpackChain

  customConfig.webpackChain = (chain, _webpack) => {
    const webpack = jest.requireActual('webpack')
    frameworkPatch(chain, webpack, customConfig)

    if (typeof customChain === 'function') {
      customChain(chain, webpack)
    }
  }

  const config: BuildConfig = merge(baseConfig, {
    entry: {
      app: [path.join(appPath, customConfig.sourceRoot || 'src', 'app.config')]
    },
    env: {
      FRAMEWORK: customConfig.framework
    },
    terser: {
      enable: true,
      config: {
        compress: false,
        mangle: false,
        output: {
          comments: false,
          beautify: true
        }
      }
    }
  }, customConfig)

  const newConfig: BuildConfig = await makeConfig(config)
  const appHelper = new AppHelper(newConfig.entry, {
    sourceDir: path.join(appPath, config.sourceRoot || SOURCE_DIR),
    frameworkExts: newConfig.frameworkExts,
    entryFileName: newConfig.entryFileName
  })
  const webpackChain = prodConf(appPath, newConfig, appHelper)

  await customizeChain(webpackChain, () => {}, newConfig.webpackChain)

  webpackChain.merge({
    resolve: {
      alias: {
        '@tarojs/runtime': path.resolve(__dirname, '../mocks/taro-runtime'),
        '@tarojs/shared': path.resolve(__dirname, '../mocks/taro-shared'),
        '@tarojs/taro-h5': path.resolve(__dirname, '../mocks/taro-h5'),
        '@tarojs/router': path.resolve(__dirname, '../mocks/taro-router'),
        '@tarojs/plugin-framework-react/dist/runtime': path.resolve(__dirname, '../mocks/taro-framework'),
        '@tarojs/plugin-framework-vue2/dist/runtime': path.resolve(__dirname, '../mocks/taro-framework'),
        '@tarojs/plugin-framework-vue3/dist/runtime': path.resolve(__dirname, '../mocks/taro-framework'),
        '@tarojs/components$': path.resolve(__dirname, '../mocks/taro-components'),
        '@tarojs/components/dist-h5/vue': path.resolve(__dirname, '../mocks/taro-components'),
        '@tarojs/components/dist-h5/vue3': path.resolve(__dirname, '../mocks/taro-components'),
        '@tarojs/components/loader': path.resolve(__dirname, '../mocks/taro-components'),
        '@tarojs/components/dist/taro-components/taro-components.css': path.resolve(__dirname, '../mocks/taro-components.css'),
        'react-dom$': path.resolve(__dirname, '../mocks/react'),
        'react-dom/client$': path.resolve(__dirname, '../mocks/react'),
        react: path.resolve(__dirname, '../mocks/react'),
        vue: path.resolve(__dirname, '../mocks/vue'),
        nervjs: path.resolve(__dirname, '../mocks/nerv')
      }
    }
  })

  const webpackConfig: webpack.Configuration = webpackChain.toConfig()

  const stats = await run(webpackConfig)
  return { stats, config: newConfig }
}

/**
 * 处理不同框架的自定义逻辑
 * @param chain webpack-chain
 */
function frameworkPatch (chain, webpack, config) {
  const mockCtx = {
    initialConfig: {
      framework: config.framework || 'react'
    },
    modifyWebpackChain: cb => cb({ chain, webpack, data: { componentConfig } }),
    modifyRunnerOpts: cb => cb(config),
    onParseCreateElement: cb => cb({ nodeName: '', componentConfig })
  }

  let frameworkPlugin: any = ReactLikePlugin
  switch (config.framework) {
    case 'vue':
      config.opts = {}
      frameworkPlugin = Vue2Plugin
      break
    case 'vue3':
      config.opts = {}
      frameworkPlugin = Vue3Plugin
      break
  }

  frameworkPlugin(mockCtx)
}
