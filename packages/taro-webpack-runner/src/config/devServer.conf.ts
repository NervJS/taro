import * as webpackDevServer from 'webpack-dev-server'
import { merge } from 'lodash'

export default (config: Partial<webpackDevServer.Configuration>): webpackDevServer.Configuration => {
  return merge({
    compress: true,
    disableHostCheck: process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    hot: true,
    inline: true,
    overlay: true,
    quiet: true,
    watchContentBase: true
  }, config)
}
