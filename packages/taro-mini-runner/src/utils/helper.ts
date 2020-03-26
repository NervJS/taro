import * as path from 'path'
import * as _ from 'lodash'

import {
  getInstalledNpmPkgPath,
  promoteRelativePath,
  printLog,
  taroJsQuickAppComponents,
  REG_STYLE,
  REG_SCRIPT,
  PARSE_AST_TYPE,
  processTypeEnum
} from '@tarojs/helper'

import { removeHeadSlash } from '.'

export function getTaroJsQuickAppComponentsPath (nodeModulesPath: string): string {
  const taroJsQuickAppComponentsPkg = getInstalledNpmPkgPath(taroJsQuickAppComponents, nodeModulesPath)
  if (!taroJsQuickAppComponentsPkg) {
    printLog(processTypeEnum.ERROR, '包安装', `缺少包 ${taroJsQuickAppComponents}，请安装！`)
    process.exit(0)
  }
  return path.join(path.dirname(taroJsQuickAppComponentsPkg as string), 'src/components')
}

export function getImportTaroSelfComponents (filePath, nodeModulesPath, outputDir, taroSelfComponents) {
  const importTaroSelfComponents = new Set<{ path: string, name: string }>()
  const taroJsQuickAppComponentsPath = getTaroJsQuickAppComponentsPath(nodeModulesPath)
  taroSelfComponents.forEach(c => {
    const cPath = path.join(taroJsQuickAppComponentsPath, c)
    const cMainPath = path.join(cPath, 'index')
    const cRelativePath = promoteRelativePath(path.relative(filePath, cMainPath.replace(nodeModulesPath, path.join(outputDir, 'npm'))))
    importTaroSelfComponents.add({
      path: cRelativePath,
      name: c
    })
  })
  return importTaroSelfComponents
}

export function getImportCustomComponents (sourceFilePath, depComponents) {
  const importCustomComponents = new Set()
  depComponents.forEach(item => {
    const extnamePath = item.path.replace(path.extname(item.path), '')
    const cRelativePath = promoteRelativePath(path.relative(sourceFilePath, extnamePath)).replace(/\\/g, '/')
    importCustomComponents.add({
      path: cRelativePath,
      name: item.name
    })
  })
  return importCustomComponents
}

export function generateQuickAppUx ({
  script,
  template,
  style,
  imports
}: {
  script?: string,
  template?: string,
  style?: string,
  imports?: Set<{
    path: string,
    name: string
  }>
}) {
  let uxTxt = ''
  if (imports && imports.size) {
    imports.forEach(item => {
      uxTxt += `<import src='${item.path}' name='${item.name}'></import>\n`
    })
  }
  if (style) {
    if (REG_STYLE.test(style)) {
      uxTxt += `<style src="${style}"></style>\n`
    } else {
      uxTxt += `<style>\n${style}\n</style>\n`
    }
  }
  if (template) {
    uxTxt += `<template>\n${template}\n</template>\n`
  }
  if (script) {
    if (REG_SCRIPT.test(script)) {
      uxTxt += `<script src="${script}"></script>\n`
    } else {
      uxTxt += `<script>\n${script}\n</script>\n`
    }
  }
  return uxTxt
}

export function generateQuickAppManifest ({
  sourceDir,
  taroFileTypeMap,
  quickappJSON,
  designWidth
}) {
  // 生成 router
  let appConfig = Object.keys(taroFileTypeMap).map(key => {
    if (taroFileTypeMap[key].type === PARSE_AST_TYPE.ENTRY) {
      return taroFileTypeMap[key].config
    }
  }).filter(item => item)[0]
  const pages = (appConfig.pages as string[]).concat()
  const routerPages = {}
  const customPageConfig = quickappJSON.customPageConfig || {}

  pages.forEach(element => {
    const customConfig = customPageConfig[element]
    const pageConf: any = {
      component: path.basename(element)
    }
    if (customConfig) {
      const filter = customConfig.filter
      const launchMode = customConfig.launchMode
      if (filter) {
        pageConf.filter = filter
      }
      if (launchMode) {
        pageConf.launchMode = launchMode
      }
    }
    routerPages[removeHeadSlash(path.dirname(element))] = pageConf
  })
  delete quickappJSON.customPageConfig
  const routerEntry = pages.shift()
  const router = {
    entry: removeHeadSlash(path.dirname(routerEntry as string)),
    pages: routerPages
  }
  // 生成 display
  const display = JSON.parse(JSON.stringify(appConfig.window || {}))
  display.pages = {}
  Object.keys(taroFileTypeMap).forEach(key => {
    if (taroFileTypeMap[key].type === PARSE_AST_TYPE.PAGE) {
      const page = removeHeadSlash(path.dirname(key).replace(sourceDir, '').replace(path.extname(key), ''))
      display.pages[page] = taroFileTypeMap[key].config || {}
    }
  })
  quickappJSON.router = router
  quickappJSON.display = display
  quickappJSON.config = Object.assign({}, quickappJSON.config, {
    designWidth: designWidth || 750
  })
  if (appConfig.window && appConfig.window.navigationStyle === 'custom') {
    quickappJSON.display.titleBar = false
    delete quickappJSON.display.navigationStyle
  }
  return quickappJSON
}
