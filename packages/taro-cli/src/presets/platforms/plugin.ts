import * as path from 'path'

export default (ctx) => {
  ctx.registerPlatform({
    name: 'plugin',
    useConfigName: 'mini',
    async fn ({ config }) {
      const {
        plugin,
        isWatch
      } = ctx.runOpts
      const { sourcePath, outputPath } = ctx.paths
      const { chalk, fs, PLATFORMS } = ctx.helper
      const { WEAPP, ALIPAY } = PLATFORMS

      const PLUGIN_JSON = 'plugin.json'
      const PLUGIN_MOCK_JSON = 'plugin-mock.json'

      const typeMap = {
        [WEAPP]: '微信',
        [ALIPAY]: '支付宝'
      }
      if (plugin !== WEAPP && plugin !== ALIPAY) {
        console.log(chalk.red('目前插件编译仅支持 微信/支付宝 小程序！'))
        return
      }
      console.log(chalk.green(`开始编译${typeMap[plugin]}小程序插件`))

      async function buildWxPlugin () {
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            platform: 'weapp',
            isBuildPlugin: true,
            isWatch,
            outputRoot: `${config.outputRoot}/miniprogram`
          }
        })
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            platform: 'weapp',
            isBuildPlugin: false,
            isWatch,
            outputRoot: `${config.outputRoot}/miniprogram`
          }
        })
      }

      async function buildAlipayPlugin () {
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            platform: 'alipay',
            isWatch
          }
        })
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
