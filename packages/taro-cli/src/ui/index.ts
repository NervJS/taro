import * as fs from 'fs-extra'
import * as path from 'path'
import * as chokidar from 'chokidar'
import chalk from 'chalk'
import * as _ from 'lodash'

import { Compiler } from '../h5'
import { buildH5Script, buildForH5 } from './h5'
import { buildForRN } from './rn'
import { buildForMini } from './mini'
import { buildForQuickapp } from './quickapp'
import CONFIG from '../config'
import { resolveScriptPath, printLog } from '../util'
import {
  processTypeEnum,
  PROJECT_CONFIG,
  BUILD_TYPES,
  REG_STYLE,
  JS_EXT,
  TS_EXT
} from '../util/constants'
import { IBuildConfig } from '../util/types'
import { setBuildData as setMiniBuildData } from '../mini/helper'
import { IBuildData } from './ui.types'
import {
  H5_OUTPUT_NAME,
  RN_OUTPUT_NAME,
  TEMP_DIR,
  RN_TEMP_DIR,
  MINI_OUTPUT_NAME_LIST,
  QUICKAPP_OUTPUT_NAME,
  copyFileToDist,
  analyzeStyleFilesImport,
  analyzeFiles,
  MINI_UI_LIST,
  getDistPath
} from './common'
import { Compiler as RNCompiler } from '../rn'

const SCRIPT_EXT = JS_EXT.concat(TS_EXT)
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
      MINI_UI_LIST.includes(item)
    ) {
      dir = MINI_OUTPUT_NAME_LIST[item]
    }
    content += `if (process.env.TARO_ENV === '${item}') {
      module.exports = require('./${dir}/${indexName}')
      module.exports.default = module.exports
    }`
    if (index < platforms.length - 1) {
      content += ' else '
    } else {
      content += ` else {
        module.exports = require('./${MINI_OUTPUT_NAME_LIST.weapp}/${indexName}')
        module.exports.default = module.exports
      }`
    }
  })

  const outputDir = path.join(appPath, outputDirName)
  fs.writeFileSync(path.join(outputDir, `index.js`), content)
}

