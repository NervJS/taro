import * as path from 'path'
import * as fs from 'fs'
import { camelCase } from 'lodash'
import { isEmptyObject } from '@tarojs/helper'
import { getConfigContent, getConfigFilePath } from './utils'
import { TransformEntry, AppConfig } from './types/index'

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
      importConfigs.push(`const ${screenConfigName} = {}`)
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

function getAppConfig (appPath: string) {
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

  const code = `import 'react-native/Libraries/polyfills/error-guard'
  import { AppRegistry } from 'react-native'
  import { createReactNativeApp, createPageConfig } from '@tarojs/runtime-rn'
  import Component from '${appComponentPath}'
  ${importPageList}
  ${`import AppComponentConfig from '${appComponentPath}.config';`}
  ${importPageConfig}

  const buildConfig = ${JSON.stringify(appConfig)}
  const config = { appConfig: { ...buildConfig, ...AppComponentConfig } }
  global.__taroAppConfig = config
  config['pageList'] = [${routeList.map(pageItem => getPageScreen(pageItem))}]
  AppRegistry.registerComponent('${appName}',() => createReactNativeApp(Component,config))
  `
  return code
}
