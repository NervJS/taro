import * as fs from 'fs-extra'
import * as path from 'path'

import * as wxTransformer from '@tarojs/transformer-wx'

import { IWxTransformResult } from '../util/types'
import { processTypeEnum, REG_TYPESCRIPT, PARSE_AST_TYPE } from '../util/constants'
import { printLog } from '../util'

import { getBuildData, setAppConfig, getDependencyTree } from './helper'
import { parseAst } from './astProcess'

export async function buildEntry () {
  const {
    buildAdapter,
    constantsReplaceList,
    entryFilePath,
    outputDir,
    entryFileName,
    sourceDirName,
    projectConfig
  } = getBuildData()

  const quickAppConf = projectConfig.quickApp
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
    const { configObj, code } = parseAst(PARSE_AST_TYPE.ENTRY, transformResult.ast, entryFilePath, outputEntryFilePath)
    const dependencyTree = getDependencyTree()
    setAppConfig(configObj)
    console.log(code)
  } catch (err) {
    console.log(err)
  }
}
