import * as path from 'node:path'

import helper from '@tarojs/helper'
import { Weapp } from '@tarojs/plugin-platform-weapp'
import { isWebPlatform } from '@tarojs/shared'
import { CommonBuildConfig, ViteH5BuildConfig, ViteMiniBuildConfig } from '@tarojs/taro/types/compile/viteCompilerContext'
import buildWeb from '@tarojs/vite-runner/dist/index.h5'
import buildMini from '@tarojs/vite-runner/dist/index.mini'
import { defineConfig } from 'vite'

import baseConfig from './config'
import { frameworkPatch } from './helper'

export function isMiniConfig (config) {
  return config.buildAdapter === 'weapp' || config.platformType === 'mini'
}

export function setEnv (config) {
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
export async function compile<T extends ViteMiniBuildConfig | ViteH5BuildConfig = CommonBuildConfig> (app: string, customConfig: Partial<T> = {}) {
  setEnv(customConfig)
  const isWeb = isWebPlatform()

  const appPath = path.resolve(__dirname, '../fixtures', app)
  const entryFilePath = helper.resolveMainFilePath(path.join(appPath, customConfig.sourceRoot || 'src', 'app'))
  console.log('customConfig', customConfig)
  console.log('appPath', appPath)

  const customChain = customConfig.webpackChain
  customConfig.webpackChain = (...args) => {
    const chain = args[0]
    const webpack = jest.requireActual('vite')
    frameworkPatch(chain, webpack, customConfig)
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

  const config: T = defineConfig({
    ...baseConfig,
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
    },
    resolve: {
      alias: [
        { find: '@tarojs/components', replacement: `${__dirname}/taro-components` },
        { find: '@tarojs/plugin-framework-react/dist/runtime', replacement: `${__dirname}/taro` },
        { find: '@tarojs/plugin-framework-vue3/dist/runtime', replacement: `${__dirname}/taro` },
        { find: '@tarojs/runtime', replacement: `${__dirname}/taro-runtime` },
        { find: '@tarojs/shared', replacement: `${__dirname}/taro-shared` },
        { find: '@tarojs/taro', replacement: `${__dirname}/taro` },
        { find: 'react', replacement: `${__dirname}/react` },
        { find: 'vue', replacement: `${__dirname}/vue` },
        { find: 'regenerator-runtime', replacement: `${__dirname}/deps` },
        ...isWeb ? [
          { find: '@tarojs/router', replacement: `${__dirname}/taro-router` },
          { find: '@tarojs/components/lib/react', replacement: `${__dirname}/taro-components` },
          { find: '@tarojs/components/lib/vue3', replacement: `${__dirname}/taro-components` },
          { find: '@tarojs/components/loader', replacement: `${__dirname}/taro-components` },
          { find: '@tarojs/components/dist/taro-components/taro-components.css', replacement: `${__dirname}/taro-components.css` },
          { find: 'react-dom', replacement: `${__dirname}/react` },
          { find: 'react-dom/client', replacement: `${__dirname}/react` }
        ] : [
          { find: '@tarojs/react', replacement: `${__dirname}/taro-react` }
        ]
      ]
    },
    ...customConfig,
    esbuild: { minify: undefined },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          app: entryFilePath
        }
      }
    }
  })

  const stats = await (isWeb ? buildWeb : buildMini)(appPath, config)

  return { stats, config }
}

export { getOutput, readDir } from './helper'
