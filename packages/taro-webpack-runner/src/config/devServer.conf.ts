import webpackDevServer from 'webpack-dev-server'

export default ({publicPath, contentBase, protocol, host, publicUrl}): webpackDevServer.Configuration => {
  return {
    disableHostCheck: process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    compress: true,
    contentBase,
    watchContentBase: true,
    hot: true,
    inline: true,
    quiet: true,
    publicPath,
    // stats: "errors-only",
    watchOptions: {
      ignored: /node_modules/
    },
    https: protocol === 'https',
    host: host,
    overlay: true,
    historyApiFallback: {
      disableDotRule: true
    },
    public: publicUrl
  }
}