function watchFiles (uiIndex) {
  const {sourceDir, projectConfig, appPath, outputDirName, tempPath} = buildData
  let platforms = _.get(buildData, 'projectConfig.ui.platforms')

  if (!platforms || !Array.isArray(platforms)) {
    platforms = [ BUILD_TYPES.WEAPP, BUILD_TYPES.H5 ]
  }

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

  /**
   * 判断传入的绝对路径是否是跨平台兼容文件
   */
  function isMultiPlatformFile (filePath: string, platform?: BUILD_TYPES) {
    if (!SCRIPT_EXT.includes(path.extname(filePath))) {
      return false;
    }

    let fileNameWithoutExt = path.basename(filePath).replace(/\.\w+$/, '');

    if (platform) {
      let reg = new RegExp(`\\.${platform}\$`, 'g');

      return reg.test(fileNameWithoutExt);
    }

    return platforms.some((type) => {
      let reg = new RegExp(`\\.${type}\$`, 'g');

      return reg.test(fileNameWithoutExt);
    })
  }

  /**
   * 事实上，如果加入了跨平台文件兼容后，那么js/ts类型的文件是不应当直接复制到dist目录中去的，
   * 针对文件修改的情况，判断如果是script文件且原来编译之后没有输出对应文件，则修改时也不同步
   */
  function shouldFileBeSync (filePath: string, outputDir: string): boolean {
    const distFilePath: string = getDistPath(filePath, sourceDir, outputDir).distFilePath

    if (fs.existsSync(distFilePath) || !SCRIPT_EXT.includes(path.extname(distFilePath))) {
      return true
    }

    return false
  }

  function syncMiniFile (filePath: string, type: BUILD_TYPES, changeType: processTypeEnum) {
    const outputDir = path.join(appPath, outputDirName, MINI_OUTPUT_NAME_LIST[type])
    
    if (changeType == processTypeEnum.MODIFY && !shouldFileBeSync(filePath, outputDir)) {
      return;
    }

    copyFileToDist(filePath, sourceDir, outputDir, buildData)
    // 依赖分析
    const extname = path.extname(filePath)
    if (REG_STYLE.test(extname)) {
      analyzeStyleFilesImport([filePath], sourceDir, outputDir, buildData)
    } else {
      analyzeFiles([filePath], sourceDir, outputDir, buildData)
    }
  }

  function syncQuickappFile (filePath, changeType: processTypeEnum) {
    const outputDir = path.join(appPath, outputDirName, QUICKAPP_OUTPUT_NAME)

    if (changeType == processTypeEnum.MODIFY && !shouldFileBeSync(filePath, outputDir)) {
      return;
    }

    copyFileToDist(filePath, sourceDir, outputDir, buildData)
    // 依赖分析
    const extname = path.extname(filePath)
    if (REG_STYLE.test(extname)) {
      analyzeStyleFilesImport([filePath], sourceDir, outputDir, buildData)
    } else {
      analyzeFiles([filePath], sourceDir, outputDir, buildData)
    }
  }

  function syncH5File (filePath, compiler, changeType: processTypeEnum) {
    const {sourceDir, appPath, outputDirName, tempPath} = buildData
    const outputDir = path.join(appPath, outputDirName, H5_OUTPUT_NAME)
    let fileTempPath = filePath.replace(sourceDir, tempPath)

    if (changeType == processTypeEnum.MODIFY) { // 事实上，如果是新增的文件，这里最后会返回不带后缀名的路径，导致复制阶段报错
      fileTempPath = fileTempPath.replace(new RegExp(`${path.extname(fileTempPath)}$`), '')
      fileTempPath = resolveScriptPath(fileTempPath)

      if (!shouldFileBeSync(filePath, outputDir)) {
        return;
      }
    }

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

  function syncRNFile (filePath, compiler, changeType: processTypeEnum) {
    const {sourceDir, appPath, outputDirName, rnTempPath} = buildData
    const outputDir = path.join(appPath, outputDirName, RN_OUTPUT_NAME)
    const fileTempPath = filePath.replace(sourceDir, rnTempPath)

    if (changeType == processTypeEnum.MODIFY && !shouldFileBeSync(filePath, outputDir)) {
      return;
    }

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

  /**
   * 根据变动的文件名，判断是否有需要重新编译的平台
   */
  function getRebuildList (filePath: string, platforms): BUILD_TYPES[] {
    let rebuildPlatformList: BUILD_TYPES[] = [];

    platforms.forEach((type) => {
      let defaultFile = filePath.replace(new RegExp(`\\.${type}\\.`, 'g'), '.');

      // 新增当前平台文件且当前目录下已存在默认的平台兼容文件，则认为此改动会影响跨平台兼容的引用，需要重新编译
      if (isMultiPlatformFile(filePath, type) && fs.existsSync(defaultFile)) {
        rebuildPlatformList.push(type);
      }
    })

    return rebuildPlatformList;
  }

  async function handleChange (filePath, type: processTypeEnum, tips) {
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

    if (type == processTypeEnum.CREATE) {
      let rebuildPlatformList = getRebuildList(filePath, platforms);
  
      // 仅变动的平台执行重新编译，其他平台不动
      if (rebuildPlatformList.length) {
        await buildForEachPlatform(rebuildPlatformList, uiIndex)
  
        return;
      }
    }

    MINI_UI_LIST.forEach((buildType) => {
      platforms.includes(buildType) && syncMiniFile(filePath, buildType, type)
    })
    platforms.includes(BUILD_TYPES.QUICKAPP) && syncQuickappFile(filePath, type)
    platforms.includes(BUILD_TYPES.H5) && syncH5File(filePath, compiler, type)
    platforms.includes(BUILD_TYPES.RN) && syncRNFile(filePath, rnCompiler, type)
  }

  watcher
    .on('add', filePath => handleChange(filePath, processTypeEnum.CREATE, '添加文件'))
    .on('change', filePath => handleChange(filePath, processTypeEnum.MODIFY, '文件变动'))
    .on('unlink', async filePath => {
      for (const path in extraWatchFiles) {
        if (filePath.indexOf(path.substr(2)) > -1) return
      }

      const relativePath = path.relative(appPath, filePath)
      printLog(processTypeEnum.UNLINK, '删除文件', relativePath)

      let rebuildPlatformList = getRebuildList(filePath, platforms);

      // 执行重新编译
      if (rebuildPlatformList.length) {
        await buildForEachPlatform(rebuildPlatformList, uiIndex)
      }
      
      const quickappOutputPath = path.join(appPath, outputDirName, QUICKAPP_OUTPUT_NAME)
      const h5OutputPath = path.join(appPath, outputDirName, H5_OUTPUT_NAME)
      const fileTempPath = filePath.replace(sourceDir, tempPath)
      const fileQuickappPath = filePath.replace(sourceDir, quickappOutputPath)
      const fileH5Path = filePath.replace(sourceDir, h5OutputPath)

      MINI_UI_LIST.forEach((buildType) => {
        const miniOutputPath = path.join(appPath, outputDirName, buildType)
        const fileMiniPath = filePath.replace(sourceDir, miniOutputPath)

        fs.existsSync(fileMiniPath) && fs.unlinkSync(fileMiniPath)
      })

      fs.existsSync(fileTempPath) && fs.unlinkSync(fileTempPath)
      fs.existsSync(fileQuickappPath) && fs.unlinkSync(fileQuickappPath)
      fs.existsSync(fileH5Path) && fs.unlinkSync(fileH5Path)
    })
}

async function buildForEachPlatform (platforms, uiIndex) {
  if (platforms && Array.isArray(platforms)) {
    for (let type of MINI_UI_LIST) {
      platforms.includes(type) && await buildForMini(type, buildData)
    }
    platforms.includes(BUILD_TYPES.QUICKAPP) && await buildForQuickapp(buildData)
    platforms.includes(BUILD_TYPES.H5) && await buildForH5(uiIndex, buildData)
    platforms.includes(BUILD_TYPES.RN) && await buildForRN(uiIndex, buildData)
  } else {
    await buildForMini(BUILD_TYPES.WEAPP, buildData)
    await buildForH5(uiIndex, buildData)
  }
}

export async function build (appPath, {watch, uiIndex}: IBuildConfig) {
  setBuildData(appPath, uiIndex)
  setMiniBuildData(appPath, BUILD_TYPES.WEAPP)
  setMiniBuildData(appPath, BUILD_TYPES.QUICKAPP)
  platforms = _.get(buildData, 'projectConfig.ui.platforms') || [BUILD_TYPES.WEAPP, BUILD_TYPES.H5]
  buildEntry(uiIndex)
  await buildForEachPlatform(platforms, uiIndex)

  if (watch) {
    watchFiles(uiIndex)
  }
}
