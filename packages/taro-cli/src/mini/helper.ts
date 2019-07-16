import * as fs from 'fs-extra'
import * as path from 'path'

import * as _ from 'lodash'
import { Config } from '@tarojs/taro'
import * as wxTransformer from '@tarojs/transformer-wx'
import getHashName from '../util/hash'

import {
  BUILD_TYPES,
  MINI_APP_FILES,
  IMINI_APP_FILE_TYPE,
  PROJECT_CONFIG,
  processTypeEnum,
  REG_SCRIPTS,
  NODE_MODULES_REG,
  taroJsQuickAppComponents,
  PARSE_AST_TYPE,
  NODE_MODULES
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
  isEmptyObject,
  getInstalledNpmPkgPath,
  recursiveFindNodeModules,
  getBabelConfig
} from '../util'
import { resolveNpmPkgMainPath } from '../util/resolve_npm_files'
import {
  IProjectConfig,
  IOption,
  INpmConfig,
  IWxTransformResult,
  ITaroManifestConfig
} from '../util/types'
import CONFIG from '../config'

import {
  IComponentObj,
  IBuildResult,
  IDependency
} from './interface'
import { getNpmOutputDir } from '../util/npmExact'
import { parseAst } from './astProcess'

const isCopyingFiles: Map<string, boolean> = new Map<string, boolean>()
const dependencyTree: Map<string, IDependency> = new Map<string, IDependency>()
const hasBeenBuiltComponents: Set<string> = new Set<string>()
const componentExportsMap = new Map<string, IComponentObj[]>()
const depComponents = new Map<string, IComponentObj[]>()

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
  appConfig: Config,
  pageConfigs: Map<string, Config>,
  alias: IOption,
  compileConfig: {[k: string]: any},
  isProduction: boolean,
  buildAdapter: BUILD_TYPES,
  outputFilesTypes: IMINI_APP_FILE_TYPE,
  constantsReplaceList: IOption,
  nodeModulesPath: string,
  npmOutputDir: string,
  jsxAttributeNameReplace?: {
    [key: string]: any
  },
  quickappManifest?: ITaroManifestConfig
}

let BuildData: IBuildData

export const shouldTransformAgain = function () {
  const babelConfig = getBabelConfig(BuildData.projectConfig!.plugins!.babel)
  const pluginsStr = JSON.stringify(babelConfig.plugins)
  if (/transform-runtime/.test(pluginsStr)) {
    return true
  }
  return false
}

export function setAppConfig (appConfig: Config) {
  BuildData.appConfig = appConfig
}

export function setIsProduction (isProduction: boolean) {
  BuildData.isProduction = isProduction
}

export function setQuickappManifest (quickappManifest: ITaroManifestConfig) {
  BuildData.quickappManifest = quickappManifest
}

export function setBuildData (appPath: string, adapter: BUILD_TYPES): IBuildData {
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
    appConfig: {},
    pageConfigs: new Map<string, Config>(),
    compileConfig: useCompileConf,
    buildAdapter: adapter,
    outputFilesTypes: MINI_APP_FILES[adapter],
    constantsReplaceList: Object.assign({}, generateEnvList(projectConfig.env || {}), generateConstantsList(projectConfig.defineConstants || {}), {
      'process.env.TARO_ENV': adapter
    }),
    nodeModulesPath: recursiveFindNodeModules(path.join(appPath, NODE_MODULES)),
    npmOutputDir: getNpmOutputDir(outputDir, configDir, npmConfig),
    jsxAttributeNameReplace: weappConf.jsxAttributeNameReplace || {}
  }
  // 可以自定义输出文件类型
  if (weappConf!.customFilesTypes && !isEmptyObject(weappConf!.customFilesTypes)) {
    BuildData.outputFilesTypes = Object.assign({}, BuildData.outputFilesTypes, weappConf!.customFilesTypes[adapter] || {})
  }
  if (adapter === BUILD_TYPES.QUICKAPP) {
    BuildData.originalOutputDir = BuildData.outputDir
    BuildData.outputDirName = `${BuildData.outputDirName}/src`
    BuildData.outputDir = path.join(BuildData.appPath, BuildData.outputDirName)
    BuildData.npmOutputDir = getNpmOutputDir(BuildData.outputDir, BuildData.configDir, BuildData.npmConfig)
  }

  return BuildData
}

export function getBuildData (): IBuildData {
  return BuildData
}

export function getDependencyTree (): Map<string, IDependency> {
  return dependencyTree
}

export function setHasBeenBuiltComponents (componentPath: string) {
  hasBeenBuiltComponents.add(componentPath)
}

