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

const getServeSpinner = (() => {
  let spinner
  return () => {
    if (!spinner) spinner = ora(`Starting development server, please wait🤡~`)
    return spinner
  }
})()

const printBuildError = (err) => {
  const message = err != null && err.message
  const stack = err != null && err.stack
  if (
    stack &&
    typeof message === 'string' &&
    message.indexOf('from UglifyJs') !== -1
  ) {
    try {
      const matched = /(.+)\[(.+):(.+),(.+)\]\[.+\]/.exec(stack)
      if (!matched) {
        throw new Error('Using errors for control flow is bad.')
      }
      const problemPath = matched[2]
      const line = matched[3]
      const column = matched[4]
      console.log(
        'Failed to minify the code from this file: \n\n',
        chalk.yellow(
          `\t${problemPath}:${line}${column !== '0' ? ':' + column : ''}`
        ),
        '\n'
      )
    } catch (ignored) {
      console.log('Failed to minify the bundle.', err)
    }
  } else {
    console.log((message || err) + '\n')
  }
  console.log()
}

const createCompiler = (webpackConf) => {
  const compiler = webpack(webpackConf)
  compiler.plugin('invalid', filepath => {
    console.log(chalk.grey(`[${utils.formatTime()}]Modified: ${filepath}`))
    getServeSpinner().text = 'Compiling...🤡~'
    getServeSpinner().render()
  })
  compiler.plugin('done', stats => {
    const { errors, warnings } = formatWebpackMessage(stats.toJson({}, true))
    const isSuccess = !errors.length && !warnings.length
    if (isSuccess) {
      getServeSpinner().succeed(chalk.green('Compile successfully!\n'))
    }
    if (errors.length) {
      errors.splice(1)
      getServeSpinner().fail(chalk.red('Compile failed!\n'))
      console.log(errors.join('\n\n') + '\n')
    }
  })
  return compiler
}

const mergeCustomConfig = function (webpackConf, customWebpackConfig = {}) {
  if (typeof customWebpackConfig === 'function') {
    return customWebpackConfig(webpackConf, webpack)
  }
  return webpackMerge(webpackConf, customWebpackConfig)
}

exports.buildProd = function (config, customWebpackConfig) {
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
  const compiler = webpack(mergeCustomConfig(webpackConf, customWebpackConfig))
  compiler.run((err, stats) => {
    if (err) {
      return printBuildError(err)
    }

    const { errors, warnings } = formatWebpackMessage(stats.toJson({}, true))
    const isSuccess = !errors.length && !warnings.length
    if (isSuccess) {
      getServeSpinner().succeed(chalk.green('Compile successfully!\n'))
      return process.stdout.write(
        stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n'
      )
    }
    if (errors.length) {
      errors.splice(1)
      getServeSpinner().fail(chalk.red('Compile failed!\n'))
      return printBuildError(new Error(errors.join('\n\n')))
    }
    if (warnings.length) {
      getServeSpinner().warn(chalk.yellow('Compiled with warnings.\n'))
      console.log(warnings.join('\n\n'))
      console.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.'
      )
      console.log(
        'To ignore, add ' +
          chalk.cyan('// eslint-disable-next-line') +
          ' to the line before.\n'
      )
    }
  })
}

exports.buildDev = function (config, customWebpackConfig) {
  const conf = Object.assign({}, buildConf, config)
  const publicPath = conf.publicPath
  const contentBase = path.join(appPath, conf.outputRoot)
  const protocol = conf.protocol
  const host = conf.host
  const port = conf.port
  const urls = utils.prepareUrls(protocol, host, port)

  let webpackConf = webpackMerge(baseConf(conf), devConf(conf), {
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
  webpackConf = mergeCustomConfig(webpackConf, customWebpackConfig)
  WebpackDevServer.addDevServerEntrypoints(webpackConf, devServerOptions)
  const compiler = createCompiler(webpackConf)
  const server = new WebpackDevServer(compiler, devServerOptions)

  server.listen(port, host, err => {
    if (err) return console.log(err)
    getServeSpinner().start()
    console.log(chalk.cyan(`> Listening at ${urls.lanUrlForTerminal}`))
    console.log(chalk.cyan(`> Listening at ${urls.localUrlForBrowser}\n`))
    opn(urls.localUrlForBrowser)
  })
}
