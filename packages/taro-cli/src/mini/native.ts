import * as fs from 'fs-extra'
import * as path from 'path'

import { Config as IConfig } from '@tarojs/taro'
import chalk from 'chalk'

import { REG_WXML_IMPORT, processTypeEnum, taroJsFramework, BUILD_TYPES, REG_SCRIPT, REG_STYLE, REG_UX, NODE_MODULES_REG } from '../util/constants'
import { isEmptyObject, printLog, resolveScriptPath, copyFileSync, extnameExpRegOf, resolveQuickappFilePath, processUxContent } from '../util'
import CONFIG from '../config';

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

function transformNativeQuickappComponent (configFile, componentPath) {
  const { sourceDir, outputDir } = getBuildData()

  let componentUxPath = resolveQuickappFilePath(path.resolve(path.dirname(configFile), componentPath))
  if (!fs.existsSync(componentUxPath)) {
    componentUxPath = resolveQuickappFilePath(path.join(sourceDir, componentPath))
  }
  if (!fs.existsSync(componentUxPath)) {
    return printLog(processTypeEnum.ERROR, '编译错误', `原生组件文件 ${componentUxPath} 不存在！`)
  }
  let componentStr = fs.readFileSync(componentUxPath).toString()
  componentStr = processUxContent(componentStr, value => {
    value = value.replace(/\'?\"?/ig, '')
    if (REG_SCRIPT.test(value) || REG_STYLE.test(value)) {
      const filePath = path.resolve(componentUxPath, '..', value)
      const outputFilePath = filePath.replace(sourceDir, outputDir)
      copyFileSync(filePath, outputFilePath)
    } else if (REG_UX.test(value)) {
      const importComponentPath = path.resolve(componentUxPath, '..', value)
      transformNativeQuickappComponent(configFile, importComponentPath)
    }
    return value
  })
  const outputComponentUxPath = componentUxPath.replace(sourceDir, outputDir)
  copyFileSync(componentUxPath, outputComponentUxPath)
}

export function transfromNativeComponents (configFile: string, componentConfig: IConfig) {
  const { sourceDir, outputDir, outputFilesTypes, buildAdapter } = getBuildData()
  const usingComponents = componentConfig.usingComponents
  if (usingComponents && !isEmptyObject(usingComponents)) {
    if (buildAdapter === BUILD_TYPES.QUICKAPP) {
      Object.keys(usingComponents).map(async item => {
        const componentPath = usingComponents[item]
        transformNativeQuickappComponent(configFile, componentPath)
      })
    } else {
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
        const componentJSONPath = componentJSPath.replace(extnameExpRegOf(componentJSPath), outputFilesTypes.CONFIG)
        const componentWXMLPath = componentJSPath.replace(extnameExpRegOf(componentJSPath), outputFilesTypes.TEMPL)
        const componentWXSSPath = componentJSPath.replace(extnameExpRegOf(componentJSPath), outputFilesTypes.STYLE)
        let outputComponentJSPath = '';
        if (NODE_MODULES_REG.test(outputComponentJSPath)) {
          outputComponentJSPath = componentJSPath.replace(NODE_MODULES_REG, path.resolve(outputDir, CONFIG.NPM_DIR)).replace(extnameExpRegOf(componentJSPath), outputFilesTypes.SCRIPT)
        } else {
          outputComponentJSPath = componentJSPath.replace(sourceDir, outputDir).replace(extnameExpRegOf(componentJSPath), outputFilesTypes.SCRIPT)
        }
        if (fs.existsSync(componentJSPath)) {
          const componentJSContent = fs.readFileSync(componentJSPath).toString()
          if (componentJSContent.indexOf(taroJsFramework) >= 0 && !fs.existsSync(componentWXMLPath)) {
            const buildDepComponentsRes = await buildDepComponents([{ path: componentJSPath, name: item, type: 'default' }])
            return buildDepComponentsRes
          }
          await Promise.all(compileDepScripts([componentJSPath], true))
        } else {
          return printLog(processTypeEnum.ERROR, '编译错误', `原生组件文件 ${componentJSPath} 不存在！`)
        }
        if (fs.existsSync(componentWXMLPath)) {
          const outputComponentWXMLPath = outputComponentJSPath.replace(extnameExpRegOf(outputComponentJSPath), outputFilesTypes.TEMPL)
          processNativeWxml(componentWXMLPath, null, outputComponentWXMLPath)
        }
        if (fs.existsSync(componentWXSSPath)) {
          const outputComponentWXSSPath = outputComponentJSPath.replace(extnameExpRegOf(outputComponentJSPath), outputFilesTypes.STYLE)
          await compileDepStyles(outputComponentWXSSPath, [componentWXSSPath])
        }
        if (fs.existsSync(componentJSONPath)) {
          const componentJSON = require(componentJSONPath)
          const outputComponentJSONPath = outputComponentJSPath.replace(extnameExpRegOf(outputComponentJSPath), outputFilesTypes.CONFIG)
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
}