export function getHasBeenBuiltComponents () {
  return hasBeenBuiltComponents
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

export function getDepComponents (): Map<string, IComponentObj[]> {
  return depComponents
}

export function buildUsingComponents (
  filePath: string,
  components: IComponentObj[],
  isComponent?: boolean
): IOption {
  const usingComponents = Object.create(null)
  const pathAlias = BuildData.projectConfig.alias || {}
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
  const { appPath, isProduction, buildAdapter, projectConfig, npmConfig } = BuildData
  const pathAlias = projectConfig.alias || {}
  return components.length ? components.map(component => {
    let componentPath = component.path
    if (isAliasPath(componentPath as string, pathAlias)) {
      componentPath = replaceAliasPath(filePath, componentPath as string, pathAlias)
    }
    if (isNpmPkg(componentPath as string)) {
      try {
        componentPath = resolveNpmPkgMainPath(componentPath as string, isProduction, npmConfig, buildAdapter, appPath)
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
  }) : []
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
  const { sourceDir, outputDir } = BuildData
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

export function copyFilesFromSrcToOutput (files: string[], cb?: (sourceFilePath: string, outputFilePath: string) => void) {
  const { nodeModulesPath, npmOutputDir, sourceDir, outputDir, appPath, projectConfig } = BuildData
  const adapterConfig = Object.assign({}, projectConfig.weapp)
  files.forEach(file => {
    let outputFilePath
    if (NODE_MODULES_REG.test(file)) {
      outputFilePath = file.replace(nodeModulesPath, npmOutputDir)
    } else {
      if (adapterConfig.publicPath && adapterConfig.staticDirectory) {
        const hashName = getHashName(file)
        const staticPath = path.join(appPath, adapterConfig.staticDirectory, projectConfig.projectName || '')
        outputFilePath = `${staticPath}/${hashName}`
      } else {
        outputFilePath = file.replace(sourceDir, outputDir)
      }
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
      if (cb) {
        cb(file, outputFilePath)
      } else {
        fs.copySync(file, outputFilePath)
      }
    }
  })
}

export function getTaroJsQuickAppComponentsPath () {
  const taroJsQuickAppComponentsPkg = getInstalledNpmPkgPath(taroJsQuickAppComponents, BuildData.nodeModulesPath)
  if (!taroJsQuickAppComponentsPkg) {
    printLog(processTypeEnum.ERROR, '包安装', `缺少包 ${taroJsQuickAppComponents}，请安装！`)
    process.exit(0)
  }
  return path.join(path.dirname(taroJsQuickAppComponentsPkg as string), 'src/components')
}

const SCRIPT_CONTENT_REG = /<script\b[^>]*>([\s\S]*?)<\/script>/gm

export function getImportTaroSelfComponents (filePath, taroSelfComponents) {
  const importTaroSelfComponents = new Set<{ path: string, name: string }>()
  const taroJsQuickAppComponentsPath = getTaroJsQuickAppComponentsPath()
  taroSelfComponents.forEach(c => {
    const cPath = path.join(taroJsQuickAppComponentsPath, c)
    const cMainPath = path.join(cPath, 'index')
    const cFiles = fs.readdirSync(cPath).map(item => path.join(cPath, item))
    copyFilesFromSrcToOutput(cFiles, (sourceFilePath, outputFilePath) => {
      if (fs.existsSync(sourceFilePath)) {
        const fileContent = fs.readFileSync(sourceFilePath).toString()
        const match = SCRIPT_CONTENT_REG.exec(fileContent)
        if (match) {
          const scriptContent = match[1]
          const transformResult: IWxTransformResult = wxTransformer({
            code: scriptContent,
            sourcePath: sourceFilePath,
            sourceDir: getBuildData().sourceDir,
            outputPath: outputFilePath,
            isNormal: true,
            isTyped: false,
            adapter: BUILD_TYPES.QUICKAPP
          })
          const res = parseAst(PARSE_AST_TYPE.NORMAL, transformResult.ast, [], sourceFilePath, outputFilePath)
          const newFileContent = fileContent.replace(SCRIPT_CONTENT_REG, `<script>${res.code}</script>`)
          fs.ensureDirSync(path.dirname(outputFilePath))
          fs.writeFileSync(outputFilePath, newFileContent)
        }
      }
    })
    const cRelativePath = promoteRelativePath(path.relative(filePath, cMainPath.replace(BuildData.nodeModulesPath, BuildData.npmOutputDir)))
    importTaroSelfComponents.add({
      path: cRelativePath,
      name: c
    })
  })
  return importTaroSelfComponents
}
