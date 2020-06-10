import * as path from 'path'
import * as merge from 'webpack-merge'
import { resolveMainFilePath } from '@tarojs/helper'
import { IFs } from 'memfs'

import baseConfig from './config'
import { IBuildConfig } from '../../src/utils/types'
import build from '../../src/index'

interface EnsuredFs extends IFs {
  join: () => string
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

export function getOutput (stats, config: Partial<IBuildConfig> & { fs?: any }) {
  const fs: IFs = config.fs ?? stats.compilation.compiler.outputFileSystem

  const files = readDir(fs, config.outputRoot)
  const output = files.reduce((content, file) => {
    return `${content}
/** filePath: ${file} **/
${fs.readFileSync(file)}
`
  }, '')
  return output
}

export async function compile (app: string, customConfig: Partial<IBuildConfig> = {}) {
  const appPath = path.resolve(__dirname, '../fixtures', app)
  const entryFilePath = resolveMainFilePath(path.join(appPath, customConfig.sourceRoot || 'src', 'app'))

  process.chdir(appPath)

  const customChain = customConfig.webpackChain

  customConfig.webpackChain = (chain, webpack, PARSE_AST_TYPE) => {
    chain.merge({
      resolve: {
        alias: {
          '@tarojs/runtime': path.resolve(__dirname, '../mocks/taro-runtime'),
          '@tarojs/components$': path.resolve(__dirname, '../mocks/taro-components'),
          '@tarojs/react': path.resolve(__dirname, '../mocks/taro-react'),
          '@tarojs/taro': path.resolve(__dirname, '../mocks/taro'),
          react: path.resolve(__dirname, '../mocks/react'),
          vue: path.resolve(__dirname, '../mocks/vue'),
          nervjs: path.resolve(__dirname, '../mocks/nerv')
        }
      },
      optimization: {
        splitChunks: {
          cacheGroups: {
            taro: {
              name: 'taro',
              test: module => {
                return /taro-(components|runtime|react)/.test(module.request)
              },
              priority: 100
            }
          }
        }
      }
    })

    if (typeof customChain === 'function') {
      customChain(chain, webpack, PARSE_AST_TYPE)
    }
  }

  const config: IBuildConfig = merge(baseConfig, {
    mode: 'production',
    enableSourceMap: false,
    entry: {
      app: [entryFilePath]
    },
    framework: 'react',
    buildAdapter: 'weapp',
    terser: {
      enable: true,
      config: {
        compress: false,
        mangle: false,
        extractComments: false,
        output: {
          comments: false,
          beautify: true
        }
      }
    }
  }, customConfig)

  const stats = await build(appPath, config)
  return { stats, config }
}
