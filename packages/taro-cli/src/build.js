const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const _ = require('lodash')

const Util = require('./util')
const CONFIG = require('./config')

const appPath = process.cwd()

function build (args, buildConfig) {
  const { FULL, DLL } = Util.BUILD_MODES
  const { type, watch, excludes, mode = FULL } = buildConfig
  const isDllMode = DLL === mode
  const configDir = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
  const outputPath = path.join(appPath, configDir.outputRoot || CONFIG.OUTPUT_DIR)
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
  } else {
    if (type !== Util.BUILD_TYPES.H5) {
      const npmDir = path.join(outputPath, 'npm')
      const includesDirs = type === Util.BUILD_TYPES.WEAPP && isDllMode ? [npmDir] : []
      const excludesDirs = excludes ? [path.join(outputPath, excludes)] : []
      Util.emptyDirectory(outputPath, {
        includes: includesDirs,
        excludes: excludesDirs
      })
    }
  }
  switch (type) {
    case Util.BUILD_TYPES.H5:
      buildForH5({ watch })
      break
    case Util.BUILD_TYPES.WEAPP:
      buildForWeapp({ watch, mode })
      break
    case Util.BUILD_TYPES.SWAN:
      buildForSwan({ watch, mode })
      break
    case Util.BUILD_TYPES.ALIPAY:
      buildForAlipay({ watch, mode })
      break
    case Util.BUILD_TYPES.TT:
      buildForTt({ watch, mode })
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

function buildForWeapp ({ watch, mode }) {
  require('./weapp').build({
    watch,
    mode,
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
