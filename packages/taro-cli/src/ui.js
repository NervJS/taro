const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const klaw = require('klaw')
const _ = require('lodash')

const CONFIG = require('./config')
const {
  resolveScriptPath,
  PROJECT_CONFIG,
  BUILD_TYPES,
  printLog,
  pocessTypeEnum
} = require('./util')
const npmProcess = require('./util/npm')

const appPath = process.cwd()
const configDir = path.join(appPath, PROJECT_CONFIG)
const projectConfig = require(configDir)(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
let outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
const sourceDir = path.join(appPath, sourceDirName)
const entryFilePath = resolveScriptPath(path.join(sourceDir, 'index'))
const entryFileName = path.basename(entryFilePath)
const tempDir = '.temp'
const tempPath = path.join(appPath, tempDir)

const weappOutputName = 'weapp'
const h5OutputName = 'h5'

async function buildH5Lib () {
  const h5Config = projectConfig.h5 || {}
  const entryFile = path.basename(entryFileName, path.extname(entryFileName)) + '.js'
  outputDirName = `${outputDirName}/${h5OutputName}`
  h5Config.env = projectConfig.env
  h5Config.defineConstants = projectConfig.defineConstants
  h5Config.plugins = projectConfig.plugins
  h5Config.designWidth = projectConfig.designWidth
  if (projectConfig.deviceRatio) {
    h5Config.deviceRatio = projectConfig.deviceRatio
  }
  h5Config.sourceRoot = sourceDirName
  h5Config.outputRoot = outputDirName
  h5Config.entry = {
    app: path.join(tempPath, entryFile)
  }
  h5Config.isWatch = false
  const webpackRunner = await npmProcess.getNpmPkg('@tarojs/webpack-runner')
  webpackRunner(h5Config)
}

async function buildForWeapp () {
  console.log()
  console.log(chalk.green('开始编译微信小程序端组件库！'))
  if (!fs.existsSync(entryFilePath)) {
    console.log(chalk.red('入口文件不存在，请检查！'))
    return
  }
  try {
    const outputDir = path.join(appPath, outputDirName, weappOutputName)
    klaw(sourceDir)
      .on('data', file => {
        const relativePath = path.relative(appPath, file.path)
        if (!file.stats.isDirectory()) {
          printLog(pocessTypeEnum.CREATE, '发现文件', relativePath)
          const dirname = path.dirname(file.path)
          const distDirname = dirname.replace(sourceDir, outputDir)
          fs.ensureDirSync(distDirname)
          fs.copyFileSync(file.path, path.format({
            dir: distDirname,
            base: path.basename(file.path)
          }))
        }
      })
  } catch (err) {
    console.log(err)
  }
}

async function buildForH5 (buildConfig) {
  const { buildTemp } = require('./h5')
  console.log()
  console.log(chalk.green('开始编译 H5 端组件库！'))
  await buildTemp(buildConfig)
  await buildH5Lib()
}

function buildEntry () {
  const content = `if (process.env.TARO_ENV === '${BUILD_TYPES.H5}') {
    module.exports = require('./${h5OutputName}/index.js')
    module.exports.default = module.exports
  } else if (process.env.TARO_ENV === '${BUILD_TYPES.WEAPP}') {
    module.exports = require('./${weappOutputName}/index.js')
    module.exports.default = module.exports
  }`
  const outputDir = path.join(appPath, outputDirName)
  fs.writeFileSync(path.join(outputDir, 'index.js'), content)
}

async function build () {
  buildEntry()
  await buildForWeapp()
  await buildForH5()
}

module.exports = {
  build
}
