import { IPluginContext } from '@tarojs/service'

import configValidator from '../../doctor/configValidator'

export default (ctx: IPluginContext) => {
  registerBuildHooks(ctx)
  ctx.registerCommand({
    name: 'build',
    optionsMap: {
      '--type [typeName]': 'Build type, weapp/swan/alipay/tt/h5/quickapp/rn/qq/jd',
      '--watch': 'Watch mode',
      '--page [pagePath]': 'Build one page',
      '--component [pagePath]': 'Build one component',
      '--env [env]': 'Env type',
      '--ui': 'Build Taro UI library',
      '--ui-index [uiIndexPath]': 'Index file for build Taro UI library',
      '--plugin [typeName]': 'Build Taro plugin project, weapp',
      '-p, --port [port]': 'Specified port',
      '--release': 'Release quickapp'
    },
    async fn (opts) {
      const { platform, config } = opts
      const { fs, chalk, PROJECT_CONFIG } = ctx.helper
      const { outputPath, configPath } = ctx.paths
      const { isWatch, envHasBeenSet } = ctx.runOpts
      if (!configPath || !fs.existsSync(configPath)) {
        console.log(chalk.red(`找不到项目配置文件${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`))
        process.exit(1)
      }
      const checkResult = await checkConfig({
        configPath,
        projectConfig: ctx.initialConfig
      })
      if (checkResult.lines.length) {
        const NOTE_VALID = chalk.yellow('[!] ')
        const NOTE_INVALID = chalk.red('[✗] ')

        const lineChalk = chalk.hex('#fff')
        const errorChalk = chalk.hex('#f00')
        console.log(errorChalk(`Taro 配置有误，请检查！ (${configPath})`))
        checkResult.lines.forEach(line => {
          console.log(
            '  ' +
            (line.valid ? NOTE_VALID : NOTE_INVALID) +
            lineChalk(line.desc)
          )
        })
      }
      if (typeof platform !== 'string') {
        console.log(chalk.red('请传入正确的编译类型！'))
        process.exit(0)
      }
      process.env.TARO_ENV = platform
      fs.ensureDirSync(outputPath)
      let isProduction = false
      if (!envHasBeenSet) {
        isProduction = process.env.NODE_ENV === 'production' || !isWatch
      }

      await ctx.applyPlugins('onBuildStart')
      await ctx.applyPlugins({
        name: platform,
        opts: {
          config: {
            ...config,
            isWatch,
            mode: isProduction ? 'production' : 'development',
            async modifyWebpackChain (chain, webpack) {
              await ctx.applyPlugins({
                name: 'modifyWebpackChain',
                initialVal: chain,
                opts: {
                  chain,
                  webpack
                }
              })
            },
            async modifyBuildAssets (assets) {
              await ctx.applyPlugins({
                name: 'modifyBuildAssets',
                initialVal: assets,
                opts: {
                  assets
                }
              })
            },
            async modifyMiniConfigs (configMap) {
              await ctx.applyPlugins({
                name: 'modifyMiniConfigs',
                initialVal: configMap,
                opts: {
                  configMap
                }
              })
            },
            async onBuildFinish ({ error, stats, isWatch }) {
              await ctx.applyPlugins({
                name: 'onBuildFinish',
                opts: {
                  error,
                  stats,
                  isWatch
                }
              })
            }
          }
        }
      })
    }
  })
}

function registerBuildHooks (ctx) {
  [
    'modifyWebpackChain',
    'modifyBuildAssets',
    'modifyMiniConfigs',
    'onBuildStart',
    'onBuildFinish'
  ].forEach(methodName => {
    ctx.registerMethod(methodName)
  })
}

async function checkConfig ({ projectConfig, configPath }) {
  const result = await configValidator({
    configPath,
    projectConfig
  })
  return result
}
