import * as fs from 'fs-extra'
import * as path from 'path'

import { Config as IConfig } from '@tarojs/taro'
import chalk from 'chalk'

import { REG_WXML_IMPORT, processTypeEnum, taroJsFramework } from '../util/constants'
import { isEmptyObject, printLog, resolveScriptPath, copyFileSync } from '../util'

import { buildDepComponents } from './component'
import { compileDepScripts } from './compileScript'
import { compileDepStyles } from './compileStyle'
import { getBuildData } from './helper'

export function processNativeWxml (
  componentWXMLPath: string,
  componentWXMLContent: string | null,
  outputComponentWXMLPath: string
) {
  let wxmlContent
  let needCopy = true
  const { sourceDir, outputDir } = getBuildData()
  if (componentWXMLPath && fs.existsSync(componentWXMLPath)) {
    wxmlContent = fs.readFileSync(componentWXMLPath).toString()
  } else {
    needCopy = false
    wxmlContent = componentWXMLContent
  }
  const importWxmlPathList: string[] = []
  let regResult
  while ((regResult = REG_WXML_IMPORT.exec(wxmlContent)) != null) {
    importWxmlPathList.push(regResult[2] || regResult[3])
  }
  if (importWxmlPathList.length) {
    importWxmlPathList.forEach(item => {
      const itemPath = path.resolve(componentWXMLPath, '..', item)
      if (fs.existsSync(itemPath)) {
        const outputItemPath = itemPath.replace(sourceDir, outputDir)
        processNativeWxml(itemPath, null, outputItemPath)
      }
    })
  }
  if (componentWXMLPath === outputComponentWXMLPath || !needCopy) {
    return
  }
  copyFileSync(componentWXMLPath, outputComponentWXMLPath)
}

export function transfromNativeComponents (configFile: string, componentConfig: IConfig) {
  const { sourceDir, outputDir, outputFilesTypes } = getBuildData()
  const usingComponents = componentConfig.usingComponents
  if (usingComponents && !isEmptyObject(usingComponents)) {
    Object.keys(usingComponents).map(async item => {
      const componentPath = usingComponents[item]
      if (/^plugin:\/\//.test(componentPath)) {
        // 小程序 plugin
        printLog(processTypeEnum.REFERENCE, '插件引用', `使用了插件 ${chalk.bold(componentPath)}`)
        return
      }
      let componentJSPath = resolveScriptPath(path.resolve(path.dirname(configFile), componentPath))
      if (!fs.existsSync(componentJSPath)) {
        componentJSPath = resolveScriptPath(path.join(sourceDir, componentPath))
      }
      const componentJSONPath = componentJSPath.replace(path.extname(componentJSPath), outputFilesTypes.CONFIG)
      const componentWXMLPath = componentJSPath.replace(path.extname(componentJSPath), outputFilesTypes.TEMPL)
      const componentWXSSPath = componentJSPath.replace(path.extname(componentJSPath), outputFilesTypes.STYLE)
      const outputComponentJSPath = componentJSPath.replace(sourceDir, outputDir).replace(path.extname(componentJSPath), outputFilesTypes.SCRIPT)
      if (fs.existsSync(componentJSPath)) {
        const componentJSContent = fs.readFileSync(componentJSPath).toString()
        if (componentJSContent.indexOf(taroJsFramework) >= 0 && !fs.existsSync(componentWXMLPath)) {
          const buildDepComponentsRes = await buildDepComponents([{ path: componentJSPath, name: item, type: 'default'}])
          return buildDepComponentsRes
        }
        await compileDepScripts([componentJSPath], true)
      } else {
        return printLog(processTypeEnum.ERROR, '编译错误', `原生组件文件 ${componentJSPath} 不存在！`)
      }
      if (fs.existsSync(componentWXMLPath)) {
        const outputComponentWXMLPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.TEMPL)
        processNativeWxml(componentWXMLPath, null, outputComponentWXMLPath)
      }
      if (fs.existsSync(componentWXSSPath)) {
        const outputComponentWXSSPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.STYLE)
        await compileDepStyles(outputComponentWXSSPath, [componentWXSSPath])
      }
      if (fs.existsSync(componentJSONPath)) {
        const componentJSON = require(componentJSONPath)
        const outputComponentJSONPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.CONFIG)
        copyFileSync(componentJSONPath, outputComponentJSONPath)

        // 解决组件循环依赖不断编译爆栈的问题
        if (componentJSON && componentJSON.usingComponents) {
          Object.keys(componentJSON.usingComponents).forEach(key => {
            if (key === item) {
              delete componentJSON.usingComponents[key]
            }
          })
        }

        transfromNativeComponents(componentJSONPath, componentJSON)
      }
    })
  }
}
