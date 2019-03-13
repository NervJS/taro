import * as path from 'path'

import * as _ from 'lodash'
import { AppConfig } from '@tarojs/taro'

import {
  BUILD_TYPES,
  PROJECT_CONFIG
} from '../util/constants'
import CONFIG from '../config'
import {
  resolveScriptPath,
  generateEnvList,
  generateConstantsList
} from '../util'
import { IProjectConfig, INpmConfig, IOption } from '../util/types'
import { getNodeModulesPath, getNpmOutputDir } from '../util/npmExact'
import { IDependency } from './interface'

const appPath = process.cwd()
const configDir = path.join(appPath, PROJECT_CONFIG)
const projectConfig = require(configDir)(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
const sourceDir = path.join(appPath, sourceDirName)
const outputDir = path.join(appPath, outputDirName)
const entryFilePath = resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)

const pathAlias = projectConfig.alias || {}
const quickAppConf = projectConfig.quickApp || {}
const npmConfig = Object.assign({
  name: CONFIG.NPM_DIR,
  dir: null
}, quickAppConf.npm)

const minifestJSON = {}
const dependencyTree: Map<string, IDependency> = new Map<string, IDependency>()

export interface IBuildData {
  appPath: string,
  configDir: string,
  sourceDirName: string,
  outputDirName: string,
  sourceDir: string,
  outputDir: string,
  entryFilePath: string,
  entryFileName: string,
  projectConfig: IProjectConfig,
  npmConfig: INpmConfig,
  appConfig: AppConfig,
  alias: IOption,
  isProduction: boolean,
  buildAdapter: BUILD_TYPES,
  constantsReplaceList: IOption,
  nodeModulesPath: string,
  npmOutputDir: string
}

const BuildData: IBuildData = {
  appPath,
  configDir,
  sourceDirName,
  outputDirName,
  sourceDir,
  outputDir,
  entryFilePath,
  entryFileName,
  projectConfig,
  npmConfig,
  alias: pathAlias,
  isProduction: false,
  appConfig: {},
  buildAdapter: BUILD_TYPES.WEAPP,
  constantsReplaceList: {},
  nodeModulesPath: getNodeModulesPath(),
  npmOutputDir: getNpmOutputDir(outputDir, configDir, npmConfig)
}

export function setAppConfig (appConfig: AppConfig) {
  BuildData.appConfig = appConfig
}

export function setIsProduction (isProduction: boolean) {
  BuildData.isProduction = isProduction
}

export function setBuildAdapter (adapter: BUILD_TYPES) {
  BuildData.buildAdapter = adapter
  BuildData.constantsReplaceList = Object.assign({}, generateEnvList(projectConfig.env || {}), generateConstantsList(projectConfig.defineConstants || {}), {
    'process.env.TARO_ENV': adapter
  })
}

export function getBuildData (): IBuildData {
  return BuildData
}

export function setManifestJSON (key, value) {
  minifestJSON[key] = value
}

export function getDependencyTree (): Map<string, IDependency> {
  return dependencyTree
}

export function isQuickAppPkg (name: string): boolean {
  return /@system\./.test(name)
}
