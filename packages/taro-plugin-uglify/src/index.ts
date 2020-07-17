import { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext, opts) => {
  ctx.modifyWebpackChain(async ({ chain }) => {
    const { enableSourceMap = true } = opts
    const { recursiveMerge } = ctx.helper
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
    const defaultUglifyJsOption = {
      keep_fnames: true,
      output: {
        comments: false,
        keep_quoted_props: true,
        quote_keys: true,
        beautify: false
      },
      warnings: false
    }
    const uglify = ctx.initialConfig.uglify
    const isUglifyEnabled = (uglify && uglify.enable === false)
      ? false
      : true
    if (isUglifyEnabled) {
      chain.merge({
        optimization: {
          minimizer: [
            new UglifyJsPlugin({
              cache: true,
              parallel: true,
              sourceMap: enableSourceMap,
              uglifyOptions: recursiveMerge({}, defaultUglifyJsOption, uglify ? uglify.config || {} : {})
            })
          ]
        }
      })
    }
  })
}
