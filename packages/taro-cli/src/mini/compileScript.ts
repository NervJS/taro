import * as fs from 'fs-extra'
import * as path from 'path'

import * as wxTransformer from '@tarojs/transformer-wx'

import {
  printLog,
  isDifferentArray
} from '../util'
import {
  BUILD_TYPES,
  processTypeEnum,
  REG_TYPESCRIPT
} from '../util/constants'
import { callPlugin } from '../util/npm'
import { IWxTransformResult } from '../util/types'

import {
  babelConfig,
  shouldTransformAgain,
  getBuildData,
  copyFilesFromSrcToOutput,
  getDependencyTree,
  uglifyJS
} from './helper'
import { parseAst } from './astProcess'
import { PARSE_AST_TYPE, NODE_MODULES_REG } from './constants'
import { copyFileSync } from './copy'
import { IDependency } from './interface'

const isBuildingScripts: Map<string, boolean> = new Map<string, boolean>()

export function initCompileScripts () {
  isBuildingScripts.clear()
}

export function compileDepScripts (scriptFiles: string[]) {
  const {
    nodeModulesPath,
    npmOutputDir,
    projectConfig,
    sourceDir,
    outputDir,
    appPath,
    buildAdapter,
    constantsReplaceList,
    isProduction
  } = getBuildData()
  const dependencyTree = getDependencyTree()
  scriptFiles.forEach(async item => {
    if (path.isAbsolute(item)) {
      let outputItem
      if (NODE_MODULES_REG.test(item)) {
        outputItem = item.replace(nodeModulesPath, npmOutputDir).replace(path.extname(item), '.js')
      } else {
        outputItem = item.replace(path.join(sourceDir), path.join(outputDir)).replace(path.extname(item), '.js')
      }
      const weappConf = Object.assign({}, projectConfig.weapp)
      const useCompileConf = Object.assign({}, weappConf.compile)
      const compileExclude = useCompileConf.exclude || []
      let isInCompileExclude = false
      compileExclude.forEach(excludeItem => {
        if (item.indexOf(path.join(appPath, excludeItem)) >= 0) {
          isInCompileExclude = true
        }
      })
      if (isInCompileExclude) {
        copyFileSync(item, outputItem)
        return
      }
      if (!isBuildingScripts.get(outputItem)) {
        isBuildingScripts.set(outputItem, true)
        try {
          const code = fs.readFileSync(item).toString()
          const transformResult = wxTransformer({
            code,
            sourcePath: item,
            outputPath: outputItem,
            isNormal: true,
            isTyped: REG_TYPESCRIPT.test(item),
            adapter: buildAdapter,
            env: constantsReplaceList
          })
          const ast = transformResult.ast
          const res = parseAst(PARSE_AST_TYPE.NORMAL, ast, [], item, outputItem)
          const fileDep = dependencyTree.get(item) || {} as IDependency
          let resCode = res.code
          resCode = await compileScriptFile(res.code, item, outputItem, buildAdapter)
          fs.ensureDirSync(path.dirname(outputItem))
          if (isProduction) {
            uglifyJS(resCode, item)
          }
          fs.writeFileSync(outputItem, resCode)
          let modifyOutput = outputItem.replace(appPath + path.sep, '')
          modifyOutput = modifyOutput.split(path.sep).join('/')
          printLog(processTypeEnum.GENERATE, '依赖文件', modifyOutput)
          // 编译依赖的脚本文件
          if (isDifferentArray(fileDep['script'], res.scriptFiles)) {
            compileDepScripts(res.scriptFiles)
          }
          // 拷贝依赖文件
          if (isDifferentArray(fileDep['json'], res.jsonFiles)) {
            copyFilesFromSrcToOutput(res.jsonFiles)
          }
          if (isDifferentArray(fileDep['media'], res.mediaFiles)) {
            copyFilesFromSrcToOutput(res.mediaFiles)
          }
          fileDep['script'] = res.scriptFiles
          fileDep['json'] = res.jsonFiles
          fileDep['media'] = res.mediaFiles
          dependencyTree.set(item, fileDep)
        } catch (err) {
          printLog(processTypeEnum.ERROR, '编译失败', item.replace(appPath + path.sep, ''))
          console.log(err)
        }
      }
    }
  })
}

export async function compileScriptFile (
  content: string,
  sourceFilePath: string,
  outputFilePath: string,
  adapter: BUILD_TYPES
): Promise<string> {
  const {
    constantsReplaceList
  } = getBuildData()
  const compileScriptRes = await callPlugin('babel', content, sourceFilePath, babelConfig)
  const code = compileScriptRes.code
  if (!shouldTransformAgain) {
    return code
  }
  const transformResult: IWxTransformResult = wxTransformer({
    code,
    sourcePath: sourceFilePath,
    outputPath: outputFilePath,
    isNormal: true,
    isTyped: false,
    adapter,
    env: constantsReplaceList
  })
  const res = parseAst(PARSE_AST_TYPE.NORMAL, transformResult.ast, [], sourceFilePath, outputFilePath)
  return res.code
}
