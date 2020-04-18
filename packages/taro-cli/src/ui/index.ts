import * as fs from 'fs-extra'
import * as path from 'path'
import * as chokidar from 'chokidar'
import chalk from 'chalk'
import * as _ from 'lodash'

import { Compiler } from '../h5'
import { buildH5Script, buildForH5 } from './h5'
import { buildForRN } from './rn'
import { buildForWeapp } from './weapp'
import { buildForQuickapp } from './quickapp'
import CONFIG from '../config'
import { resolveScriptPath, printLog } from '../util'
import {
  processTypeEnum,
  PROJECT_CONFIG,
  BUILD_TYPES,
  REG_STYLE
} from '../util/constants'
import { IBuildOptions } from '../util/types'
import { setBuildData as setMiniBuildData } from '../mini/helper'
import { IBuildData } from './ui.types'
import {
  H5_OUTPUT_NAME,
  RN_OUTPUT_NAME,
  TEMP_DIR,
  RN_TEMP_DIR,
  WEAPP_OUTPUT_NAME,
  QUICKAPP_OUTPUT_NAME,
  copyFileToDist,
  analyzeStyleFilesImport,
  analyzeFiles
} from './common'
import { Compiler as RNCompiler } from '../rn_bak'

let buildData: IBuildData
let platforms: BUILD_TYPES[]

function setBuildData (appPath, uiIndex) {
  const configDir = path.join(appPath, PROJECT_CONFIG)
  const projectConfig = require(configDir)(_.merge)
  const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
  const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
  const sourceDir = path.join(appPath, sourceDirName)
  let entryFilePath
  if (uiIndex) {
    entryFilePath = resolveScriptPath(path.join(sourceDir, uiIndex))
  } else {
    entryFilePath = resolveScriptPath(path.join(sourceDir, 'index'))
  }
  const entryFileName = path.basename(entryFilePath)
  const tempPath = path.join(appPath, TEMP_DIR)
  const rnTempPath = path.join(appPath, RN_TEMP_DIR)

  buildData = {
    appPath,
    projectConfig,
    sourceDirName,
    outputDirName,
    sourceDir,
    entryFilePath,
    entryFileName,
    tempPath,
    rnTempPath
  }
}

function buildEntry (uiIndex) {
  const {appPath, outputDirName} = buildData
  let indexName = 'index'
  if (uiIndex) {
    indexName = path.basename(uiIndex, path.extname(uiIndex))
  }

  let content =''
  platforms.forEach((item, index) => {
    let dir: any = item
    if (
      [
        BUILD_TYPES.WEAPP,
        BUILD_TYPES.ALIPAY,
        BUILD_TYPES.QQ,
        BUILD_TYPES.TT,
        BUILD_TYPES.SWAN,
        BUILD_TYPES.JD
      ].includes(item)
    ) {
      dir = WEAPP_OUTPUT_NAME
    }
    content += `if (process.env.TARO_ENV === '${item}') {
      module.exports = require('./${dir}/${indexName}')
      module.exports.default = module.exports
    }`
    if (index < platforms.length - 1) {
      content += ' else '
    } else {
      content += ` else {
        module.exports = require('./${WEAPP_OUTPUT_NAME}/${indexName}')
        module.exports.default = module.exports
      }`
    }
  })

  const outputDir = path.join(appPath, outputDirName)
  fs.writeFileSync(path.join(outputDir, `index.js`), content)
}

