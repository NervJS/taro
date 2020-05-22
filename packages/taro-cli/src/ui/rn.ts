import * as path from 'path'
import * as fs from 'fs-extra'
import * as wxTransformer from '@tarojs/transformer-wx'

import { processTypeEnum, REG_TYPESCRIPT, printLog, resolveScriptPath, chalk } from '@tarojs/helper'

import { Compiler as RNCompiler } from '../rn_bak'
import { analyzeFiles, analyzeStyleFilesImport, copyFileToDist, RN_OUTPUT_NAME, parseEntryAst } from './common'
import { IBuildData } from './ui.types'

export async function buildForRN (uiIndex = 'index', buildData) {
  const {appPath} = buildData
  const compiler = new RNCompiler(appPath)
  console.log()
  console.log(chalk.green('开始编译 RN 端组件库！'))
  await compiler.buildTemp() // complie to rn_temp
  await buildRNLib(uiIndex, buildData)
}

export async function buildRNLib (uiIndex, buildData: IBuildData) {
  try {
    const { appPath, outputDirName, sourceDir ,rnTempPath} = buildData
    const outputDir = path.join(appPath, outputDirName, RN_OUTPUT_NAME)
    const tempEntryFilePath = resolveScriptPath(path.join(sourceDir, uiIndex))
    const baseEntryFilePath = resolveScriptPath(path.join(rnTempPath, uiIndex)) // base by rn_temp
    const outputEntryFilePath = path.join(outputDir, path.basename(tempEntryFilePath))
    const code = fs.readFileSync(tempEntryFilePath).toString()
    const transformResult = wxTransformer({
      code,
      sourcePath: tempEntryFilePath,
      outputPath: outputEntryFilePath,
      isNormal: true,
      isTyped: REG_TYPESCRIPT.test(tempEntryFilePath)
    })
    const {styleFiles, components, code: generateCode} = parseEntryAst(transformResult.ast, baseEntryFilePath)
    const relativePath = path.relative(appPath, tempEntryFilePath)
    tempEntryFilePath.replace(path.extname(tempEntryFilePath),'.js')
    printLog(processTypeEnum.COPY, '发现文件', relativePath)
    fs.ensureDirSync(path.dirname(outputEntryFilePath))
    fs.writeFileSync(outputEntryFilePath, generateCode)
    if (components.length) {
      components.forEach(item => {
        copyFileToDist(item.path as string, rnTempPath, outputDir, buildData)
      })
      analyzeFiles(components.map(item => item.path as string), rnTempPath, outputDir, buildData)
    }
    if (styleFiles.length) {
      styleFiles.forEach(item => {
        copyFileToDist(item, rnTempPath, path.join(appPath, outputDirName), buildData)
      })
      analyzeStyleFilesImport(styleFiles, rnTempPath, path.join(appPath, outputDirName), buildData)
    }
  } catch (err) {
    console.log(err)
  }
}
