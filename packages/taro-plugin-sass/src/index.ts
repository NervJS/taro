import { IPluginContext } from '@tarojs/service'
import { getSassLoaderOption } from '@tarojs/runner-utils'

export default (ctx: IPluginContext, opts) => {
  ctx.modifyWebpackChain(async ({ chain }) => {
    const { enableSourceMap = true } = opts
    const taroEnv = process.env.TARO_ENV
    if (taroEnv) {
      const sass = require('node-sass')
      const currentPlatform = ctx.platforms.get(taroEnv)
      if (!currentPlatform) return
      const { sass: sassOption } = ctx.initialConfig
      const platformConfig = ctx.initialConfig[currentPlatform.useConfigName]

      const defaultSassLoaderOption = {
        sourceMap: enableSourceMap,
        implementation: sass,
        sassOptions: {
          outputStyle: 'expanded'
        }
      }
      const newSassLoaderOption = await getSassLoaderOption({
        sass: sassOption,
        sassLoaderOption: platformConfig!.sassLoaderOption
      })
      chain.module
        .rule('addChainStyleSass')
          .test(ctx.helper.REG_SASS)
          .pre()
          .use('resolveUrl')
            .loader(require.resolve('resolve-url-loader'))
            .end()
          .use('sass')
            .loader(require.resolve('sass-loader'))
            .options(Object.assign({}, defaultSassLoaderOption, newSassLoaderOption))
            .end()
    }
  })
}
