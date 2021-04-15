import * as path from 'path'
import { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'plugin',
    useConfigName: 'mini',
    async fn ({ config }) {
      const {
        options,
        _
      } = ctx.runOpts
      const { sourcePath, outputPath } = ctx.paths
      const { chalk, fs, PLATFORMS } = ctx.helper
      const { WEAPP, ALIPAY } = PLATFORMS
      const typeMap = {
        [WEAPP]: '微信',
        [ALIPAY]: '支付宝'
      }
      const { plugin, isWatch } = options
      if (plugin !== WEAPP && plugin !== ALIPAY) {
        console.log(chalk.red('目前插件编译仅支持 微信/支付宝 小程序！'))
        return
      }
      console.log(chalk.green(`开始编译${typeMap[plugin]}小程序插件`))

      async function buildWxPlugin () {
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            config: {
              ...config,
              isBuildPlugin: true,
              isWatch,
              outputRoot: `${config.outputRoot}`,
              platform: WEAPP,
              needClearOutput: false
            },
            options: Object.assign({}, options, {
              platform: WEAPP
            }),
            _
          }
        })
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            config: {
              ...config,
              isBuildPlugin: false,
              isWatch,
              outputRoot: `${config.outputRoot}/miniprogram`,
              platform: WEAPP,
              needClearOutput: false
            },
            options: Object.assign({}, options, {
              platform: WEAPP
            }),
            _
          }
        })
      }

      async function buildAlipayPlugin () {
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            platform: 'alipay',
            config: {
              ...config,
              isWatch,
              outputRoot: config.outputRoot,
              platform: ALIPAY,
              needClearOutput: false
            },
            options: Object.assign({}, options, {
              platform: ALIPAY
            }),
            _
          }
        })
        const PLUGIN_JSON = 'plugin.json'
        const PLUGIN_MOCK_JSON = 'plugin-mock.json'
        const pluginJson = path.join(sourcePath, PLUGIN_JSON)
        const pluginMockJson = path.join(sourcePath, PLUGIN_MOCK_JSON)

        if (fs.existsSync(pluginJson)) {
          fs.copyFileSync(pluginJson, path.join(outputPath, PLUGIN_JSON))
        }
        if (fs.existsSync(pluginMockJson)) {
          fs.copyFileSync(pluginMockJson, path.join(outputPath, PLUGIN_MOCK_JSON))
        }
      }

      switch (plugin) {
        case WEAPP:
          await buildWxPlugin()
          break
        case ALIPAY:
          await buildAlipayPlugin()
          break
        default:
          console.log(chalk.red('输入插件类型错误，目前只支持 weapp/alipay 插件类型'))
          break
      }
    }
  })
}
