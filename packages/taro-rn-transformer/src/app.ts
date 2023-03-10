/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { isEmptyObject, readPageConfig } from '@tarojs/helper'
import * as fs from 'fs'
import { camelCase } from 'lodash'
import * as path from 'path'

import { AppConfig, TransformEntry } from './types/index'
import { getConfigContent, getConfigFilePath, parseBase64Image } from './utils'

function getPagesResource (appPath: string, basePath: string, pathPrefix: string) {
  const importPages: string[] = []
  const screenPages: string[] = []
  const importConfigs: string[] = []
  const pages = getAppPages(appPath)

  pages.forEach(item => {
    const pagePath = item.startsWith('/') ? item : `/${item}`
    const screenName = camelCase(pagePath)
    const importScreen = `import ${screenName} from '.${pathPrefix}${pagePath}'`
    importPages.push(importScreen)
    screenPages.push(pagePath)
    const configFile = getConfigFilePath(path.join(basePath, pagePath))
    const screenConfigName = `${screenName}Config`
    if (fs.existsSync(configFile)) {
      importConfigs.push(`import ${screenConfigName} from '.${pathPrefix}${pagePath}.config'`)
    } else {
      let result = {}
      try {
        result = readPageConfig(configFile)
      } catch (err) {} // eslint-disable-line no-empty
      importConfigs.push(`const ${screenConfigName} = ${JSON.stringify(result)}`)
    }
  })
  return {
    screenPages,
    importPages,
    importConfigs
  }
}

function getPageScreen (pagePath: string) {
  const screen = camelCase(pagePath)
  const screenConfigName = `${screen}Config`
  return `{name:'${screen}',pagePath:'${pagePath}',component:createPageConfig(${screen},{...${screenConfigName},pagePath:'${pagePath}'})}`
}

export function getAppConfig (appPath: string) {
  // 读取配置文件内容
  if (!appPath) {
    throw new Error('缺少 app 全局配置文件，请检查！')
  }
  const appConfig: AppConfig = getConfigContent(appPath)
  if (isEmptyObject(appConfig)) {
    throw new Error('缺少 app 全局配置，请检查！')
  }
  if (appConfig && (!appConfig.pages || !appConfig.pages.length)) {
    throw new Error('全局配置缺少 pages 字段，请检查！')
  }
  return appConfig
}

export function getAppPages (appPath: string) {
  const config = getAppConfig(appPath)
  const pages = config?.pages || []
  // 分包路由，也需要处理
  const subPackages = config.subPackages || config.subpackages || []
  subPackages.forEach(item => {
    const subRoot = item.root.endsWith('/') ? item.root : `${item.root}/`
    const subPages = item.pages
    subPages.forEach(itm => {
      pages.push(subRoot + itm)
    })
  })
  const res = pages.map(item => { return item.startsWith('/') ? item : `/${item}` })
  return res
}

function getFormatTabBar (appPath: string, projectRoot: string) {
  const config = getAppConfig(appPath)
  const tabbar = config?.tabBar || {}
  const tabList :any = []
  if (tabbar && tabbar.list && Array.isArray(tabbar.list)) {
    tabbar.list.forEach((item) => {
      if (item.iconPath && !item.iconPath.startsWith('data:imag') && !(/^http|https/).test(item.iconPath)) {
        item.iconPath = parseBase64Image(item.iconPath, projectRoot)
      }
      if (item.selectedIconPath && !item.selectedIconPath.startsWith('data:imag') && !(/^http|https/).test(item.selectedIconPath)) {
        item.selectedIconPath = parseBase64Image(item.selectedIconPath, projectRoot)
      }
      tabList.push(item)
    })
  }
  tabbar.list = tabList
  return tabbar
}

export default function generateEntry ({
  filename,
  projectRoot,
  sourceDir,
  appName,
  entryName,
  designWidth,
  deviceRatio
}: TransformEntry) {
  // 文件后缀
  const filePath = path.basename(filename).replace(path.extname(filename), '')
  const basePath = path.join(projectRoot, sourceDir)
  const appPath = path.join(projectRoot, sourceDir, entryName)

  const appConfig = {
    designWidth,
    deviceRatio
  }
  const pathPrefix = filePath.indexOf(sourceDir) > -1 ? '' : `/${sourceDir}`
  const pages = getPagesResource(appPath, basePath, pathPrefix)
  const importPageList = pages.importPages.join(';')
  const importPageConfig = pages.importConfigs.join(';')
  const routeList = pages.screenPages
  const appComponentPath = `./${sourceDir}/${entryName}`

  const appTabBar = getFormatTabBar(appPath, basePath)

  const code = `import 'react-native-gesture-handler'
  import { AppRegistry } from 'react-native'
  import { createReactNativeApp, createPageConfig } from '@tarojs/runtime-rn'
  import Component from '${appComponentPath}'
  ${importPageList}
  ${`import AppComponentConfig from '${appComponentPath}.config';`}
  ${importPageConfig}

  AppComponentConfig.tabBar = ${JSON.stringify(appTabBar)}

  const buildConfig = ${JSON.stringify(appConfig)}
  const config = { appConfig: { ...buildConfig, ...AppComponentConfig } }
  global.__taroAppConfig = config
  config['pageList'] = [${routeList.map(pageItem => getPageScreen(pageItem))}]
  AppRegistry.registerComponent('${appName}',() => createReactNativeApp(Component,config))
  `
  return code
}
