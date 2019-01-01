import * as fs from 'fs-extra'
import * as path from 'path'

import { Config as IConfig } from '@tarojs/taro'
import * as wxTransformer from '@tarojs/transformer-wx'
import * as _ from 'lodash'

import {
  REG_TYPESCRIPT,
  processTypeEnum
} from '../util/constants'
import {
  resolveScriptPath,
  printLog,
  isEmptyObject,
  promoteRelativePath,
  isDifferentArray
} from '../util'
import { IWxTransformResult } from '../util/types'

import { IComponentObj } from './interface'
import { PARSE_AST_TYPE, NODE_MODULES_REG, taroJsFramework } from './constants'
import { copyFileSync } from './copy'
import {
  getBuildData,
  getRealComponentsPathList,
  buildUsingComponents,
  uglifyJS,
  copyFilesFromSrcToOutput,
  getDependencyTree,
  getComponentExportsMap,
  getDepComponents
} from './helper'
import { compileDepScripts, compileScriptFile } from './compileScript'
import { compileDepStyles } from './compileStyle'
import { transfromNativeComponents, processNativeWxml } from './native'
import { buildDepComponents } from './component'
import { parseAst } from './astProcess'

// 小程序页面编译
export async function buildSinglePage (page: string) {
  const {
    buildAdapter,
    constantsReplaceList,
    outputDir,
    sourceDirName,
    outputDirName,
    sourceDir,
    isProduction,
    outputFilesTypes,
    nodeModulesPath,
    npmOutputDir
  } = getBuildData()
  const pagePath = path.join(sourceDir, `${page}`)
  const pageJs = resolveScriptPath(pagePath)
  const dependencyTree = getDependencyTree()
  const depComponents = getDepComponents()

  printLog(processTypeEnum.COMPILE, '页面文件', `${sourceDirName}/${page}`)
  if (!fs.existsSync(pageJs)) {
    printLog(processTypeEnum.ERROR, '页面文件', `${sourceDirName}/${page} 不存在！`)
    return
  }
  const pageJsContent = fs.readFileSync(pageJs).toString()
  const outputPageJSPath = pageJs.replace(sourceDir, outputDir).replace(path.extname(pageJs), outputFilesTypes.SCRIPT)
  const outputPagePath = path.dirname(outputPageJSPath)
  const outputPageJSONPath = outputPageJSPath.replace(path.extname(outputPageJSPath), outputFilesTypes.CONFIG)
  const outputPageWXMLPath = outputPageJSPath.replace(path.extname(outputPageJSPath), outputFilesTypes.TEMPL)
  const outputPageWXSSPath = outputPageJSPath.replace(path.extname(outputPageJSPath), outputFilesTypes.STYLE)
  // 判断是不是小程序原生代码页面
  const pageWXMLPath = pageJs.replace(path.extname(pageJs), outputFilesTypes.TEMPL)
  if (fs.existsSync(pageWXMLPath) && pageJsContent.indexOf(taroJsFramework) < 0) {
    const pageJSONPath = pageJs.replace(path.extname(pageJs), outputFilesTypes.CONFIG)
    const pageWXSSPath = pageJs.replace(path.extname(pageJs), outputFilesTypes.STYLE)
    if (fs.existsSync(pageJSONPath)) {
      const pageJSON = require(pageJSONPath)
      copyFileSync(pageJSONPath, outputPageJSONPath)
      transfromNativeComponents(pageJSONPath, pageJSON)
    }
    compileDepScripts([pageJs])
    copyFileSync(pageWXMLPath, outputPageWXMLPath)
    if (fs.existsSync(pageWXSSPath)) {
      await compileDepStyles(outputPageWXSSPath, [pageWXSSPath])
    }
    return
  }
  try {
    const transformResult: IWxTransformResult = wxTransformer({
      code: pageJsContent,
      sourcePath: pageJs,
      outputPath: outputPageJSPath,
      isRoot: true,
      isTyped: REG_TYPESCRIPT.test(pageJs),
      adapter: buildAdapter,
      env: constantsReplaceList
    })
    const pageDepComponents = transformResult.components
    const pageWXMLContent = isProduction ? transformResult.compressedTemplate : transformResult.template
    const res = parseAst(PARSE_AST_TYPE.PAGE, transformResult.ast, pageDepComponents, pageJs, outputPageJSPath)
    let resCode = res.code
    resCode = await compileScriptFile(resCode, pageJs, outputPageJSPath, buildAdapter)
    if (isProduction) {
      uglifyJS(resCode, pageJs)
    }
    fs.ensureDirSync(outputPagePath)
    const { usingComponents = {} }: IConfig = res.configObj
    if (usingComponents && !isEmptyObject(usingComponents)) {
      const keys = Object.keys(usingComponents)
      keys.forEach(item => {
        pageDepComponents.forEach(component => {
          if (_.camelCase(item) === _.camelCase(component.name)) {
            delete usingComponents[item]
          }
        })
      })
      transfromNativeComponents(outputPageJSONPath.replace(outputDir, sourceDir), res.configObj)
    }
    const fileDep = dependencyTree.get(pageJs) || {}
    // 编译依赖的组件文件
    let realComponentsPathList: IComponentObj[] = []
    if (pageDepComponents.length) {
      realComponentsPathList = getRealComponentsPathList(pageJs, pageDepComponents)
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
      await buildDepComponents(realComponentsPathList)
    }
    const componentExportsMap = getComponentExportsMap()
    if (!isEmptyObject(componentExportsMap) && realComponentsPathList.length) {
      const mapKeys = Object.keys(componentExportsMap)
      realComponentsPathList.forEach(component => {
        if (mapKeys.indexOf(component.path as string) >= 0) {
          const componentMap = componentExportsMap.get(component.path as string)
          componentMap && componentMap.forEach(component => {
            pageDepComponents.forEach(depComponent => {
              if (depComponent.name === component.name) {
                let componentPath = component.path
                let realPath
                if (NODE_MODULES_REG.test(componentPath as string)) {
                  componentPath = (componentPath as string).replace(nodeModulesPath, npmOutputDir)
                  realPath = promoteRelativePath(path.relative(outputPageJSPath, componentPath))
                } else {
                  realPath = promoteRelativePath(path.relative(pageJs, componentPath as string))
                }
                depComponent.path = realPath.replace(path.extname(realPath), '')
              }
            })
          })
        }
      })
    }
    fs.writeFileSync(outputPageJSONPath, JSON.stringify(_.merge({}, buildUsingComponents(pageJs, pageDepComponents), res.configObj), null, 2))
    printLog(processTypeEnum.GENERATE, '页面配置', `${outputDirName}/${page}${outputFilesTypes.CONFIG}`)
    fs.writeFileSync(outputPageJSPath, resCode)
    printLog(processTypeEnum.GENERATE, '页面逻辑', `${outputDirName}/${page}${outputFilesTypes.SCRIPT}`)
    fs.writeFileSync(outputPageWXMLPath, pageWXMLContent)
    processNativeWxml(outputPageWXMLPath.replace(outputDir, sourceDir), pageWXMLContent, outputPageWXMLPath)
    printLog(processTypeEnum.GENERATE, '页面模板', `${outputDirName}/${page}${outputFilesTypes.TEMPL}`)
    // 编译依赖的脚本文件
    if (isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (isDifferentArray(fileDep['style'], res.styleFiles) || isDifferentArray(depComponents.get(pageJs) || [], pageDepComponents)) {
      printLog(processTypeEnum.GENERATE, '页面样式', `${outputDirName}/${page}${outputFilesTypes.STYLE}`)
      await compileDepStyles(outputPageWXSSPath, res.styleFiles)
    }
    // 拷贝依赖文件
    if (isDifferentArray(fileDep['json'], res.jsonFiles)) {
      copyFilesFromSrcToOutput(res.jsonFiles)
    }
    if (isDifferentArray(fileDep['media'], res.mediaFiles)) {
      copyFilesFromSrcToOutput(res.mediaFiles)
    }
    depComponents.set(pageJs, pageDepComponents)
    fileDep['style'] = res.styleFiles
    fileDep['script'] = res.scriptFiles
    fileDep['json'] = res.jsonFiles
    fileDep['media'] = res.mediaFiles
    dependencyTree[pageJs] = fileDep
  } catch (err) {
    printLog(processTypeEnum.ERROR, '页面编译', `页面${pagePath}编译失败！`)
    console.log(err)
  }
}

export async function buildPages () {
  printLog(processTypeEnum.COMPILE, '所有页面')
  const { appConfig } = getBuildData()
  // 支持分包，解析子包页面
  const pages = appConfig.pages || []
  const subPackages = appConfig.subPackages || appConfig.subpackages
  if (subPackages && subPackages.length) {
    subPackages.forEach(item => {
      if (item.pages && item.pages.length) {
        const root = item.root
        item.pages.forEach(page => {
          let pagePath = `${root}/${page}`
          pagePath = pagePath.replace(/\/{2,}/g, '/')
          if (pages.indexOf(pagePath) < 0) {
            pages.push(pagePath)
          }
        })
      }
    })
  }
  const pagesPromises = pages.map(async page => {
    return buildSinglePage(page)
  })
  await Promise.all(pagesPromises)
}
