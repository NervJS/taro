import * as fs from 'fs-extra'
import * as path from 'path'
import * as os from 'os'
import { execSync } from 'child_process'

import * as _ from 'lodash'
import * as ora from 'ora'
import chalk from 'chalk'
import { IProjectConfig, ITaroManifestConfig } from '@tarojs/taro/types/compile'

import {
  BUILD_TYPES,
  MINI_APP_FILES,
  IMINI_APP_FILE_TYPE,
  PROJECT_CONFIG,
  NODE_MODULES
} from '../util/constants'
import {
  resolveScriptPath,
  isEmptyObject,
  recursiveFindNodeModules,
  shouldUseCnpm,
  shouldUseYarn,
  unzip,
  generateEnvList,
  generateConstantsList
} from '../util'
import {
  IOption,
  INpmConfig
} from '../util/types'
import CONFIG from '../config'
import { downloadGithubRepoLatestRelease } from '../util/dowload'

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
  compileConfig: {[k: string]: any},
  isProduction: boolean,
  buildAdapter: BUILD_TYPES,
  outputFilesTypes: IMINI_APP_FILE_TYPE,
  nodeModulesPath: string,
  jsxAttributeNameReplace?: {
    [key: string]: any
  },
  quickappManifest?: ITaroManifestConfig,
  constantsReplaceList: IOption,
}

let BuildData: IBuildData

export function setIsProduction (isProduction: boolean) {
  BuildData.isProduction = isProduction
}

export function setQuickappManifest (quickappManifest: ITaroManifestConfig) {
  BuildData.quickappManifest = quickappManifest
}

export function setBuildData (appPath: string, adapter: BUILD_TYPES, options?: Partial<IBuildData> | null): IBuildData {
  const configDir = path.join(appPath, PROJECT_CONFIG)
  const projectConfig = require(configDir)(_.merge)
  const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
  const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
  const sourceDir = path.join(appPath, sourceDirName)
  const outputDir = path.join(appPath, outputDirName)
  const entryFilePath = resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
  const entryFileName = path.basename(entryFilePath)

  const pathAlias = projectConfig.alias || {}
  const weappConf = projectConfig.weapp || {}
  const npmConfig = Object.assign({
    name: CONFIG.NPM_DIR,
    dir: null
  }, weappConf.npm)
  const useCompileConf = Object.assign({}, weappConf.compile)
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
    compileConfig: useCompileConf,
    buildAdapter: adapter,
    outputFilesTypes: MINI_APP_FILES[adapter],
    nodeModulesPath: recursiveFindNodeModules(path.join(appPath, NODE_MODULES)),
    jsxAttributeNameReplace: weappConf.jsxAttributeNameReplace || {},
    constantsReplaceList: Object.assign({}, generateEnvList(projectConfig.env || {}), generateConstantsList(projectConfig.defineConstants || {}), {
      'process.env.TARO_ENV': adapter
    })
  }
  // 可以自定义输出文件类型
  if (weappConf!.customFilesTypes && !isEmptyObject(weappConf!.customFilesTypes)) {
    BuildData.outputFilesTypes = Object.assign({}, BuildData.outputFilesTypes, weappConf!.customFilesTypes[adapter] || {})
  }
  if (adapter === BUILD_TYPES.QUICKAPP) {
    BuildData.originalOutputDir = BuildData.outputDir
    BuildData.outputDirName = `${BuildData.outputDirName}/src`
    BuildData.outputDir = path.join(BuildData.appPath, BuildData.outputDirName)
  }
  if (options) {
    Object.assign(BuildData, options)
  }

  return BuildData
}

export function getBuildData (): IBuildData {
  return BuildData
}

export function setOutputDirName (outputDirName) {
  BuildData.originalOutputDir = BuildData.outputDir
  BuildData.outputDirName = outputDirName
  BuildData.outputDir = path.join(BuildData.appPath, BuildData.outputDirName)
}

export async function prepareQuickAppEnvironment (buildData: IBuildData) {
  let isReady = false
  let needDownload = false
  let needInstall = false
  const originalOutputDir = buildData.originalOutputDir
  console.log()
  if (fs.existsSync(path.join(buildData.originalOutputDir, 'sign'))) {
    needDownload = false
  } else {
    needDownload = true
  }
  if (needDownload) {
    const getSpinner = ora('开始下载快应用运行容器...').start()
    await downloadGithubRepoLatestRelease('NervJS/quickapp-container', buildData.appPath, originalOutputDir)
    await unzip(path.join(originalOutputDir, 'download_temp.zip'))
    getSpinner.succeed('快应用运行容器下载完成')
  } else {
    console.log(`${chalk.green('✔ ')} 快应用容器已经准备好`)
  }
  process.chdir(originalOutputDir)
  console.log()
  if (fs.existsSync(path.join(originalOutputDir, 'node_modules'))) {
    needInstall = false
  } else {
    needInstall = true
  }
  if (needInstall) {
    const isWindows = os.platform() === 'win32'
    let command
    if (shouldUseYarn()) {
      if(!isWindows) {
        command = 'NODE_ENV=development yarn install'
      } else {
        command = 'yarn install'
      }
    } else if (shouldUseCnpm()) {
      if(!isWindows) {
        command = 'NODE_ENV=development cnpm install'
      } else {
        command = 'cnpm install'
      }
    } else {
      if(!isWindows) {
        command = 'NODE_ENV=development npm install'
      } else {
        command = 'npm install'
      }
    }
    const installSpinner = ora(`安装快应用依赖环境, 需要一会儿...`).start()
    try {
      const stdout = execSync(command)
      installSpinner.color = 'green'
      installSpinner.succeed('安装成功')
      console.log(`${stdout}`)
      isReady = true
    } catch (error) {
      installSpinner.color = 'red'
      installSpinner.fail(chalk.red(`快应用依赖环境安装失败，请进入 ${path.basename(originalOutputDir)} 重新安装！`))
      console.log(`${error}`)
      isReady = false
    }
  } else {
    console.log(`${chalk.green('✔ ')} 快应用依赖已经安装好`)
    isReady = true
  }
  return isReady
}

export async function runQuickApp (isWatch: boolean | void, buildData: IBuildData, port?: number, release?: boolean) {
  const originalOutputDir = buildData.originalOutputDir
  const { compile } = require(require.resolve('hap-toolkit/lib/commands/compile', { paths: [originalOutputDir] }))
  if (isWatch) {
    const { launchServer } = require(require.resolve('@hap-toolkit/server', { paths: [originalOutputDir] }))
    launchServer({
      port: port || 12306,
      watch: isWatch,
      clearRecords: false,
      disableADB: false
    })
    compile('native', 'dev', true)
  } else {
    if (!release) {
      compile('native', 'dev', false)
    } else {
      compile('native', 'prod', false)
    }
  }
}
