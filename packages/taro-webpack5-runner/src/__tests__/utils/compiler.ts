import helper from '@tarojs/helper'
import { Weapp } from '@tarojs/plugin-platform-weapp'
import { isWebPlatform } from '@tarojs/shared'
import * as path from 'path'
import * as merge from 'webpack-merge'

import buildWeb from '../../../dist/index.h5'
import buildMini from '../../../dist/index.mini'
import baseConfig from './config'
import { frameworkPatch } from './helper'

import type { CommonBuildConfig, H5BuildConfig, MiniBuildConfig } from '../../utils/types'

export function isMiniConfig (config: Partial<CommonBuildConfig>): config is MiniBuildConfig {
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

export async function compile<T extends MiniBuildConfig | H5BuildConfig = CommonBuildConfig> (app: string, customConfig: Partial<T> = {}) {
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
    alias.set('@tarojs/plugin-framework-vue2/dist/runtime', path.resolve(__dirname, '../mocks/taro'))
    alias.set('@tarojs/plugin-framework-vue3/dist/runtime', path.resolve(__dirname, '../mocks/taro'))
    // alias.set('@tarojs/runtime', path.resolve(__dirname, '../mocks/taro-runtime'))
    alias.set('@tarojs/shared', path.resolve(__dirname, '../mocks/taro-shared'))
    alias.set('@tarojs/taro', path.resolve(__dirname, '../mocks/taro'))
    alias.set('react$', path.resolve(__dirname, '../mocks/react'))
    alias.set('vue', path.resolve(__dirname, '../mocks/vue'))
    alias.set('nervjs', path.resolve(__dirname, '../mocks/nerv'))
    if (isWeb) {
      alias.set('@tarojs/router', path.resolve(__dirname, '../mocks/taro-router'))
      alias.set('@tarojs/components/lib/react', path.resolve(__dirname, '../mocks/taro-components'))
      alias.set('@tarojs/components/lib/vue', path.resolve(__dirname, '../mocks/taro-components'))
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
