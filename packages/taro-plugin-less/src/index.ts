import { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext, opts) => {
  ctx.modifyWebpackChain(async ({ chain }) => {
    const { enableSourceMap = true } = opts
    const taroEnv = process.env.TARO_ENV
    if (taroEnv) {
      const currentPlatform = ctx.platforms.get(taroEnv)
      if (!currentPlatform) return
      const less = require('less')
      const platformConfig = ctx.initialConfig[currentPlatform.useConfigName]
      const lessLoaderOption = platformConfig.lessLoaderOption
      const defaultLessLoaderOption = {
        sourceMap: enableSourceMap,
        implementation: less
      }

      chain.module
        .rule('addChainStyleLess')
          .test(ctx.helper.REG_LESS)
          .pre()
          .use('less')
            .loader(require.resolve('less-loader'))
            .options(Object.assign({}, defaultLessLoaderOption, lessLoaderOption))
            .end()
    }
  })
}
