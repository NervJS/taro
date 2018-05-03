const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const WebpackDevServer = require('webpack-dev-server')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const opn = require('opn')
const ora = require('ora')
const chalk = require('chalk')
const formatWebpackMessage = require('./util/format_webpack_message')

const baseConf = require('./config/base.conf')
const devConf = require('./config/dev.conf')
const devServerConf = require('./config/devServer.conf')
const prodConf = require('./config/prod.conf')
const buildConf = require('./config/build.conf')
const utils = require('./util')

const appPath = process.cwd()

exports.buildProd = function (config) {
  config = Object.assign({}, buildConf, config)
  const webpackConf = webpackMerge(baseConf(config), prodConf(config))
  webpackConf.entry = config.entry
  webpackConf.output = {
    path: path.join(appPath, config.outputRoot),
    filename: 'js/[name].js',
    publicPath: config.publicPath
  }
  webpackConf.plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(appPath, config.sourceRoot, 'index.html')
  }))
  const compiler = webpack(webpackConf)
  compiler.run((err, stats) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(stats)
  })
}

const serveSpinner = ora(`Starting development server, please wait🤡~`)

function createCompiler (webpackConf) {
  const compiler = webpack(webpackConf)
  compiler.plugin('invalid', filepath => {
    console.log(chalk.grey(`[${utils.formatTime()}]Modified: ${filepath}`))
    serveSpinner.text = 'Compiling...🤡~'
    serveSpinner.render()
  })
  compiler.plugin('done', stats => {
    const { errors, warnings } = formatWebpackMessage(stats.toJson({}, true))
    const isSuccess = !errors.length && !warnings.length
    if (isSuccess) {
      serveSpinner.succeed(chalk.green('Compile successfully!\n'))
    }
    if (errors.length) {
      errors.splice(1)
      serveSpinner.fail(chalk.red('Compile failed!\n'))
      console.log(errors.join('\n\n') + '\n')
    }
  })
  return compiler
}

exports.buildDev = function (config) {
  const conf = Object.assign({}, buildConf, config)
  const publicPath = conf.publicPath
  const contentBase = path.join(appPath, conf.outputRoot)
  const protocol = conf.protocol
  const host = conf.host
  const port = conf.port
  const urls = utils.prepareUrls(protocol, host, port)

  const webpackConf = webpackMerge(baseConf(conf), devConf(conf), {
    entry: conf.entry,
    output: {
      path: contentBase,
      filename: 'js/[name].js',
      publicPath: publicPath
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(appPath, conf.sourceRoot, 'index.html')
      })
    ]
  })
  const devServerOptions = devServerConf({
    publicPath,
    contentBase,
    protocol,
    host,
    publicUrl: urls.lanUrlForConfig
  })
  WebpackDevServer.addDevServerEntrypoints(webpackConf, devServerOptions)

  const compiler = createCompiler(webpackConf)
  const server = new WebpackDevServer(compiler, devServerOptions)

  server.listen(port, host, err => {
    if (err) return console.log(err)
    serveSpinner.start()
    console.log(chalk.cyan(`> Listening at ${urls.lanUrlForTerminal}`))
    console.log(chalk.cyan(`> Listening at ${urls.localUrlForBrowser}\n`))
    opn(urls.localUrlForBrowser)
  })
}
