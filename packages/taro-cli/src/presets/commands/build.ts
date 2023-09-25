import {
  MessageKind,
  validateConfig
} from '@tarojs/plugin-doctor'

import * as hooks from '../constant'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'build',
    optionsMap: {
      '--type [typeName]': 'Build type, weapp/swan/alipay/tt/qq/jd/h5/rn',
      '--watch': 'Watch mode',
      '--env [env]': 'Value for process.env.NODE_ENV',
      '--mode [mode]': 'Value of dotenv extname',
      '-p, --port [port]': 'Specified port',
      '--platform': '[rn] Specific React-Native build target: android / ios, android is default value',
      '--reset-cache': '[rn] Clear transform cache',
      '--public-path': '[rn] Assets public path',
      '--bundle-output': '[rn] File name where to store the resulting bundle',
      '--sourcemap-output': '[rn] File name where to store the sourcemap file for resulting bundle',
      '--sourcemap-use-absolute-path': '[rn]  Report SourceMapURL using its full path',
      '--sourcemap-sources-root': '[rn] Path to make sourcemaps sources entries relative to',
      '--assets-dest': '[rn] Directory name where to store assets referenced in the bundle',
      '--qr': '[rn] Print qrcode of React-Native bundle server',
      '--blended': 'Blended Taro project in an original MiniApp project',
      '--new-blended': 'Blended Taro project in an original MiniApp project while supporting building components independently',
      '--plugin [typeName]': 'Build Taro plugin project, weapp',
      '--env-prefix [envPrefix]': "Provide the dotEnv varables's prefix",
    },
    synopsisList: [
      'taro build --type weapp',
      'taro build --type weapp --watch',
      'taro build --type weapp --env production',
      'taro build --type weapp --blended',
      'taro build native-components --type weapp',
      'taro build --type weapp --new-blended',
      'taro build --plugin weapp --watch',
      'taro build --plugin weapp',
      'taro build --type weapp --mode prepare --env-prefix TARO_APP_'
    ],
    async fn (opts) {
      const { options, config, _ } = opts
      const { platform, isWatch, blended, newBlended } = options
      const { fs, chalk, PROJECT_CONFIG } = ctx.helper
      const { outputPath, configPath } = ctx.paths

      if (!configPath || !fs.existsSync(configPath)) {
        console.log(chalk.red(`找不到项目配置文件${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`))
        process.exit(1)
      }

      if (typeof platform !== 'string') {
        console.log(chalk.red('请传入正确的编译类型！'))
        process.exit(0)
      }

      // 校验 Taro 项目配置
      const checkResult = await checkConfig({
        projectConfig: ctx.initialConfig,
        helper: ctx.helper
      })
      if (!checkResult.isValid) {
        const ERROR = chalk.red('[✗] ')
        const WARNING = chalk.yellow('[!] ')
        const SUCCESS = chalk.green('[✓] ')

        const lineChalk = chalk.hex('#fff')
        const errorChalk = chalk.hex('#f00')
        console.log(errorChalk(`Taro 配置有误，请检查！ (${configPath})`))
        checkResult.messages.forEach(message => {
          switch (message.kind) {
            case MessageKind.Error:
              console.log('  ' + ERROR + lineChalk(message.content))
              break
            case MessageKind.Success:
              console.log('  ' + SUCCESS + lineChalk(message.content))
              break
            case MessageKind.Warning:
              console.log('  ' + WARNING + lineChalk(message.content))
              break
            case MessageKind.Manual:
              console.log('  ' + lineChalk(message.content))
              break
            default:
              break
          }
        })
        console.log('')
        process.exit(0)
      }

      const isProduction = process.env.NODE_ENV === 'production' || !isWatch

      // dist folder
      fs.ensureDirSync(outputPath)

      // is build native components mode?
      const isBuildNativeComp = _[1] === 'native-components'

      await ctx.applyPlugins(hooks.ON_BUILD_START)
      await ctx.applyPlugins({
        name: platform,
        opts: {
          config: {
            ...config,
            isWatch,
            mode: isProduction ? 'production' : 'development',
            blended,
            isBuildNativeComp,
            newBlended,
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
            async modifyBuildAssets (assets, miniPlugin) {
              await ctx.applyPlugins({
                name: hooks.MODIFY_BUILD_ASSETS,
                initialVal: assets,
                opts: {
                  assets,
                  miniPlugin
                }
              })
            },
            async modifyMiniConfigs (configMap) {
              await ctx.applyPlugins({
                name: hooks.MODIFY_MINI_CONFIGS,
                initialVal: configMap,
                opts: {
                  configMap
                }
              })
            },
            async modifyComponentConfig (componentConfig, config) {
              await ctx.applyPlugins({
                name: hooks.MODIFY_COMPONENT_CONFIG,
                opts: {
                  componentConfig,
                  config
                }
              })
            },
            async onCompilerMake (compilation, compiler, plugin) {
              await ctx.applyPlugins({
                name: hooks.ON_COMPILER_MAKE,
                opts: {
                  compilation,
                  compiler,
                  plugin
                }
              })
            },
            async onParseCreateElement (nodeName, componentConfig) {
              await ctx.applyPlugins({
                name: hooks.ON_PARSE_CREATE_ELEMENT,
                opts: {
                  nodeName,
                  componentConfig
                }
              })
            },
            async onBuildFinish ({ error, stats, isWatch }) {
              await ctx.applyPlugins({
                name: hooks.ON_BUILD_FINISH,
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
      await ctx.applyPlugins(hooks.ON_BUILD_COMPLETE)
    }
  })
}

async function checkConfig ({ projectConfig, helper }) {
  const result = await validateConfig(projectConfig, helper)
  return result
}
