const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

const Util = require('./util')
const CONFIG = require('./config')

const appPath = process.cwd()

function build (args, { type, watch }) {
  const outputPath = path.join(appPath, CONFIG.OUTPUT_DIR)
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
  } else {
    fs.emptyDirSync(outputPath)
  }
  switch (type) {
    case Util.BUILD_TYPES.H5:
      buildForH5({ watch })
      break
    case Util.BUILD_TYPES.WEAPP:
      buildForWeapp({ watch })
      break
    case Util.BUILD_TYPES.RN:
      buildForRN({ watch })
      break
    default:
      console.log(chalk.red('输入类型错误，目前只支持weapp/h5/rn三端类型'))
  }
}

function buildForWeapp ({ watch }) {
  require('./weapp').build({ watch })
}

function buildForH5 ({ watch }) {
  require('./h5').build({ watch })
}

function buildForRN () {

}

module.exports = build
