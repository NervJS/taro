import {
  ENTRY,
  OUTPUT_DIR,
  resolveScriptPath,
  SOURCE_DIR
} from '@tarojs/helper'
import { getPlatformType } from '@tarojs/shared'
import * as path from 'path'

import * as hooks from '../constant'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'inspect',
    optionsMap: {
      '-t, --type [typeName]': 'Build type, weapp/swan/alipay/tt/h5/quickapp/rn/qq/jd',
      '-o, --output [outputPath]': 'output config to outputPath'
    },
    synopsisList: [
      'taro inspect --type weapp',
      'taro inspect --type weapp --output inspect.config.js',
      'taro inspect --type weapp plugins',
      'taro inspect --type weapp module.rules.0'
    ],
    async fn ({ _, options }) {
      const { fs, chalk } = ctx.helper
      const platform = options.type || options.t

      verifyIsTaroProject(ctx)
      verifyPlatform(platform, chalk)

      const configName = ctx.platforms.get(platform)?.useConfigName || ''
      process.env.TARO_ENV = platform
      process.env.TARO_PLATFORM = getPlatformType(platform, configName)

      let config = getConfig(ctx, platform)
      config = {
        ...config,
        ...config[configName]
      }
      delete config.mini
      delete config.h5

      const isProduction = process.env.NODE_ENV === 'production'
      const outputPath = options.output || options.o
      const mode = outputPath ? 'output' : 'console'
      const extractPath = _[1]

      await ctx.applyPlugins({
        name: platform,
        opts: {
          config: {
            ...config,
            isWatch: !isProduction,
            mode: isProduction ? 'production' : 'development',
            async modifyWebpackChain (chain, webpack, data) {
              await ctx.applyPlugins({
                name: hooks.MODIFY_WEBPACK_CHAIN,
                initialVal: chain,
                opts: {
                  chain,
                  webpack,
                  data
                }
              })
            },
            onWebpackChainReady (chain) {
              const webpackConfig = chain.toConfig()
              const { toString } = chain.constructor
              const config = extractConfig(webpackConfig, extractPath)
              const res = toString(config)

              if (mode === 'console') {
                const highlight = require('cli-highlight').default
                console.log(highlight(res, { language: 'js' }))
              } else if (mode === 'output' && outputPath) {
                fs.writeFileSync(outputPath, res)
              }

              process.exit(0)
            }
          }
        }
      })
    }
  })
}

/** 是否 Taro 项目根路径 */
function verifyIsTaroProject (ctx: IPluginContext) {
  const { fs, chalk, PROJECT_CONFIG } = ctx.helper
  const { configPath } = ctx.paths

  if (!configPath || !fs.existsSync(configPath)) {
    console.log(chalk.red(`找不到项目配置文件${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`))
    process.exit(1)
  }
}

/** 检查平台类型 */
function verifyPlatform (platform, chalk) {
  if (typeof platform !== 'string') {
    console.log(chalk.red('请传入正确的编译类型！'))
    process.exit(0)
  }
}

/** 整理 config */
function getConfig (ctx: IPluginContext, platform: string) {
  const { initialConfig } = ctx
  const sourceDirName = initialConfig.sourceRoot || SOURCE_DIR
  const outputDirName = initialConfig.outputRoot || OUTPUT_DIR
  const sourceDir = path.join(ctx.appPath, sourceDirName)
  const entryFilePath = resolveScriptPath(path.join(sourceDir, ENTRY))

  const entry = {
    [ENTRY]: [entryFilePath]
  }

  return {
    ...initialConfig,
    entry,
    sourceRoot: sourceDirName,
    outputRoot: outputDirName,
    platform
  }
}

/** 按路径取出 webpackConfig 内的对应值 */
function extractConfig (webpackConfig, extractPath: string | undefined) {
  if (!extractPath) return webpackConfig

  const list = extractPath.split('.')
  return list.reduce((config, current) => config[current], webpackConfig)
}
