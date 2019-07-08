import * as fs from 'fs-extra'
import * as path from 'path'

import { Config as IConfig } from '@tarojs/taro'
import * as wxTransformer from '@tarojs/transformer-wx'
import * as _ from 'lodash'

import {
  REG_TYPESCRIPT,
  processTypeEnum,
  NODE_MODULES_REG,
  PARSE_AST_TYPE,
  taroJsFramework,
  BUILD_TYPES
} from '../util/constants'
import {
  resolveScriptPath,
  printLog,
  isEmptyObject,
  promoteRelativePath,
  isDifferentArray,
  copyFileSync,
  generateQuickAppUx,
  uglifyJS
} from '../util'
import { IWxTransformResult, TogglableOptions } from '../util/types'

import { IComponentObj } from './interface'
import {
  getBuildData,
  getRealComponentsPathList,
  buildUsingComponents,
  copyFilesFromSrcToOutput,
  getDependencyTree,
  getComponentExportsMap,
  getDepComponents,
  getImportTaroSelfComponents
} from './helper'
import { compileDepScripts, compileScriptFile } from './compileScript'
import { compileDepStyles } from './compileStyle'
import { transfromNativeComponents, processNativeWxml } from './native'
import { buildDepComponents } from './component'
import { parseAst } from './astProcess'

// 小程序页面编译
export async function buildSinglePage (page: string) {
  const {
    appPath,
    buildAdapter,
    constantsReplaceList,
    outputDir,
    sourceDirName,
    outputDirName,
    sourceDir,
    isProduction,
    outputFilesTypes,
    nodeModulesPath,
    npmOutputDir,
    jsxAttributeNameReplace,
    pageConfigs,
    appConfig,
    projectConfig,
    alias
  } = getBuildData()
  const pagePath = path.join(sourceDir, `${page}`)
  const pageJs = resolveScriptPath(pagePath)
  const dependencyTree = getDependencyTree()
  const depComponents = getDepComponents()
  const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP

  printLog(processTypeEnum.COMPILE, '页面文件', `${sourceDirName}/${page}`)
  if (!fs.existsSync(pageJs) || !fs.statSync(pageJs).isFile()) {
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
    await compileDepScripts([pageJs], true)
    copyFileSync(pageWXMLPath, outputPageWXMLPath)
    if (fs.existsSync(pageWXSSPath)) {
      await compileDepStyles(outputPageWXSSPath, [pageWXSSPath])
    }
    return
  }
  try {
    const rootProps: { [key: string]: any } = {}
    if (isQuickApp) {
      // 如果是快应用，需要提前解析一次 ast，获取 config
      const aheadTransformResult: IWxTransformResult = wxTransformer({
        code: pageJsContent,
        sourcePath: pageJs,
        sourceDir,
        outputPath: outputPageJSPath,
        isRoot: true,
        isTyped: REG_TYPESCRIPT.test(pageJs),
        adapter: buildAdapter,
        env: constantsReplaceList,
        alias
      })
      const res = parseAst(PARSE_AST_TYPE.PAGE, aheadTransformResult.ast, [], pageJs, outputPageJSPath)
      if (res.configObj.enablePullDownRefresh || (appConfig.window && appConfig.window.enablePullDownRefresh)) {
        rootProps.enablePullDownRefresh = true
      }
      if (appConfig.tabBar) {
        rootProps.tabBar = appConfig.tabBar
      }
      rootProps.pagePath = /^\//.test(page) ? page : `/${page}`
      if (res.hasEnablePageScroll) {
        rootProps.enablePageScroll = true
      }
    }
    const transformResult: IWxTransformResult = wxTransformer({
      code: pageJsContent,
      sourcePath: pageJs,
      sourceDir,
      outputPath: outputPageJSPath,
      isRoot: true,
      isTyped: REG_TYPESCRIPT.test(pageJs),
      adapter: buildAdapter,
      env: constantsReplaceList,
      rootProps,
      jsxAttributeNameReplace,
      alias
    })
    const pageDepComponents = transformResult.components
    const pageWXMLContent = isProduction ? transformResult.compressedTemplate : transformResult.template
    const res = parseAst(PARSE_AST_TYPE.PAGE, transformResult.ast, pageDepComponents, pageJs, outputPageJSPath)
    let resCode = res.code
    fs.ensureDirSync(outputPagePath)
    pageConfigs.set(page, res.configObj)
    // 解析原生组件
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

    let realComponentsPathList: IComponentObj[] = []
    realComponentsPathList = getRealComponentsPathList(pageJs, pageDepComponents)

    if (!isQuickApp) {
      resCode = await compileScriptFile(resCode, pageJs, outputPageJSPath, buildAdapter)
      if (isProduction) {
        resCode = uglifyJS(resCode, pageJs, appPath, projectConfig!.plugins!.uglify as TogglableOptions)
      }
    } else {
      // 快应用编译，搜集创建页面 ux 文件
      const importTaroSelfComponents = getImportTaroSelfComponents(outputPageJSPath, res.taroSelfComponents)
      const importCustomComponents = new Set(realComponentsPathList.map(item => {
        return {
          path: path.relative(path.dirname(pageJs), item.path as string).replace(path.extname(item.path as string), ''),
          name: item.name as string
        }
      }))
      // 生成页面 ux 文件
      let styleRelativePath
      if (res.styleFiles.length) {
        styleRelativePath = promoteRelativePath(path.relative(outputPageJSPath, outputPageWXSSPath))
      }
      const uxTxt = generateQuickAppUx({
        script: resCode,
        style: styleRelativePath,
        imports: new Set([...importTaroSelfComponents, ...importCustomComponents]),
        template: pageWXMLContent
      })
      fs.writeFileSync(outputPageWXMLPath, uxTxt)
      printLog(processTypeEnum.GENERATE, '页面文件', `${outputDirName}/${page}${outputFilesTypes.TEMPL}`)
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
      await buildDepComponents(realComponentsPathList)
    }
    const componentExportsMap = getComponentExportsMap()
    if (componentExportsMap.size && realComponentsPathList.length) {
      realComponentsPathList.forEach(component => {
        if (componentExportsMap.has(component.path as string)) {
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
    const fileDep = dependencyTree.get(pageJs) || {
      style: [],
      script: [],
      json: [],
      media: []
    }
    if (!isQuickApp) {
      fs.writeFileSync(outputPageJSONPath, JSON.stringify(_.merge({}, buildUsingComponents(pageJs, pageDepComponents), res.configObj), null, 2))
      printLog(processTypeEnum.GENERATE, '页面配置', `${outputDirName}/${page}${outputFilesTypes.CONFIG}`)
      fs.writeFileSync(outputPageJSPath, resCode)
      printLog(processTypeEnum.GENERATE, '页面逻辑', `${outputDirName}/${page}${outputFilesTypes.SCRIPT}`)
      fs.writeFileSync(outputPageWXMLPath, pageWXMLContent)
      processNativeWxml(outputPageWXMLPath.replace(outputDir, sourceDir), pageWXMLContent, outputPageWXMLPath)
      printLog(processTypeEnum.GENERATE, '页面模板', `${outputDirName}/${page}${outputFilesTypes.TEMPL}`)
    }
    // 编译依赖的脚本文件
    if (isDifferentArray(fileDep['script'], res.scriptFiles)) {
      await compileDepScripts(res.scriptFiles, !isQuickApp)
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
    dependencyTree.set(pageJs, fileDep)
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
  const subPackages = appConfig.subPackages || appConfig['subpackages']
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
