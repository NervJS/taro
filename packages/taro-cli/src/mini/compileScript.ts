import * as fs from 'fs-extra'
import * as path from 'path'

import * as wxTransformer from '@tarojs/transformer-wx'

import {
  printLog,
  isDifferentArray,
  copyFileSync,
  getBabelConfig,
  uglifyJS
} from '../util'
import {
  BUILD_TYPES,
  processTypeEnum,
  REG_TYPESCRIPT,
  NODE_MODULES_REG,
  PARSE_AST_TYPE
} from '../util/constants'
import { callPlugin } from '../util/npm'
import { npmCodeHack } from '../util/resolve_npm_files'
import { IWxTransformResult, TogglableOptions } from '../util/types'

import {
  shouldTransformAgain,
  getBuildData,
  copyFilesFromSrcToOutput,
  getDependencyTree
} from './helper'
import { parseAst } from './astProcess'
import { IDependency } from './interface'

const isBuildingScripts: Map<string, boolean> = new Map<string, boolean>()

export function initCompileScripts () {
  isBuildingScripts.clear()
}

export function compileDepScripts (scriptFiles: string[], needUseBabel?: boolean, buildDepSync?: boolean) {
  const {
    nodeModulesPath,
    npmOutputDir,
    projectConfig,
    sourceDir,
    outputDir,
    appPath,
    buildAdapter,
    constantsReplaceList,
    isProduction,
    jsxAttributeNameReplace
  } = getBuildData()
  const dependencyTree = getDependencyTree()
  return scriptFiles.map(async item => {
    if (path.isAbsolute(item)) {
      let outputItem
      if (NODE_MODULES_REG.test(item)) {
        outputItem = item.replace(nodeModulesPath, npmOutputDir).replace(path.extname(item), '.js')
      } else {
        outputItem = item.replace(path.join(sourceDir), path.join(outputDir)).replace(path.extname(item), '.js')
      }
      const weappConf = Object.assign({}, projectConfig.weapp)
      const useCompileConf = Object.assign({}, weappConf.compile)
      const compileExclude = (useCompileConf.exclude || []).filter(item => !/(?:\/|^)node_modules(\/|$)/.test(item))
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
            sourceDir,
            outputPath: outputItem,
            isNormal: true,
            isTyped: REG_TYPESCRIPT.test(item),
            adapter: buildAdapter,
            env: constantsReplaceList,
            jsxAttributeNameReplace
          })
          const ast = transformResult.ast
          const res = parseAst(PARSE_AST_TYPE.NORMAL, ast, [], item, outputItem)
          const fileDep = dependencyTree.get(item) || {} as IDependency
          let resCode = res.code
          if (needUseBabel) {
            resCode = await compileScriptFile(res.code, item, outputItem, buildAdapter)
          }
          fs.ensureDirSync(path.dirname(outputItem))
          if (isProduction && needUseBabel) {
            resCode = uglifyJS(resCode, item, appPath, projectConfig!.plugins!.uglify as TogglableOptions)
          }
          if (NODE_MODULES_REG.test(item)) {
            resCode = npmCodeHack(outputItem, resCode, buildAdapter)
          }
          fs.writeFileSync(outputItem, resCode)
          let modifyOutput = outputItem.replace(appPath + path.sep, '')
          modifyOutput = modifyOutput.split(path.sep).join('/')
          printLog(processTypeEnum.GENERATE, '依赖文件', modifyOutput)
          // 编译依赖的脚本文件
          if (isDifferentArray(fileDep['script'], res.scriptFiles)) {
            if (buildDepSync) {
              await Promise.all(compileDepScripts(res.scriptFiles, needUseBabel, buildDepSync))
            } else {
              compileDepScripts(res.scriptFiles, needUseBabel, buildDepSync)
            }
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
    appPath,
    sourceDir,
    constantsReplaceList,
    jsxAttributeNameReplace,
    projectConfig
  } = getBuildData()
  if (NODE_MODULES_REG.test(sourceFilePath) && fs.existsSync(outputFilePath)) {
    return fs.readFileSync(outputFilePath).toString()
  }
  const babelConfig = getBabelConfig(projectConfig!.plugins!.babel)
  const compileScriptRes = await callPlugin('babel', content, sourceFilePath, babelConfig, appPath)
  const code = compileScriptRes.code
  if (!shouldTransformAgain()) {
    return code
  }
  const transformResult: IWxTransformResult = wxTransformer({
    code,
    sourcePath: sourceFilePath,
    sourceDir,
    outputPath: outputFilePath,
    isNormal: true,
    isTyped: false,
    adapter,
    env: constantsReplaceList,
    jsxAttributeNameReplace
  })
  const res = parseAst(PARSE_AST_TYPE.NORMAL, transformResult.ast, [], sourceFilePath, outputFilePath)
  return res.code
}
