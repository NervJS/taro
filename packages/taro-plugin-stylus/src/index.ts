import { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext, opts) => {
  ctx.modifyWebpackChain(async ({ chain }) => {
    const { enableSourceMap = true } = opts
    const taroEnv = process.env.TARO_ENV
    if (taroEnv) {
      const currentPlatform = ctx.platforms.get(taroEnv)
      if (!currentPlatform) return
      const platformConfig = ctx.initialConfig[currentPlatform.useConfigName]
      const stylusLoaderOption = platformConfig.stylusLoaderOption
      const defaultStylusLoaderOption = {
        sourceMap: enableSourceMap
      }

      chain.module
        .rule('addChainStyleStylus')
          .test(ctx.helper.REG_STYLUS)
          .pre()
          .use('stylus')
            .loader(require.resolve('stylus-loader'))
            .options(Object.assign({}, defaultStylusLoaderOption, stylusLoaderOption))
            .end()
    }
  })
}
