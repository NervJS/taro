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
      const { chalk, fs } = ctx.helper

      const PLUGIN_JSON = 'plugin.json'
      const PLUGIN_MOCK_JSON = 'plugin-mock.json'
      
      async function buildWxPlugin () {
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            platform: 'plugin',
            isWatch
          }
        })
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            platform: 'weapp',
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
        case 'weapp':
          await buildWxPlugin()
          break
        case 'alipay':
          await buildAlipayPlugin()
          break
        default:
          console.log(chalk.red('输入插件类型错误，目前只支持 weapp/alipay 插件类型'))
          break
      }
    }
  })
}