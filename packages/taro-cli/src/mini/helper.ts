import * as fs from 'fs-extra'
import * as path from 'path'

import * as _ from 'lodash'
import { AppConfig } from '@tarojs/taro'

import {
  BUILD_TYPES,
  MINI_APP_FILES,
  IMINI_APP_FILE_TYPE,
  PROJECT_CONFIG,
  processTypeEnum,
  REG_SCRIPTS
} from '../util/constants'
import {
  resolveScriptPath,
  isAliasPath,
  replaceAliasPath,
  promoteRelativePath,
  isNpmPkg,
  printLog,
  generateEnvList,
  generateConstantsList,
  isEmptyObject
} from '../util'
import { callPluginSync } from '../util/npm'
import { resolveNpmPkgMainPath } from '../util/resolve_npm_files'
import {
  IProjectConfig,
  IOption,
  INpmConfig
} from '../util/types'
import defaultBabelConfig from '../config/babel'
import defaultUglifyConfig from '../config/uglify'
import CONFIG from '../config'

import {
  IComponentObj,
  IBuildResult,
  IDependency
} from './interface'
import { NODE_MODULES_REG } from './constants'
import { getNodeModulesPath, getNpmOutputDir } from './npmExact'

const appPath = process.cwd()
const configDir = path.join(appPath, PROJECT_CONFIG)
const projectConfig = require(configDir)(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
const sourceDir = path.join(appPath, sourceDirName)
const outputDir = path.join(appPath, outputDirName)
const entryFilePath = resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)

const plugins = projectConfig.plugins || {}
const pathAlias = projectConfig.alias || {}
const weappConf = projectConfig.weapp || {}
const npmConfig = Object.assign({
  name: CONFIG.NPM_DIR,
  dir: null
}, weappConf.npm)
const useCompileConf = Object.assign({}, weappConf.compile)
const compileInclude = useCompileConf.include || []

const isCopyingFiles: Map<string, boolean> = new Map<string, boolean>()
const dependencyTree: Map<string, IDependency> = new Map<string, IDependency>()
const hasBeenBuiltComponents: Set<string> = new Set<string>()
const componentExportsMap = new Map<string, IComponentObj[]>()
const componentsBuildResult = new Map<string, IBuildResult>()
const depComponents = new Map<string, IComponentObj[]>()

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
  compileInclude: string[],
  isProduction: boolean,
  buildAdapter: BUILD_TYPES,
  outputFilesTypes: IMINI_APP_FILE_TYPE,
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
  compileInclude,
  buildAdapter: BUILD_TYPES.WEAPP,
  outputFilesTypes: MINI_APP_FILES[BUILD_TYPES.WEAPP],
  constantsReplaceList: {},
  nodeModulesPath: getNodeModulesPath(),
  npmOutputDir: getNpmOutputDir(outputDir, configDir, npmConfig)
}

export const babelConfig = _.mergeWith({}, defaultBabelConfig, plugins.babel, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return Array.from(new Set(srcValue.concat(objValue)))
  }
})

export const shouldTransformAgain = (function () {
  const pluginsStr = JSON.stringify(babelConfig.plugins)
  if (/transform-runtime/.test(pluginsStr)) {
    return true
  }
  return false
})()

export function setAppConfig (appConfig: AppConfig) {
  BuildData.appConfig = appConfig
}

export function setIsProduction (isProduction: boolean) {
  BuildData.isProduction = isProduction
}

export function setBuildAdapter (adapter: BUILD_TYPES) {
  BuildData.buildAdapter = adapter
  BuildData.outputFilesTypes = MINI_APP_FILES[adapter]
  // 可以自定义输出文件类型
  if (weappConf.customFilesTypes && !isEmptyObject(weappConf.customFilesTypes)) {
    BuildData.outputFilesTypes = Object.assign({}, BuildData.outputFilesTypes, weappConf.customFilesTypes[adapter] || {})
  }
  BuildData.constantsReplaceList = Object.assign({}, generateEnvList(projectConfig.env || {}), generateConstantsList(projectConfig.defineConstants || {}), {
    'process.env.TARO_ENV': adapter
  })
}

export function getBuildData (): IBuildData {
  return BuildData
}

export function uglifyJS (resCode: string, filePath: string): string {
  const uglifyPluginConfig = plugins.uglify || { enable: true }
  if (uglifyPluginConfig.enable) {
    const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
    const uglifyResult = callPluginSync('uglifyjs', resCode, filePath, uglifyConfig)
    if (uglifyResult.error) {
      printLog(processTypeEnum.ERROR, '压缩错误', `文件${filePath}`)
      console.log(uglifyResult.error)
      return resCode
    }
    return uglifyResult.code
  }
  return resCode
}

export function getDependencyTree (): Map<string, IDependency> {
  return dependencyTree
}

export function setHasBeenBuiltComponents (componentPath: string) {
  hasBeenBuiltComponents.add(componentPath)
}

