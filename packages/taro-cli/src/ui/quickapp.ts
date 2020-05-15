import chalk from 'chalk'
import * as fs from 'fs-extra'
import * as path from 'path'

import { processTypeEnum, REG_TYPESCRIPT, BUILD_TYPES } from '../util/constants'
import * as wxTransformer from '@tarojs/transformer-wx'
import { compileDepStyles } from '../mini/compileStyle'
import { printLog } from '../util'
import { analyzeFiles, parseEntryAst, QUICKAPP_OUTPUT_NAME, copyFileToDist, copyAllInterfaceFiles } from './common'
import { IBuildData } from './ui.types'

export async function buildForQuickapp (buildData: IBuildData) {
  process.env.TARO_ENV = BUILD_TYPES.QUICKAPP;
  const { appPath, entryFilePath, outputDirName, entryFileName, sourceDir } = buildData
  console.log()
  console.log(chalk.green('开始编译快应用端组件库！'))
  if (!fs.existsSync(entryFilePath)) {
    console.log(chalk.red('入口文件不存在，请检查！'))
    return
  }
  try {
    const outputDir = path.join(appPath, outputDirName, QUICKAPP_OUTPUT_NAME)
    const outputEntryFilePath = path.join(outputDir, entryFileName)
    const code = fs.readFileSync(entryFilePath).toString()
    const transformResult = wxTransformer({
      code,
      sourcePath: entryFilePath,
      outputPath: outputEntryFilePath,
      isNormal: true,
      isTyped: REG_TYPESCRIPT.test(entryFilePath)
    })
    const {styleFiles, components} = parseEntryAst(transformResult.ast, entryFilePath)
    if (styleFiles.length) {
      const outputStylePath = path.join(outputDir, 'css', 'index.css')
      await compileDepStyles(outputStylePath, styleFiles)
    }
    const relativePath = path.relative(appPath, entryFilePath)
    printLog(processTypeEnum.COPY, '发现文件', relativePath)
    fs.ensureDirSync(path.dirname(outputEntryFilePath))
    fs.copyFileSync(entryFilePath, path.format({
      dir: path.dirname(outputEntryFilePath),
      base: path.basename(outputEntryFilePath)
    }))
    if (components.length) {
      components.forEach(item => {
        copyFileToDist(item.path as string, sourceDir, outputDir, buildData)
      })
      analyzeFiles(components.map(item => item.path as string), sourceDir, outputDir, buildData)
    }
    copyAllInterfaceFiles(sourceDir, outputDir, buildData)
  } catch (err) {
    console.log(err)
  }
}
