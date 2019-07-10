import * as fs from 'fs-extra'
import * as path from 'path'

import { Config as IConfig } from '@tarojs/taro'
import * as wxTransformer from '@tarojs/transformer-wx'
import * as _ from 'lodash'
import traverse from 'babel-traverse'

import { IWxTransformResult, TogglableOptions } from '../util/types'
import {
  REG_TYPESCRIPT,
  processTypeEnum,
  NODE_MODULES_REG,
  NODE_MODULES,
  PARSE_AST_TYPE,
  BUILD_TYPES
} from '../util/constants'
import {
  printLog,
  isEmptyObject,
  promoteRelativePath,
  isDifferentArray,
  generateQuickAppUx,
  uglifyJS
} from '../util'

import { parseComponentExportAst, parseAst } from './astProcess'
import { IComponentObj, IBuildResult } from './interface'
import {
  setHasBeenBuiltComponents,
  isComponentHasBeenBuilt,
  getBuildData,
  setComponentExportsMap,
  getComponentExportsMap,
  getRealComponentsPathList,
  copyFilesFromSrcToOutput,
  getDependencyTree,
  buildUsingComponents,
  getDepComponents,
  getImportTaroSelfComponents
} from './helper'
import { compileScriptFile, compileDepScripts } from './compileScript'
import { compileDepStyles } from './compileStyle'
import { transfromNativeComponents, processNativeWxml } from './native'

const notTaroComponents = new Set<string>()
const componentsNamedMap = new Map<string, { name?: string, type?: string }>()
const componentsBuildResult = new Map<string, IBuildResult>()

export function getComponentsNamedMap () {
  return componentsNamedMap
}

export function isFileToBeTaroComponent (
  code: string,
  sourcePath: string,
  outputPath: string
) {
  const {
    buildAdapter,
    sourceDir,
    constantsReplaceList,
    jsxAttributeNameReplace,
    alias
  } = getBuildData()
  const transformResult: IWxTransformResult = wxTransformer({
    code,
    sourcePath: sourcePath,
    sourceDir,
    outputPath: outputPath,
    isNormal: true,
    isTyped: REG_TYPESCRIPT.test(sourcePath),
    adapter: buildAdapter,
    env: constantsReplaceList,
    jsxAttributeNameReplace,
    alias
  })
  const { ast }: IWxTransformResult = transformResult
  let isTaroComponent = false

  traverse(ast, {
    ClassDeclaration (astPath) {
      astPath.traverse({
        ClassMethod (astPath) {
          if (astPath.get('key').isIdentifier({ name: 'render' })) {
            astPath.traverse({
              JSXElement () {
                isTaroComponent = true
              }
            })
          }
        }
      })
    },

    ClassExpression (astPath) {
      astPath.traverse({
        ClassMethod (astPath) {
          if (astPath.get('key').isIdentifier({ name: 'render' })) {
            astPath.traverse({
              JSXElement () {
                isTaroComponent = true
              }
            })
          }
        }
      })
    }
  })

  return {
    isTaroComponent,
    transformResult
  }
}

export interface IComponentBuildConfig {
  outputDir?: string,
  outputDirName?: string,
  npmSkip?: boolean
}

export function buildDepComponents (
  componentPathList: IComponentObj[],
  buildConfig?: IComponentBuildConfig
): Promise<IBuildResult[]> {
  return Promise.all(componentPathList.map(componentObj => buildSingleComponent(componentObj, buildConfig)))
}