export function isComponentHasBeenBuilt (componentPath: string): boolean {
  return hasBeenBuiltComponents.has(componentPath)
}

export function deleteHasBeenBuiltComponent (filePath) {
  if (hasBeenBuiltComponents.has(filePath)) {
    hasBeenBuiltComponents.delete(filePath)
  }
}

export function setComponentExportsMap (key: string, value: IComponentObj[]) {
  componentExportsMap.set(key, value)
}

export function getComponentExportsMapItem (key: string): IComponentObj[] | void {
  return componentExportsMap.get(key)
}

export function getComponentExportsMap (): Map<string, IComponentObj[]> {
  return componentExportsMap
}

export function getComponentsBuildResult (): Map<string, IBuildResult> {
  return componentsBuildResult
}

export function getDepComponents (): Map<string, IComponentObj[]> {
  return depComponents
}

export function buildUsingComponents (
  filePath: string,
  components: IComponentObj[],
  isComponent?: boolean
): IOption {
  const usingComponents = Object.create(null)
  for (const component of components) {
    let componentPath = component.path
    if (isAliasPath(componentPath as string, pathAlias)) {
      componentPath = replaceAliasPath(filePath, componentPath as string, pathAlias)
    }
    componentPath = resolveScriptPath(path.resolve(filePath, '..', componentPath as string))
    if (fs.existsSync(componentPath)) {
      componentPath = promoteRelativePath(path.relative(filePath, componentPath))
    } else {
      componentPath = component.path
    }
    if (component.name) {
      usingComponents[component.name] = (componentPath as string).replace(path.extname(componentPath as string), '')
    }
  }
  return Object.assign({}, isComponent ? { component: true } : { usingComponents: {} }, components.length ? {
    usingComponents
  } : {})
}

export function getRealComponentsPathList (
  filePath: string,
  components: IComponentObj[]
): IComponentObj[] {
  const { isProduction, buildAdapter } = BuildData
  return components.map(component => {
    let componentPath = component.path
    if (isAliasPath(componentPath as string, pathAlias)) {
      componentPath = replaceAliasPath(filePath, componentPath as string, pathAlias)
    }
    if (isNpmPkg(componentPath as string)) {
      try {
        componentPath = resolveNpmPkgMainPath(componentPath as string, isProduction, npmConfig, buildAdapter)
      } catch (err) {
        console.log(err)
      }
    } else {
      componentPath = path.resolve(path.dirname(filePath), componentPath as string)
      componentPath = resolveScriptPath(componentPath)
    }
    if (componentPath && isFileToBePage(componentPath)) {
      printLog(processTypeEnum.ERROR, '组件引用', `文件${component.path}已经在 app.js 中被指定为页面，不能再作为组件来引用！`)
    }
    return {
      path: componentPath,
      name: component.name,
      type: component.type
    }
  })
}

export function isFileToBePage (filePath: string): boolean {
  let isPage = false
  const { appConfig, sourceDir } = BuildData
  const extname = path.extname(filePath)
  const pages = appConfig.pages || []
  const filePathWithoutExt = filePath.replace(extname, '')
  pages.forEach(page => {
    if (filePathWithoutExt === path.join(sourceDir, page)) {
      isPage = true
    }
  })
  return isPage && REG_SCRIPTS.test(extname)
}

export function getDepStyleList (
  outputFilePath: string,
  buildDepComponentsResult: IBuildResult[]
): string[] {
  let depWXSSList: string[] = []
  if (buildDepComponentsResult.length) {
    depWXSSList = buildDepComponentsResult.map(item => {
      let wxss = item.wxss
      wxss = wxss.replace(sourceDir, outputDir)
      wxss = promoteRelativePath(path.relative(outputFilePath, wxss))
      return wxss
    })
  }
  return depWXSSList
}

export function initCopyFiles () {
  isCopyingFiles.clear()
}

export function copyFilesFromSrcToOutput (files: string[]) {
  const { nodeModulesPath, npmOutputDir } = BuildData
  files.forEach(file => {
    let outputFilePath
    if (NODE_MODULES_REG.test(file)) {
      outputFilePath = file.replace(nodeModulesPath, npmOutputDir)
    } else {
      outputFilePath = file.replace(sourceDir, outputDir)
    }
    if (isCopyingFiles.get(outputFilePath)) {
      return
    }
    isCopyingFiles.set(outputFilePath, true)
    let modifySrc = file.replace(appPath + path.sep, '')
    modifySrc = modifySrc.split(path.sep).join('/')
    let modifyOutput = outputFilePath.replace(appPath + path.sep, '')
    modifyOutput = modifyOutput.split(path.sep).join('/')
    printLog(processTypeEnum.COPY, '文件', modifyOutput)
    if (!fs.existsSync(file)) {
      printLog(processTypeEnum.ERROR, '文件', `${modifySrc} 不存在`)
    } else {
      fs.ensureDir(path.dirname(outputFilePath))
      if (file === outputFilePath) {
        return
      }
      fs.copySync(file, outputFilePath)
    }
  })
}
