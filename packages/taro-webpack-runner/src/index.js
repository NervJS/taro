const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConf = require('./config/base.conf')
const devConf = require('./config/dev.conf')
const prodConf = require('./config/prod.conf')
const buildConf = require('./config/build.conf')

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

exports.buildDev = function (config) {

}
