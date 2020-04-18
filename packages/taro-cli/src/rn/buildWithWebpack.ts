import * as npmProcess from '../util/npm'
import { getBabelConfig, recursiveFindNodeModules, resolveScriptPath } from '../util'
import { IProjectConfig } from '@tarojs/taro/types/compile'
import { INpmConfig, IOption } from '../util/types'
import { BUILD_TYPES, IMINI_APP_FILE_TYPE, NODE_MODULES, PROJECT_CONFIG } from '../util/constants'
import * as path from 'path'
import * as _ from 'lodash'
import CONFIG from '../config'

export interface IBuildData {
  appPath: string,
  configDir: string,
  sourceDirName: string,
  outputDirName: string,
  sourceDir: string,
  outputDir: string,
  originalOutputDir: string,
  entryFilePath: string,
  entryFileName: string,
  projectConfig: IProjectConfig,
  npmConfig: INpmConfig,
  alias: IOption,
  isProduction: boolean,
  buildAdapter: BUILD_TYPES,
  outputFilesTypes?: IMINI_APP_FILE_TYPE,
  nodeModulesPath: string,
}

let BuildData: IBuildData

export async function buildWithWebpack ({appPath, watch}: { appPath: string, watch?: boolean }, builder) {
  const {
    entryFilePath,
    buildAdapter,
    projectConfig,
    isProduction,
    alias,
    sourceDirName,
    outputDirName,
    nodeModulesPath
  } = getBuildData()

  console.log(appPath)
  const rnRunner = await npmProcess.getNpmPkg('@tarojs/rn-runner', appPath)
  const babelConfig = getBabelConfig(projectConfig.babel)
  const rnRunnerOpts = {
    entry: {
      app: [entryFilePath]
    },
    alias,
    copy: projectConfig.copy, // 文件 copy 配置
    sourceRoot: sourceDirName,
    outputRoot: outputDirName,
    buildAdapter,
    babel: babelConfig,
    csso: projectConfig.csso,
    sass: projectConfig.sass,
    uglify: projectConfig.uglify,
    plugins: projectConfig.plugins,
    projectName: projectConfig.projectName,
    isWatch: watch,
    mode: isProduction ? 'production' : 'development',
    env: projectConfig.env,
    defineConstants: projectConfig.defineConstants,
    designWidth: projectConfig.designWidth,
    deviceRatio: projectConfig.deviceRatio,
    nodeModulesPath,
    ...projectConfig.rn
  }
  // console.log('rnRunnerOpts', rnRunnerOpts)
  await rnRunner(appPath, rnRunnerOpts, builder)
}

export function setIsProduction (isProduction: boolean) {
  BuildData.isProduction = isProduction
}

export function setBuildData (appPath: string, adapter: BUILD_TYPES, options?: Partial<IBuildData> | null) {
  const configDir = path.join(appPath, PROJECT_CONFIG)
  const projectConfig = require(configDir)(_.merge)
  const rnConf = projectConfig.rn || {}
  const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
  const outputDirName = rnConf.outputRoot || CONFIG.RN_OUTPUT_DIR
  const sourceDir = path.join(appPath, sourceDirName)
  const outputDir = path.join(appPath, outputDirName)
  const entryFilePath = resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
  const entryFileName = path.basename(entryFilePath)

  const pathAlias = projectConfig.alias || {}
  const npmConfig = Object.assign({
    name: CONFIG.NPM_DIR,
    dir: null
  }, rnConf.npm)

  BuildData = {
    appPath,
    configDir,
    sourceDirName,
    outputDirName,
    sourceDir,
    outputDir,
    originalOutputDir: outputDir,
    entryFilePath,
    entryFileName,
    projectConfig,
    npmConfig,
    alias: pathAlias,
    isProduction: false,
    buildAdapter: adapter,
    nodeModulesPath: recursiveFindNodeModules(path.join(appPath, NODE_MODULES))
  }
  if (options) {
    Object.assign(BuildData, options)
  }
  return BuildData
}

export function getBuildData (): IBuildData {
  return BuildData
}
