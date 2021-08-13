import WebpackDevServer = require('webpack-dev-server')

const devServerConf: WebpackDevServer.Configuration = {
  compress: true,
  disableHostCheck: true,
  historyApiFallback: {
    disableDotRule: true
  },
  host: '0.0.0.0',
  hot: true,
  useLocalIp: true,
  https: false,
  inline: true,
  open: true,
  overlay: true,
  port: 10086,
  quiet: true,
  watchContentBase: true,
  writeToDisk: false
}

export default devServerConf
