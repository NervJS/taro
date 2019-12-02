import * as path from 'path'
import * as fs from 'fs-extra'
import chalk from 'chalk'
import * as _ from 'lodash'

import * as Util from './util'
import CONFIG from './config'
import { BUILD_TYPES, PROJECT_CONFIG } from './util/constants'
import { IBuildConfig } from './util/types'

export default async function build (appPath, buildConfig: IBuildConfig) {
  const { type, watch, platform, port, release, page, component, uiIndex } = buildConfig
  const configDir = require(path.join(appPath, PROJECT_CONFIG))(_.merge)
  const outputPath = path.join(appPath, configDir.outputRoot || CONFIG.OUTPUT_DIR)
  if (!fs.existsSync(outputPath)) {
    fs.ensureDirSync(outputPath)
  } else if (type !== BUILD_TYPES.H5 && (type !== BUILD_TYPES.QUICKAPP || !watch)) {
    Util.emptyDirectory(outputPath)
  }
  switch (type) {
    case BUILD_TYPES.H5:
      buildForH5(appPath, { watch, port })
      break
    case BUILD_TYPES.WEAPP:
      buildForWeapp(appPath, { watch, page, component })
      break
    case BUILD_TYPES.SWAN:
      buildForSwan(appPath, { watch, page, component })
      break
    case BUILD_TYPES.ALIPAY:
      buildForAlipay(appPath, { watch, page, component })
      break
    case BUILD_TYPES.TT:
      buildForTt(appPath, { watch, page, component })
      break
    case BUILD_TYPES.RN:
      buildForRN(appPath, { watch })
      break
    case BUILD_TYPES.QUICKAPP:
      buildForQuickApp(appPath, { watch, port, release })
      break
    case BUILD_TYPES.QQ:
      buildForQQ(appPath, { watch, page, component })
      break
    case BUILD_TYPES.JD:
      buildForJD(appPath, { watch })
      break
    case BUILD_TYPES.UI:
      buildForUILibrary(appPath, { watch, uiIndex })
      break
    case BUILD_TYPES.PLUGIN:
      buildForPlugin(appPath, {
        watch,
        platform
      })
      break
    default:
      console.log(chalk.red('输入类型错误，目前只支持 weapp/swan/alipay/tt/h5/quickapp/rn 七端类型'))
  }
}

function buildForWeapp (appPath: string, buildConfig: IBuildConfig) {
  require('./mini').build(appPath, Object.assign({
    adapter: BUILD_TYPES.WEAPP
  }, buildConfig))
}

function buildForSwan (appPath: string, buildConfig: IBuildConfig) {
  require('./mini').build(appPath, Object.assign({
    adapter: BUILD_TYPES.SWAN
  }, buildConfig))
}

function buildForAlipay (appPath: string, buildConfig: IBuildConfig) {
  require('./mini').build(appPath, Object.assign({
    adapter: BUILD_TYPES.ALIPAY
  }, buildConfig))
}

function buildForTt (appPath: string, buildConfig: IBuildConfig) {
  require('./mini').build(appPath, Object.assign({
    adapter: BUILD_TYPES.TT
  }, buildConfig))
}

function buildForH5 (appPath: string, buildConfig: IBuildConfig) {
  require('./h5').build(appPath, buildConfig)
}

function buildForRN (appPath: string, { watch }: IBuildConfig) {
  require('./rn').build(appPath, { watch })
}

function buildForQuickApp (appPath: string, { watch, port, release }: IBuildConfig) {
  require('./mini').build(appPath, {
    watch,
    adapter: BUILD_TYPES.QUICKAPP,
    port,
    release
  })
}

function buildForQQ (appPath: string, buildConfig: IBuildConfig) {
  require('./mini').build(appPath, Object.assign({
    adapter: BUILD_TYPES.QQ
  }, buildConfig))
}

function buildForJD (appPath: string, { watch }: IBuildConfig) {
  require('./mini').build(appPath, {
    watch,
    adapter: BUILD_TYPES.JD
  })
}

function buildForUILibrary (appPath: string, { watch, uiIndex }: IBuildConfig) {
  require('./ui/index').build(appPath, { watch, uiIndex })
}

function buildForPlugin (appPath: string, { watch, platform }) {
  const typeMap = {
    [BUILD_TYPES.WEAPP]: '微信',
    [BUILD_TYPES.ALIPAY]: '支付宝'
  }
  if (platform !== BUILD_TYPES.WEAPP && platform !== BUILD_TYPES.ALIPAY) {
    console.log(chalk.red('目前插件编译仅支持 微信/支付宝 小程序！'))
    return
  }
  console.log(chalk.green(`开始编译${typeMap[platform]}小程序插件`))
  require('./plugin').build(appPath, { watch, platform })
}
