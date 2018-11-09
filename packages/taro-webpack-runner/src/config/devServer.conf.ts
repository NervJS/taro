export default {
  compress: true,
  disableHostCheck: process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
  historyApiFallback: { disableDotRule: true },
  host: '127.0.0.1',
  hot: true,
  https: false,
  inline: true,
  open: true,
  overlay: true,
  port: 10086,
  quiet: true,
  watchContentBase: true,
  watchOptions: { ignored: /node_modules/ }
}