export async function buildSingleComponent (
  componentObj: IComponentObj,
  buildConfig: IComponentBuildConfig = {}
): Promise<IBuildResult> {

  const {
    appPath,
    buildAdapter,
    constantsReplaceList,
    sourceDir,
    outputDir,
    sourceDirName,
    outputDirName,
    npmOutputDir,
    nodeModulesPath,
    outputFilesTypes,
    isProduction,
    jsxAttributeNameReplace,
    projectConfig,
    alias
  } = getBuildData()
  const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP

  if (componentObj.path) {
    componentsNamedMap.set(componentObj.path, {
      name: componentObj.name,
      type: componentObj.type
    })
  }
  const component = componentObj.path
  if (!component) {
    printLog(processTypeEnum.ERROR, '组件错误', `组件${_.upperFirst(_.camelCase(componentObj.name))}路径错误，请检查！（可能原因是导出的组件名不正确）`)
    return {
      js: '',
      wxss: '',
      wxml: ''
    }
  }
  let componentShowPath = component.replace(appPath + path.sep, '')
  componentShowPath = componentShowPath.split(path.sep).join('/')
  let isComponentFromNodeModules = false
  let sourceDirPath = sourceDir
  let buildOutputDir = outputDir
  // 来自 node_modules 的组件
  if (NODE_MODULES_REG.test(componentShowPath)) {
    isComponentFromNodeModules = true
    sourceDirPath = nodeModulesPath
    buildOutputDir = npmOutputDir
  }
  let outputComponentShowPath = componentShowPath.replace(isComponentFromNodeModules ? NODE_MODULES : sourceDirName, buildConfig.outputDirName || outputDirName)
  outputComponentShowPath = outputComponentShowPath.replace(path.extname(outputComponentShowPath), '')
  printLog(processTypeEnum.COMPILE, '组件文件', componentShowPath)
  const componentContent = fs.readFileSync(component).toString()
  const outputComponentJSPath = component.replace(sourceDirPath, buildConfig.outputDir || buildOutputDir).replace(path.extname(component), outputFilesTypes.SCRIPT)
  const outputComponentWXMLPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.TEMPL)
  const outputComponentWXSSPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.STYLE)
  const outputComponentJSONPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.CONFIG)

  try {
    const isTaroComponentRes = isFileToBeTaroComponent(componentContent, component, outputComponentJSPath)
    const componentExportsMap = getComponentExportsMap()
    if (!isTaroComponentRes.isTaroComponent) {
      const transformResult = isTaroComponentRes.transformResult
      const componentRealPath = parseComponentExportAst(transformResult.ast, componentObj.name as string, component, componentObj.type as string)
      const realComponentObj: IComponentObj = {
        path: componentRealPath,
        name: componentObj.name,
        type: componentObj.type
      }
      let isInMap = false
      notTaroComponents.add(component)
      if (componentExportsMap.size) {
        componentExportsMap.forEach(componentExports => {
          componentExports.forEach(item => {
            if (item.path === component) {
              isInMap = true
              item.path = componentRealPath
            }
          })
        })
      }
      if (!isInMap) {
        const componentExportsMapItem = componentExportsMap.get(component) || []
        componentExportsMapItem.push(realComponentObj)
        setComponentExportsMap(component, componentExportsMapItem)
      }
      return await buildSingleComponent(realComponentObj, buildConfig)
    }
    if (isComponentHasBeenBuilt(componentObj.path as string) && componentsBuildResult.get(componentObj.path as string)) {
      return componentsBuildResult.get(componentObj.path as string) as IBuildResult
    }
    const buildResult = {
      js: outputComponentJSPath,
      wxss: outputComponentWXSSPath,
      wxml: outputComponentWXMLPath
    }
    componentsBuildResult.set(component, buildResult)
    const transformResult: IWxTransformResult = wxTransformer({
      code: componentContent,
      sourcePath: component,
      sourceDir,
      outputPath: outputComponentJSPath,
      isRoot: false,
      isTyped: REG_TYPESCRIPT.test(component),
      isNormal: false,
      adapter: buildAdapter,
      env: constantsReplaceList,
      jsxAttributeNameReplace,
      alias
    })
    const componentWXMLContent = isProduction ? transformResult.compressedTemplate : transformResult.template
    const componentDepComponents = transformResult.components
    const res = parseAst(PARSE_AST_TYPE.COMPONENT, transformResult.ast, componentDepComponents, component, outputComponentJSPath, buildConfig.npmSkip)
    let resCode = res.code
    fs.ensureDirSync(path.dirname(outputComponentJSPath))
    if (!isComponentHasBeenBuilt(component)) {
      setHasBeenBuiltComponents(component)
    }
    // 解析原生组件
    const { usingComponents = {} }: IConfig = res.configObj
    if (usingComponents && !isEmptyObject(usingComponents)) {
      const keys = Object.keys(usingComponents)
      keys.forEach(item => {
        componentDepComponents.forEach(component => {
          if (_.camelCase(item) === _.camelCase(component.name)) {
            delete usingComponents[item]
          }
        })
      })
      transfromNativeComponents(outputComponentJSONPath.replace(buildConfig.outputDir || buildOutputDir, sourceDirPath), res.configObj)
    }
    let realComponentsPathList: IComponentObj[] = []
    realComponentsPathList = getRealComponentsPathList(component, componentDepComponents)

    if (!isQuickApp) {
      resCode = await compileScriptFile(resCode, component, outputComponentJSPath, buildAdapter)
      if (isProduction) {
        resCode = uglifyJS(resCode, component, appPath, projectConfig!.plugins!.uglify as TogglableOptions)
      }
    } else {
      // 快应用编译，搜集创建组件 ux 文件
      const importTaroSelfComponents = getImportTaroSelfComponents(outputComponentJSPath, res.taroSelfComponents)
      const importCustomComponents = new Set(realComponentsPathList.map(item => {
        return {
          path: path.relative(path.dirname(component), item.path as string).replace(path.extname(item.path as string), ''),
          name: item.name as string
        }
      }))
      let styleRelativePath
      if (res.styleFiles.length) {
        styleRelativePath = promoteRelativePath(path.relative(outputComponentJSPath, outputComponentWXSSPath))
      }
      const uxTxt = generateQuickAppUx({
        script: resCode,
        style: styleRelativePath,
        imports: new Set([...importTaroSelfComponents, ...importCustomComponents]),
        template: componentWXMLContent
      })
      fs.writeFileSync(outputComponentWXMLPath, uxTxt)
      printLog(processTypeEnum.GENERATE, '组件文件', `${outputDirName}/${componentObj.name}${outputFilesTypes.TEMPL}`)
    }

    const dependencyTree = getDependencyTree()
    const fileDep = dependencyTree.get(component) || {
      style: [],
      script: [],
      json: [],
      media: []
    }
    // 编译依赖的组件文件
    if (realComponentsPathList.length) {
      res.scriptFiles = res.scriptFiles.map(item => {
        for (let i = 0; i < realComponentsPathList.length; i++) {
          const componentObj = realComponentsPathList[i]
          const componentPath = componentObj.path
          if (item === componentPath) {
            return ''
          }
        }
        return item
      }).filter(item => item)
      realComponentsPathList = realComponentsPathList.filter(item => !isComponentHasBeenBuilt(item.path as string) || notTaroComponents.has(item.path as string))
      await buildDepComponents(realComponentsPathList)
    }
    if (componentExportsMap.size && realComponentsPathList.length) {
      realComponentsPathList.forEach(componentObj => {
        if (componentExportsMap.has(componentObj.path as string)) {
          const componentMap = componentExportsMap.get(componentObj.path as string)
          componentMap && componentMap.forEach(componentObj => {
            componentDepComponents.forEach(depComponent => {
              if (depComponent.name === componentObj.name) {
                let componentPath = componentObj.path
                let realPath
                if (NODE_MODULES_REG.test(componentPath as string)) {
                  componentPath = (componentPath as string).replace(nodeModulesPath, npmOutputDir)
                  realPath = promoteRelativePath(path.relative(outputComponentJSPath, componentPath))
                } else {
                  realPath = promoteRelativePath(path.relative(component, (componentPath as string)))
                }
                depComponent.path = realPath.replace(path.extname(realPath), '')
              }
            })
          })
        }
      })
    }
    if (!isQuickApp) {
      fs.writeFileSync(outputComponentJSONPath, JSON.stringify(_.merge({}, buildUsingComponents(component, componentDepComponents, true), res.configObj), null, 2))
      printLog(processTypeEnum.GENERATE, '组件配置', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.CONFIG}`)
      fs.writeFileSync(outputComponentJSPath, resCode)
      printLog(processTypeEnum.GENERATE, '组件逻辑', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.SCRIPT}`)
      fs.writeFileSync(outputComponentWXMLPath, componentWXMLContent)
      processNativeWxml(outputComponentWXMLPath.replace(outputDir, sourceDir), componentWXMLContent, outputComponentWXMLPath)
      printLog(processTypeEnum.GENERATE, '组件模板', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.TEMPL}`)
    }
    // 编译依赖的脚本文件
    if (isDifferentArray(fileDep['script'], res.scriptFiles)) {
      await compileDepScripts(res.scriptFiles, !isQuickApp)
    }
    const depComponents = getDepComponents()
    // 编译样式文件
    if (isDifferentArray(fileDep['style'], res.styleFiles) || isDifferentArray(depComponents.get(component) || [], componentDepComponents)) {
      printLog(processTypeEnum.GENERATE, '组件样式', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.STYLE}`)
      await compileDepStyles(outputComponentWXSSPath, res.styleFiles)
    }
    // 拷贝依赖文件
    if (isDifferentArray(fileDep['json'], res.jsonFiles)) {
      copyFilesFromSrcToOutput(res.jsonFiles)
    }
    if (isDifferentArray(fileDep['media'], res.mediaFiles)) {
      copyFilesFromSrcToOutput(res.mediaFiles)
    }
    fileDep['style'] = res.styleFiles
    fileDep['script'] = res.scriptFiles
    fileDep['json'] = res.jsonFiles
    fileDep['media'] = res.mediaFiles
    dependencyTree.set(component, fileDep)
    depComponents.set(component, componentDepComponents)

    return buildResult
  } catch (err) {
    printLog(processTypeEnum.ERROR, '组件编译', `组件${componentShowPath}编译失败！`)
    console.log(err)
    return {
      js: '',
      wxss: '',
      wxml: ''
    }
  }
}
