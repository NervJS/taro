import { IPluginContext } from '@tarojs/service'
import { getSassLoaderOption } from '@tarojs/runner-utils'

export default (ctx: IPluginContext) => {
  ctx.modifyWebpackChain(async ({ chain }) => {
    const sass = require('node-sass')
    const defaultSassLoaderOption = {
      sourceMap: true,
      implementation: sass,
      sassOptions: {
        outputStyle: 'expanded'
      }
    }
    const taroEnv = process.env.TARO_ENV
    if (taroEnv) {
      const currentPlatform = ctx.platforms.get(taroEnv)
      if (!currentPlatform) return
      const { sass: sassOption } = ctx.initialConfig
      const platformConfig = ctx.initialConfig[currentPlatform.useConfigName]
      const newSassLoaderOption = await getSassLoaderOption({
        sass: sassOption,
        sassLoaderOption: platformConfig!.sassLoaderOption
      })
      chain.module
        .rule('style')
          .test(/\.s[ac]ss$/i)
          .pre()
          .use('sass')
            .loader(require.resolve('sass-loader'))
            .options(Object.assign({}, defaultSassLoaderOption, newSassLoaderOption))
    }
  })
}
