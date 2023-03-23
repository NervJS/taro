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
      const { chalk, PLATFORMS } = ctx.helper
      const { WEAPP, ALIPAY, JD } = PLATFORMS
      const typeMap = {
        [JD]: '京东',
        [WEAPP]: '微信',
        [ALIPAY]: '支付宝'
      }
      const { plugin, isWatch } = options
      if (plugin !== WEAPP && plugin !== ALIPAY && plugin !== JD) {
        console.log(chalk.red('目前插件编译仅支持 微信/支付宝/京东 小程序！'))
        return
      }
      console.log(chalk.green(`开始编译${typeMap[plugin]}小程序插件`))
      async function buildPlugin (type) {
        process.env.TARO_ENV = type
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            config: {
              ...config,
              isBuildPlugin: true,
              isWatch,
              outputRoot: `${config.outputRoot}`,
              platform: type,
              needClearOutput: false
            },
            options: Object.assign({}, options, {
              platform: type
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
              platform: type,
              needClearOutput: false
            },
            options: Object.assign({}, options, {
              platform: type
            }),
            _
          }
        })
      }

      buildPlugin(plugin)
    }
  })
}
