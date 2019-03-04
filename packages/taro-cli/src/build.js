const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const _ = require('lodash')

const Util = require('./util')
const CONFIG = require('./config')

const appPath = process.cwd()


function build (args, buildConfig) {
  const { type, watch } = buildConfig
  const configDir = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
  const outputPath = path.join(appPath, configDir.outputRoot || CONFIG.OUTPUT_DIR)
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
  } else {
    if (type !== Util.BUILD_TYPES.H5) {
      Util.emptyDirectory(outputPath)
    }
  }
  switch (type) {
    case Util.BUILD_TYPES.H5:
      buildForH5({ watch })
      break
    case Util.BUILD_TYPES.WEAPP:
      buildForWeapp({ watch })
      break
    case Util.BUILD_TYPES.SWAN:
      buildForSwan({ watch })
      break
    case Util.BUILD_TYPES.ALIPAY:
      buildForAlipay({ watch })
      break
    case Util.BUILD_TYPES.TT:
      buildForTt({ watch })
      break
    case Util.BUILD_TYPES.RN:
      buildForRN({ watch })
      break
    case Util.BUILD_TYPES.UI:
      buildForUILibrary({ watch })
      break
    default:
      console.log(chalk.red('输入类型错误，目前只支持 weapp/h5/rn/swan/alipay/tt 六端类型'))
  }
}

function buildForWeapp ({ watch }) {
  require('./weapp').build({
    watch,
    adapter: Util.BUILD_TYPES.WEAPP
  })
}

function buildForSwan ({ watch }) {
  require('./weapp').build({
    watch,
    adapter: Util.BUILD_TYPES.SWAN
  })
}

function buildForAlipay ({ watch }) {
  require('./weapp').build({
    watch,
    adapter: Util.BUILD_TYPES.ALIPAY
  })
}

function buildForTt ({ watch }) {
  require('./weapp').build({
    watch,
    adapter: Util.BUILD_TYPES.TT
  })
}

function buildForH5 (buildConfig) {
  require('./h5').build(buildConfig)
}

function buildForRN ({ watch }) {
  require('./rn').build({ watch })
}

function buildForUILibrary ({ watch }) {
  require('./ui').build({ watch })
}

module.exports = build
