import * as helper from '@tarojs/helper'
import ReactLikePlugin from '@tarojs/plugin-framework-react'
import Vue2Plugin from '@tarojs/plugin-framework-vue2'
import Vue3Plugin from '@tarojs/plugin-framework-vue3'
import { Weapp } from '@tarojs/plugin-platform-weapp'
import { IFs } from 'memfs'
import * as path from 'path'
import * as merge from 'webpack-merge'

import build from '../../index'
import { componentConfig } from '../../template/component'
import { IBuildConfig } from '../../utils/types'
import baseConfig from './config'

// interface EnsuredFs extends IFs {
//   join: () => string
// }

export function readDir(fs: IFs, dir: string) {
  let files: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach((item) => {
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

export function getOutput(stats, config: Partial<IBuildConfig> & { fs?: any }) {
  const fs: IFs = config.fs ?? stats.compilation.compiler.outputFileSystem

  const files = readDir(fs, config.outputRoot || '')
  const output = files.reduce((content, file) => {
    return `${content}
/** filePath: ${file} **/
${file === 'dist/runtime.js' ? '' : fs.readFileSync(file)}
`
  }, '')
  fs.rmdirSync(config.outputRoot || '', { recursive: true })
  return output
}

export async function compile(app: string, customConfig: Partial<IBuildConfig> = {}) {
  const appPath = path.resolve(__dirname, '../fixtures', app)
  const entryFilePath = helper.resolveMainFilePath(path.join(appPath, customConfig.sourceRoot || 'src', 'app'))

  process.chdir(appPath)

  const customChain = customConfig.webpackChain

  customConfig.webpackChain = (chain, _webpack, PARSE_AST_TYPE) => {
    const webpack = jest.requireActual('webpack')
    frameworkPatch(chain, webpack, customConfig)

    chain.merge({
      resolve: {
        alias: {
          '@tarojs/runtime': path.resolve(__dirname, '../mocks/taro-runtime'),
          '@tarojs/components$': path.resolve(__dirname, '../mocks/taro-components'),
          '@tarojs/react': path.resolve(__dirname, '../mocks/taro-react'),
          '@tarojs/taro': path.resolve(__dirname, '../mocks/taro'),
          '@tarojs/shared': path.resolve(__dirname, '../mocks/taro'),
          'regenerator-runtime': path.resolve(__dirname, '../mocks/deps'),
          '@tarojs/plugin-framework-react/dist/runtime': path.resolve(__dirname, '../mocks/taro'),
          '@tarojs/plugin-framework-vue2/dist/runtime': path.resolve(__dirname, '../mocks/taro'),
          '@tarojs/plugin-framework-vue3/dist/runtime': path.resolve(__dirname, '../mocks/taro'),
          react$: path.resolve(__dirname, '../mocks/react'),
          vue: path.resolve(__dirname, '../mocks/vue'),
          nervjs: path.resolve(__dirname, '../mocks/nerv'),
        },
      },
      optimization: {
        splitChunks: {
          cacheGroups: {
            taro: {
              name: 'taro',
              test: (module) => {
                return /taro-(components|runtime|react)/.test(module.request)
              },
              priority: 100,
            },
          },
        },
      },
    })

    if (typeof customChain === 'function') {
      customChain(chain, webpack, PARSE_AST_TYPE)
    }
  }

  if (!customConfig.buildAdapter) {
    const program = new Weapp({ helper } as any, {})
    customConfig.globalObject = program.globalObject
    customConfig.fileType = program.fileType
    customConfig.template = program.template
    customConfig.runtimePath = program.runtimePath
  }

  const config: IBuildConfig = merge(
    baseConfig,
    {
      mode: 'production',
      enableSourceMap: false,
      entry: {
        app: [entryFilePath],
      },
      framework: 'react',
      terser: {
        enable: true,
        config: {
          compress: false,
          mangle: false,
          extractComments: false,
          output: {
            comments: false,
            beautify: true,
          },
        },
      },
      buildAdapter: 'weapp',
    },
    customConfig
  )

  const stats = await build(appPath, config)

  return { stats, config }
}

/**
 * 处理不同框架的自定义逻辑
 * @param chain webpack-chain
 */
function frameworkPatch(chain, webpack, config) {
  const mockCtx = {
    initialConfig: {
      framework: config.framework || 'react',
    },
    modifyWebpackChain: (cb) => cb({ chain, webpack, data: { componentConfig } }),
    modifyViteConfig: (cb) => cb({ viteConfig: { plugins: [] }, componentConfig }),
    modifyRunnerOpts: (cb) => cb(config),
    onParseCreateElement: (cb) => cb({ nodeName: '', componentConfig }),
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
