import * as path from 'path'
import * as fs from 'fs-extra'
import chalk from 'chalk'
import * as _ from 'lodash'

import * as Util from './util'
import CONFIG from './config'
import { BUILD_TYPES, PROJECT_CONFIG } from './util/constants'
import { IBuildConfig } from './util/types'

const appPath = process.cwd()

export default function build (args, buildConfig: IBuildConfig) {
  const { type, watch } = buildConfig
  const configDir = require(path.join(appPath, PROJECT_CONFIG))(_.merge)
  const outputPath = path.join(appPath, configDir.outputRoot || CONFIG.OUTPUT_DIR)
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
  } else if (type !== BUILD_TYPES.H5 && (type !== BUILD_TYPES.QUICKAPP || !watch)) {
    Util.emptyDirectory(outputPath)
  }
  switch (type) {
    case BUILD_TYPES.H5:
      buildForH5({ watch })
      break
    case BUILD_TYPES.WEAPP:
      buildForWeapp({ watch })
      break
    case BUILD_TYPES.SWAN:
      buildForSwan({ watch })
      break
    case BUILD_TYPES.ALIPAY:
      buildForAlipay({ watch })
      break
    case BUILD_TYPES.TT:
      buildForTt({ watch })
      break
    case BUILD_TYPES.RN:
      buildForRN({ watch })
      break
    case BUILD_TYPES.QUICKAPP:
      buildForQuickApp({ watch })
      break
    case BUILD_TYPES.UI:
      buildForUILibrary({ watch })
      break
    default:
      console.log(chalk.red('输入类型错误，目前只支持 weapp/swan/alipay/tt/h5/quickapp/rn 七端类型'))
  }
}

function buildForWeapp ({ watch }: IBuildConfig) {
  require('./mini').build({
    watch,
    adapter: BUILD_TYPES.WEAPP
  })
}

function buildForSwan ({ watch }: IBuildConfig) {
  require('./mini').build({
    watch,
    adapter: BUILD_TYPES.SWAN
  })
}

function buildForAlipay ({ watch }: IBuildConfig) {
  require('./mini').build({
    watch,
    adapter: BUILD_TYPES.ALIPAY
  })
}

function buildForTt ({ watch }: IBuildConfig) {
  require('./mini').build({
    watch,
    adapter: BUILD_TYPES.TT
  })
}

function buildForH5 (buildConfig: IBuildConfig) {
  require('./h5').build(buildConfig)
}

function buildForRN ({ watch }: IBuildConfig) {
  require('./rn').build({ watch })
}

function buildForQuickApp ({ watch }: IBuildConfig) {
  require('./mini').build({
    watch,
    adapter: BUILD_TYPES.QUICKAPP
  })
}

function buildForUILibrary ({ watch }: IBuildConfig) {
  require('./ui').build({ watch })
}
