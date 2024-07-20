import * as path from 'node:path'

import helper from '@tarojs/helper'
import { Weapp } from '@tarojs/plugin-platform-weapp'
import { isWebPlatform } from '@tarojs/shared'
import buildWeb from '@tarojs/webpack5-runner/dist/index.h5'
import buildMini from '@tarojs/webpack5-runner/dist/index.mini'
import merge from 'webpack-merge'

import baseConfig from './config'
import { frameworkPatch } from './helper'

import type { CommonBuildConfig, IH5BuildConfig, IMiniBuildConfig } from '../../../packages/taro-webpack5-runner/src/utils/types'

export function isMiniConfig (config: Partial<CommonBuildConfig>): config is IMiniBuildConfig {
  return config.buildAdapter === 'weapp' || config.platformType === 'mini'
}

export function setEnv (config: Partial<CommonBuildConfig>) {
  config.platformType ||= 'web'
  process.env.TARO_PLATFORM = config.platformType
  switch (config.platformType) {
    case 'mini':
      config.buildAdapter ||= 'weapp'
      break
    case 'web':
    default:
      config.buildAdapter ||= 'h5'
  }
  process.env.TARO_ENV = config.buildAdapter
}

export async function compile<T extends IMiniBuildConfig | IH5BuildConfig = CommonBuildConfig> (app: string, customConfig: Partial<T> = {}) {
  setEnv(customConfig)
  const isWeb = isWebPlatform()

  const appPath = path.resolve(__dirname, '../fixtures', app)
  const entryFilePath = helper.resolveMainFilePath(path.join(appPath, customConfig.sourceRoot || 'src', 'app'))

  process.chdir(appPath)

  const customChain = customConfig.webpackChain

  customConfig.webpackChain = (...args) => {
    const chain = args[0]
    const webpack = jest.requireActual('webpack')
    frameworkPatch(chain, webpack, customConfig)

    const alias = chain.resolve.alias
    alias.set('@tarojs/components$', path.resolve(__dirname, '../mocks/taro-components'))
    alias.set('@tarojs/plugin-framework-react/dist/runtime', path.resolve(__dirname, '../mocks/taro'))
    alias.set('@tarojs/plugin-framework-vue3/dist/runtime', path.resolve(__dirname, '../mocks/taro'))
    alias.set('@tarojs/runtime', path.resolve(__dirname, '../mocks/taro-runtime'))
    alias.set('@tarojs/shared', path.resolve(__dirname, '../mocks/taro-shared'))
    alias.set('@tarojs/taro', path.resolve(__dirname, '../mocks/taro'))
    alias.set('react$', path.resolve(__dirname, '../mocks/react'))
    alias.set('vue', path.resolve(__dirname, '../mocks/vue'))
    if (isWeb) {
      alias.set('@tarojs/router', path.resolve(__dirname, '../mocks/taro-router'))
      alias.set('@tarojs/components/lib/react', path.resolve(__dirname, '../mocks/taro-components'))
      alias.set('@tarojs/components/lib/vue3', path.resolve(__dirname, '../mocks/taro-components'))
      alias.set('@tarojs/components/loader', path.resolve(__dirname, '../mocks/taro-components'))
      alias.set('@tarojs/components/dist/taro-components/taro-components.css', path.resolve(__dirname, '../mocks/taro-components.css'))
      alias.set('react-dom$', path.resolve(__dirname, '../mocks/react'))
      alias.set('react-dom/client$', path.resolve(__dirname, '../mocks/react'))
    } else {
      alias.set('@tarojs/react', path.resolve(__dirname, '../mocks/taro-react'))
      alias.set('regenerator-runtime', path.resolve(__dirname, '../mocks/deps'))
    }

    if (typeof customChain === 'function') {
      // @ts-ignore
      customChain(...args)
    }
  }

  if (isMiniConfig(customConfig) && customConfig.buildAdapter === 'weapp') {
    const program = new Weapp({ helper } as any, {})
    program.modifyTemplate?.({})
    customConfig.globalObject = program.globalObject
    customConfig.fileType = program.fileType
    customConfig.template = program.template
    customConfig.runtimePath = program.runtimePath
  }

  const config: T = merge(baseConfig, {
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false
      },
    },
    buildAdapter: process.env.TARO_ENV,
    platformType: process.env.TARO_PLATFORM,
    enableSourceMap: false,
    entry: {
      app: [entryFilePath]
    },
    env: {
      FRAMEWORK: customConfig.framework || 'react',
      TARO_ENV: process.env.TARO_ENV,
      TARO_PLATFORM: process.env.TARO_PLATFORM,
    },
    framework: 'react',
    isWatch: false,
    mode: 'production',
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

  const build = isWeb ? buildWeb : buildMini
  const stats = await build(appPath, config)

  return { stats, config }
}

export { getOutput, readDir } from './helper'
