import { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext, opts) => {
  ctx.modifyWebpackChain(async ({ chain }) => {
    const { enableSourceMap = true } = opts
    const { recursiveMerge } = ctx.helper
    const TerserPlugin = require('terser-webpack-plugin')
    const defaultTerserOption = {
      keep_fnames: true,
      output: {
        comments: false,
        keep_quoted_props: true,
        quote_keys: true,
        beautify: false
      },
      warnings: false
    }
    const terser = ctx.initialConfig.terser
    const isTerserEnabled = (terser && terser.enable === false)
      ? false
      : true
    if (isTerserEnabled) {
      chain.merge({
        optimization: {
          minimizer: [
            new TerserPlugin({
              cache: true,
              parallel: true,
              sourceMap: enableSourceMap,
              terserOptions: recursiveMerge({}, defaultTerserOption, terser ? terser.config || {} : {})
            })
          ]
        }
      })
    }
  })
}
