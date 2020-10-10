import * as fs from 'fs-extra'
import * as path from 'path'
import * as wxTransformer from '@tarojs/transformer-wx'
import { printLog, resolveScriptPath, npm as npmProcess, processTypeEnum, REG_TYPESCRIPT, chalk, recursiveMerge } from '@tarojs/helper'

import { Compiler } from '../h5'
import { IBuildData, IH5BuildConfig } from './ui.types'
import { copyFileToDist, analyzeFiles, parseEntryAst, analyzeStyleFilesImport, H5_OUTPUT_NAME, copyAllInterfaceFiles } from './common'
import { IBuildHooks } from '../util/types'

async function buildForH5 (uiIndex = 'index', buildData: IBuildData, buildHooks: IBuildHooks) {
  const {appPath} = buildData
  const compiler = new Compiler(appPath, uiIndex, true)
  console.log()
  console.log(chalk.green('开始编译 H5 端组件库！'))
  await compiler.buildTemp()
  if (process.env.TARO_BUILD_TYPE === 'script') {
    await buildH5Script(buildData, buildHooks)
  } else {
    await buildH5Lib(uiIndex, buildData)
  }
}

async function buildH5Script (buildData: IBuildData, buildHooks: IBuildHooks) {
  const { appPath, projectConfig, entryFileName, sourceDirName, tempPath } = buildData
  const h5Config: IH5BuildConfig = Object.assign({}, projectConfig.h5, buildHooks)
  const entryFile = path.basename(entryFileName, path.extname(entryFileName)) + '.js'
  h5Config.isWatch = false
  recursiveMerge(h5Config, {
    env: projectConfig.env,
    defineConstants: projectConfig.defineConstants,
    plugins: projectConfig.plugins,
    babel: projectConfig.babel,
    csso: projectConfig.csso,
    uglify: projectConfig.uglify,
    sass: projectConfig.sass,
    designWidth: projectConfig.designWidth,
    sourceRoot: sourceDirName,
    outputRoot: `${buildData.outputDirName}/${H5_OUTPUT_NAME}`,
    entry: Object.assign({
      app: [path.join(tempPath, entryFile)]
    }, h5Config.entry),
    isWatch: false
  })
  if (projectConfig.deviceRatio) {
    h5Config.deviceRatio = projectConfig.deviceRatio
  }
  const webpackRunner = await npmProcess.getNpmPkg('@tarojs/webpack-runner', appPath)
  webpackRunner(appPath, h5Config)
}

async function buildH5Lib (uiIndex, buildData: IBuildData) {
  try {
    const { sourceDir, appPath, outputDirName, tempPath } = buildData
    const outputDir = path.join(appPath, outputDirName, H5_OUTPUT_NAME)
    const tempEntryFilePath = resolveScriptPath(path.join(tempPath, uiIndex))
    const outputEntryFilePath = path.join(outputDir, path.basename(tempEntryFilePath))
    const code = fs.readFileSync(tempEntryFilePath).toString()
    const transformResult = wxTransformer({
      code,
      sourcePath: tempEntryFilePath,
      isNormal: true,
      isTyped: REG_TYPESCRIPT.test(tempEntryFilePath)
    })
    const {styleFiles, components, code: generateCode} = parseEntryAst(transformResult.ast, tempEntryFilePath)
    const relativePath = path.relative(appPath, tempEntryFilePath)
    printLog(processTypeEnum.COPY, '发现文件', relativePath)
    fs.ensureDirSync(path.dirname(outputEntryFilePath))
    fs.writeFileSync(outputEntryFilePath, generateCode)
    if (components.length) {
      components.forEach(item => {
        copyFileToDist(item.path as string, tempPath, outputDir, buildData)
      })
      analyzeFiles(components.map(item => item.path as string), tempPath, outputDir, buildData)
    }
    if (styleFiles.length) {
      styleFiles.forEach(item => {
        copyFileToDist(item, tempPath, path.join(appPath, outputDirName), buildData)
      })
      analyzeStyleFilesImport(styleFiles, tempPath, path.join(appPath, outputDirName), buildData)
    }
    copyAllInterfaceFiles(sourceDir, outputDir, buildData)
  } catch (err) {
    console.log(err)
  }
}

export { buildForH5, buildH5Lib, buildH5Script }
