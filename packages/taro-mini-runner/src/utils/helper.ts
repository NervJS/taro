import * as path from 'path'
import {
  getInstalledNpmPkgPath,
  taroJsQuickAppComponents,
  removeHeadSlash,
  printLog,
  processTypeEnum
} from '@tarojs/helper'
import { Config } from '@tarojs/taro'

export function getTaroJsQuickAppComponentsPath (nodeModulesPath: string): string {
  const taroJsQuickAppComponentsPkg = getInstalledNpmPkgPath(taroJsQuickAppComponents, nodeModulesPath)
  if (!taroJsQuickAppComponentsPkg) {
    printLog(processTypeEnum.ERROR, '包安装', `缺少包 ${taroJsQuickAppComponents}，请安装！`)
    process.exit(0)
  }
  return path.join(path.dirname(taroJsQuickAppComponentsPkg as string), 'src/components')
}

export function generateQuickAppScriptContent (scriptContent: string) {
  return `let exportRes = { private: { root: { cn: [] } } };\n${scriptContent}\nexport default exportRes;`
}

export function generateQuickAppManifest ({
  appConfig,
  quickappJSON,
  pageConfigs,
  designWidth
}: {
  appConfig: Config,
  quickappJSON: Record<string, any>,
  pageConfigs: Record<string, Config>,
  designWidth: number
}) {
  // 生成 router
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
  Object.keys(pageConfigs).forEach((page) => {
    const item = pageConfigs[page]
    display.pages[removeHeadSlash(path.dirname(page))] = item
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
