import * as fs from 'fs-extra'
import * as path from 'path'

import { AppConfig } from '@tarojs/taro'
import * as wxTransformer from '@tarojs/transformer-wx'

import {
  REG_SCRIPTS,
  REG_TYPESCRIPT,
  CONFIG_MAP,
  processTypeEnum
} from '../util/constants'
import {
  isDifferentArray,
  printLog,
  isEmptyObject,
  resolveScriptPath
} from '../util'
import { IWxTransformResult } from '../util/types'

import { getBuildData, uglifyJS, copyFilesFromSrcToOutput, getDependencyTree } from './helper'
import { PARSE_AST_TYPE } from './constants'
import { compileDepScripts, compileScriptFile } from './compileScript'
import { compileDepStyles } from './compileStyle'
import { parseAst } from './astProcess'
import { buildSingleComponent } from './component'

async function buildCustomTabbar () {
  const {
    sourceDir
  } = getBuildData()
  const customTabbarPath = path.join(sourceDir, 'custom-tab-bar')
  const customTabbarJSPath = resolveScriptPath(customTabbarPath)
  await buildSingleComponent({
    path: customTabbarJSPath,
    name: 'custom-tab-bar'
  })
}

function buildWorkers (worker: string) {
  const {
    sourceDir
  } = getBuildData()
  printLog(processTypeEnum.COMPILE, 'Workers', '编译 worker 相关文件')
  const workerDir = path.join(sourceDir, worker)
  function fileRecursiveSearch (fileDir) {
    fs.readdir(fileDir, (err, files) => {
      if (err) {
        console.warn(err)
      } else {
        files.forEach(filename => {
          const filePath = path.join(fileDir, filename)
          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.warn(err)
            } else {
              const isFile = stats.isFile()
              const isDir = stats.isDirectory()
              if (isFile) {
                if (REG_SCRIPTS.test(filePath)) {
                  compileDepScripts([filePath])
                } else {
                  copyFilesFromSrcToOutput([filePath])
                }
              } else if (isDir) {
                fileRecursiveSearch(filePath)
              }
            }
          })
        })
      }
    })
  }
  fileRecursiveSearch(workerDir)
}

export async function buildEntry (): Promise<AppConfig> {
  const {
    buildAdapter,
    constantsReplaceList,
    entryFilePath,
    sourceDir,
    outputDir,
    entryFileName,
    sourceDirName,
    outputDirName,
    projectConfig,
    outputFilesTypes,
    isProduction
  } = getBuildData()
  const weappConf = projectConfig.weapp || { appOutput: true}
  const appOutput = typeof weappConf.appOutput === 'boolean' ? weappConf.appOutput : true
  const entryFileCode = fs.readFileSync(entryFilePath).toString()
  const outputEntryFilePath = path.join(outputDir, entryFileName)

  printLog(processTypeEnum.COMPILE, '入口文件', `${sourceDirName}/${entryFileName}`)
  try {
    const transformResult: IWxTransformResult = wxTransformer({
      code: entryFileCode,
      sourcePath: entryFilePath,
      outputPath: outputEntryFilePath,
      isApp: true,
      isTyped: REG_TYPESCRIPT.test(entryFilePath),
      adapter: buildAdapter,
      env: constantsReplaceList
    })
    // app.js的template忽略
    const res = parseAst(PARSE_AST_TYPE.ENTRY, transformResult.ast, [], entryFilePath, outputEntryFilePath)
    let resCode = res.code
    resCode = await compileScriptFile(resCode, entryFilePath, outputEntryFilePath, buildAdapter)
    if (isProduction) {
      resCode = uglifyJS(resCode, entryFilePath)
    }
    if (appOutput) {
      fs.writeFileSync(path.join(outputDir, 'app.json'), JSON.stringify(res.configObj, null, 2))
      printLog(processTypeEnum.GENERATE, '入口配置', `${outputDirName}/app.json`)
      fs.writeFileSync(path.join(outputDir, 'app.js'), resCode)
      printLog(processTypeEnum.GENERATE, '入口文件', `${outputDirName}/app.js`)
    }
    if (res.configObj.workers) {
      buildWorkers(res.configObj.workers)
    }
    if (res.configObj.tabBar && res.configObj.tabBar.custom) {
      await buildCustomTabbar()
    }
    const dependencyTree = getDependencyTree()
    const fileDep = dependencyTree.get(entryFilePath) || {
      style: [],
      script: [],
      json: [],
      media: []
    }
    // 编译依赖的脚本文件
    if (isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (isDifferentArray(fileDep['style'], res.styleFiles) && appOutput) {
      await compileDepStyles(path.join(outputDir, `app${outputFilesTypes.STYLE}`), res.styleFiles)
      printLog(processTypeEnum.GENERATE, '入口样式', `${outputDirName}/app${outputFilesTypes.STYLE}`)
    }
    // 拷贝依赖文件
    if (isDifferentArray(fileDep['json'], res.jsonFiles)) {
      copyFilesFromSrcToOutput(res.jsonFiles)
    }

    // 处理res.configObj 中的tabBar配置
    const tabBar = res.configObj.tabBar
    if (tabBar && typeof tabBar === 'object' && !isEmptyObject(tabBar)) {
      const {
        list: listConfig,
        iconPath: pathConfig,
        selectedIconPath: selectedPathConfig
      } = CONFIG_MAP[buildAdapter]
      const list = tabBar[listConfig] || []
      let tabBarIcons: string[] = []
      list.forEach(item => {
        item[pathConfig] && tabBarIcons.push(item[pathConfig])
        item[selectedPathConfig] && tabBarIcons.push(item[selectedPathConfig])
      })
      tabBarIcons = tabBarIcons.map(item => path.resolve(sourceDir, item))
      if (tabBarIcons && tabBarIcons.length) {
        res.mediaFiles = res.mediaFiles.concat(tabBarIcons)
      }
    }
    if (isDifferentArray(fileDep['media'], res.mediaFiles)) {
      copyFilesFromSrcToOutput(res.mediaFiles)
    }
    fileDep['style'] = res.styleFiles
    fileDep['script'] = res.scriptFiles
    fileDep['json'] = res.jsonFiles
    fileDep['media'] = res.mediaFiles
    dependencyTree.set(entryFilePath, fileDep)
    return res.configObj
  } catch (err) {
    console.log(err)
    return {}
  }
}