function watchFiles () {
  const {sourceDir, projectConfig, appPath, outputDirName, tempPath} = buildData
  const platforms = _.get(buildData, 'projectConfig.ui.platforms')
  console.log('\n', chalk.gray('监听文件修改中...'), '\n')

  const watchList = [sourceDir]

  const uiConfig = projectConfig.ui
  let extraWatchFiles
  if (uiConfig && Array.isArray(uiConfig.extraWatchFiles)) {
    extraWatchFiles = uiConfig.extraWatchFiles
    extraWatchFiles.forEach(item => {
      watchList.push(path.join(appPath, item.path))
      if (typeof item.handler === 'function') item.callback = item.handler({buildH5Script})
    })
  }

  const watcher = chokidar.watch(watchList, {
    ignored: /(^|[/\\])\../,
    ignoreInitial: true
  })

  function syncWeappFile (filePath) {
    const outputDir = path.join(appPath, outputDirName, WEAPP_OUTPUT_NAME)
    copyFileToDist(filePath, sourceDir, outputDir, buildData)
    // 依赖分析
    const extname = path.extname(filePath)
    if (REG_STYLE.test(extname)) {
      analyzeStyleFilesImport([filePath], sourceDir, outputDir, buildData)
    } else {
      analyzeFiles([filePath], sourceDir, outputDir, buildData)
    }
  }

  function syncQuickappFile (filePath) {
    const outputDir = path.join(appPath, outputDirName, QUICKAPP_OUTPUT_NAME)
    copyFileToDist(filePath, sourceDir, outputDir, buildData)
    // 依赖分析
    const extname = path.extname(filePath)
    if (REG_STYLE.test(extname)) {
      analyzeStyleFilesImport([filePath], sourceDir, outputDir, buildData)
    } else {
      analyzeFiles([filePath], sourceDir, outputDir, buildData)
    }
  }

  function syncH5File (filePath, compiler) {
    const {sourceDir, appPath, outputDirName, tempPath} = buildData
    const outputDir = path.join(appPath, outputDirName, H5_OUTPUT_NAME)
    let fileTempPath = filePath.replace(sourceDir, tempPath)
    fileTempPath = fileTempPath.replace(new RegExp(`${path.extname(fileTempPath)}$`), '')
    fileTempPath = resolveScriptPath(fileTempPath)
    compiler.processFiles(filePath)

    if (process.env.TARO_BUILD_TYPE === 'script') {
      buildH5Script(buildData)
    } else {
      copyFileToDist(fileTempPath, tempPath, outputDir, buildData)
      // 依赖分析
      const extname = path.extname(filePath)
      if (REG_STYLE.test(extname)) {
        analyzeStyleFilesImport([fileTempPath], tempPath, outputDir, buildData)
      } else {
        analyzeFiles([fileTempPath], tempPath, outputDir, buildData)
      }
    }
  }

  function syncRNFile (filePath, compiler) {
    const {sourceDir, appPath, outputDirName, rnTempPath} = buildData
    const outputDir = path.join(appPath, outputDirName, RN_OUTPUT_NAME)
    const fileTempPath = filePath.replace(sourceDir, rnTempPath)
    compiler.processFiles(filePath)

    copyFileToDist(fileTempPath, tempPath, outputDir, buildData)
    // 依赖分析
    const extname = path.extname(filePath)
    if (REG_STYLE.test(extname)) {
      analyzeStyleFilesImport([fileTempPath], tempPath, outputDir, buildData)
    } else {
      analyzeFiles([fileTempPath], tempPath, outputDir, buildData)
    }
  }

  function handleChange (filePath, type, tips) {
    const relativePath = path.relative(appPath, filePath)
    const compiler = new Compiler(appPath)
    const rnCompiler = new RNCompiler(appPath)
    printLog(type, tips, relativePath)

    let processed = false
    extraWatchFiles && extraWatchFiles.forEach(item => {
      if (filePath.indexOf(item.path.substr(2)) < 0) return
      if (typeof item.callback === 'function') {
        item.callback()
        processed = true
      }
    })
    if (processed) return

    try {
      if (platforms && Array.isArray(platforms)) {
        platforms.includes(BUILD_TYPES.WEAPP) && syncWeappFile(filePath)
        platforms.includes(BUILD_TYPES.QUICKAPP) && syncQuickappFile(filePath)
        platforms.includes(BUILD_TYPES.H5) && syncH5File(filePath, compiler)
        platforms.includes(BUILD_TYPES.RN) && syncRNFile(filePath, rnCompiler)
      } else {
        syncWeappFile(filePath)
        syncH5File(filePath, compiler)
      }
    } catch (err) {
      console.log(err)
    }
  }

  watcher
    .on('add', filePath => handleChange(filePath, processTypeEnum.CREATE, '添加文件'))
    .on('change', filePath => handleChange(filePath, processTypeEnum.MODIFY, '文件变动'))
    .on('unlink', filePath => {
      for (const path in extraWatchFiles) {
        if (filePath.indexOf(path.substr(2)) > -1) return
      }

      const relativePath = path.relative(appPath, filePath)
      printLog(processTypeEnum.UNLINK, '删除文件', relativePath)
      const weappOutputPath = path.join(appPath, outputDirName, WEAPP_OUTPUT_NAME)
      const quickappOutputPath = path.join(appPath, outputDirName, QUICKAPP_OUTPUT_NAME)
      const h5OutputPath = path.join(appPath, outputDirName, H5_OUTPUT_NAME)
      const fileTempPath = filePath.replace(sourceDir, tempPath)
      const fileWeappPath = filePath.replace(sourceDir, weappOutputPath)
      const fileQuickappPath = filePath.replace(sourceDir, quickappOutputPath)
      const fileH5Path = filePath.replace(sourceDir, h5OutputPath)
      fs.existsSync(fileTempPath) && fs.unlinkSync(fileTempPath)
      fs.existsSync(fileWeappPath) && fs.unlinkSync(fileWeappPath)
      fs.existsSync(fileQuickappPath) && fs.unlinkSync(fileQuickappPath)
      fs.existsSync(fileH5Path) && fs.unlinkSync(fileH5Path)
    })
}

export async function build (appPath, {watch, uiIndex}: IBuildOptions) {
  setBuildData(appPath, uiIndex)
  setMiniBuildData(appPath, BUILD_TYPES.WEAPP)
  setMiniBuildData(appPath, BUILD_TYPES.QUICKAPP)
  platforms = _.get(buildData, 'projectConfig.ui.platforms') || [BUILD_TYPES.WEAPP, BUILD_TYPES.H5]
  buildEntry(uiIndex)
  if (platforms && Array.isArray(platforms)) {
    platforms.includes(BUILD_TYPES.WEAPP) && await buildForWeapp(buildData)
    platforms.includes(BUILD_TYPES.QUICKAPP) && await buildForQuickapp(buildData)
    platforms.includes(BUILD_TYPES.H5) && await buildForH5(uiIndex, buildData)
    platforms.includes(BUILD_TYPES.RN) && await buildForRN(uiIndex, buildData)
  } else {
    await buildForWeapp(buildData)
    await buildForH5(uiIndex, buildData)
  }
  if (watch) {
    watchFiles()
  }
}
