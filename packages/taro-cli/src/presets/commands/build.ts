import {
  MessageKind,
  validateConfig
} from '@tarojs/plugin-doctor'

import { extractCompileEntry } from '../../util/appConfig'
import * as hooks from '../constant'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'build',
    optionsMap: {
      '--type [typeName]': 'Build type, weapp/swan/alipay/tt/qq/jd/h5/rn',
      '--watch': 'Watch mode',
      '--env [env]': 'Value for process.env.NODE_ENV',
      '--pages': 'Specify the pages to be compiled, separate multiple by comma',
      '--components': 'Specify the components to be compiled, separate multiple by comma',
      '--mode [mode]': 'Value of dotenv extname',
      '-p, --port [port]': 'Specified port',
      '--no-build': 'Do not build project',
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
      '--shared-runtime': 'Externalize Taro/React runtime to a shared global so business packages do not bundle their own copy',
      '--shared-runtime-mode [mode]': 'Shared runtime mode, only "split" is supported (sync core per package + shared async subpackage)',
      '--plugin [typeName]': 'Build Taro plugin project, weapp',
      '--env-prefix [envPrefix]': "Provide the dotEnv varables's prefix",
      '--no-inject-global-style': '[H5] Do not inject global style',
      '--no-check': 'Do not check config is valid or not',
    },
    synopsisList: [
      'taro build --type weapp',
      'taro build --type weapp --watch',
      'taro build --type weapp --watch --pages pages/index/index',
      'taro build --type weapp --env production',
      'taro build --type weapp --blended',
      'taro build --type weapp --no-build',
      'taro build native-components --type weapp',
      'taro build --type weapp --new-blended',
      'taro build --type weapp --new-blended --shared-runtime --shared-runtime-mode split',
      'taro build --plugin weapp --watch',
      'taro build --plugin weapp',
      'taro build --type weapp --mode prepare --env-prefix TARO_APP_',
    ],
    async fn(opts) {
      const { options, config, _ } = opts
      const { platform, isWatch, blended, newBlended, withoutBuild, noInjectGlobalStyle, noCheck, sharedRuntime, sharedRuntimeMode } = options
      const { fs, chalk, PROJECT_CONFIG } = ctx.helper
      const { outputPath, configPath } = ctx.paths
      const { args } = options

      if (!configPath || !fs.existsSync(configPath)) {
        console.log(chalk.red(`找不到项目配置文件${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`))
        process.exit(1)
      }

      if (typeof platform !== 'string') {
        console.log(chalk.red('请传入正确的编译类型！'))
        process.exit(0)
      }

      // 共享运行时（方案二 split）flag 校验，fail-fast
      if (sharedRuntimeMode != null && !sharedRuntime) {
        console.log(chalk.red('--shared-runtime-mode 必须与 --shared-runtime 一起使用。'))
        process.exit(1)
      }
      if (sharedRuntime) {
        // 守卫顺序：plugin → native-components → 平台白名单 → mode。
        // plugin 需先判：cli.ts:161 会把 platform 无条件重写为 'plugin'，若先走白名单，
        // plugin 场景会被更笼统的"平台不支持"拦下，错过精准提示。
        //
        // 小程序插件（--plugin）模式：插件宿主运行时无共享上下文，方案二不支持。
        if (typeof args?.plugin === 'string') {
          console.log(chalk.red(
            '小程序插件（--plugin）模式不适用方案二 split：插件宿主运行时无共享上下文。' +
            '请去掉 --shared-runtime。'
          ))
          process.exit(1)
        }
        // native-components 模式：BuildNativePlugin 会移除 app.js entry，同步核无注入点，
        // 但 externals 仍生效——产物读全局但无人挂载，运行时崩。方案二不支持此模式。
        if (_[1] === 'native-components') {
          console.log(chalk.red(
            'native-components 模式不适用方案二 split：无 app.js 入口，同步核无注入点，' +
            '产物运行时会崩。请去掉 --shared-runtime。'
          ))
          process.exit(1)
        }
        // 平台白名单：方案二 split 仅适用于小程序端。h5/rn/harmony 走独立编译栈，
        // 不经过 MiniCombination/externals，方案二 flag 传入会静默失效——编译期直接拒。
        const MINI_PLATFORMS = new Set(['weapp', 'alipay', 'swan', 'tt', 'qq', 'jd', 'ascf'])
        if (!MINI_PLATFORMS.has(platform)) {
          console.log(chalk.red(
            `--shared-runtime 当前仅支持小程序端 (${Array.from(MINI_PLATFORMS).join('/')})，收到 "${platform}"。` +
            'h5/rn/harmony 请去掉 --shared-runtime。'
          ))
          process.exit(1)
        }
        // 当前仅支持 split；未显式指定时默认 split。非法值 fail-fast，不静默回退
        const mode = sharedRuntimeMode ?? 'split'
        if (mode !== 'split') {
          console.log(chalk.red(`--shared-runtime-mode 仅支持 "split"，收到 "${sharedRuntimeMode}"。`))
          process.exit(1)
        }
      }

      // 校验 Taro 项目配置
      if (!noCheck) {
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
          checkResult.messages.forEach((message) => {
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
            withoutBuild,
            newBlended,
            sharedRuntime,
            // 已在上方校验，开启共享运行时时规范化为 split
            sharedRuntimeMode: sharedRuntime ? 'split' : undefined,
            noInjectGlobalStyle,
            async modifyAppConfig (appConfig) {
              extractCompileEntry(appConfig, args, ctx)

              await ctx.applyPlugins({
                name: hooks.MODIFY_APP_CONFIG,
                opts: {
                  appConfig
                }
              })
            },
            async modifyWebpackChain (chain, webpack, data) {
              await ctx.applyPlugins({
                name: hooks.MODIFY_WEBPACK_CHAIN,
                initialVal: chain,
                opts: {
                  chain,
                  webpack,
                  data,
                },
              })
            },
            async modifyViteConfig(viteConfig, data, viteCompilerContext) {
              await ctx.applyPlugins({
                name: hooks.MODIFY_VITE_CONFIG,
                initialVal: viteConfig,
                opts: {
                  viteConfig,
                  data,
                  viteCompilerContext
                },
              })
            },
            async modifyBuildAssets(assets, miniPlugin) {
              await ctx.applyPlugins({
                name: hooks.MODIFY_BUILD_ASSETS,
                initialVal: assets,
                opts: {
                  assets,
                  miniPlugin,
                },
              })
            },
            async modifyMiniConfigs(configMap) {
              await ctx.applyPlugins({
                name: hooks.MODIFY_MINI_CONFIGS,
                initialVal: configMap,
                opts: {
                  configMap,
                },
              })
            },
            async modifyComponentConfig(componentConfig, config) {
              await ctx.applyPlugins({
                name: hooks.MODIFY_COMPONENT_CONFIG,
                opts: {
                  componentConfig,
                  config,
                },
              })
            },
            async onCompilerMake(compilation, compiler, plugin) {
              await ctx.applyPlugins({
                name: hooks.ON_COMPILER_MAKE,
                opts: {
                  compilation,
                  compiler,
                  plugin,
                },
              })
            },
            async onParseCreateElement(nodeName, componentConfig) {
              await ctx.applyPlugins({
                name: hooks.ON_PARSE_CREATE_ELEMENT,
                opts: {
                  nodeName,
                  componentConfig,
                },
              })
            },
            async onBuildFinish({ error, stats, isWatch }) {
              await ctx.applyPlugins({
                name: hooks.ON_BUILD_FINISH,
                opts: {
                  error,
                  stats,
                  isWatch,
                },
              })
            },
          },
        },
      })
      await ctx.applyPlugins(hooks.ON_BUILD_COMPLETE)
    },
  })
}

async function checkConfig ({ projectConfig, helper }) {
  const result = await validateConfig(projectConfig, helper)
  return result
}
