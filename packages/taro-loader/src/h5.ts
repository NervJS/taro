import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import { AppConfig } from '@tarojs/taro'
import { join, dirname } from 'path'
import { frameworkMeta } from './utils'

function genResource (path: string, pages: Map<string, string>, loaderContext: webpack.loader.LoaderContext) {
  const stringify = (s: string): string => stringifyRequest(loaderContext, s)
  return `
  Object.assign({
      path: '${path}',
      load: function() {
          return import(${stringify(join(loaderContext.context, path))})
      }
  }, require(${stringify(pages.get(path)!)}).default || {}),
`
}

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const {
    importFrameworkStatement,
    frameworkArgs,
    creator,
    importFrameworkName,
    extraImportForWeb,
    execBeforeCreateWebApp
  } = frameworkMeta[options.framework]
  const config: AppConfig = options.config
  const pages: Map<string, string> = options.pages
  let tabBarCode = `var tabbarIconPath = []
var tabbarSelectedIconPath = []
`
  if (config.tabBar) {
    const tabbarList = config.tabBar.list
    for (let i = 0; i < tabbarList.length; i++) {
      const t = tabbarList[i]
      if (t.iconPath) {
        tabBarCode += `tabbarIconPath[${i}] = require(${stringify(join(dirname(this.resourcePath), t.iconPath))}).default\n`
      }
      if (t.selectedIconPath) {
        tabBarCode += `tabbarSelectedIconPath[${i}] = require(${stringify(join(dirname(this.resourcePath), t.selectedIconPath))}).default\n`
      }
    }
  }

  const webComponents = `applyPolyfills().then(function () {
  defineCustomElements(window)
})
`

  const code = `import { createRouter } from '@tarojs/taro'
import component from ${stringify(join(dirname(this.resourcePath), options.filename))}
import { ${creator}, window } from '@tarojs/runtime'
import { defineCustomElements, applyPolyfills } from '@tarojs/components/loader'
${importFrameworkStatement}
import '@tarojs/components/dist/taro-components/taro-components.css'
${extraImportForWeb || ''}
${webComponents}
var config = ${JSON.stringify(config)}
window.__taroAppConfig = config
${config.tabBar ? tabBarCode : ''}
if (config.tabBar) {
  var tabbarList = config.tabBar.list
  for (let i = 0; i < tabbarList.length; i++) {
    var t = tabbarList[i]
    if (t.iconPath) {
      t.iconPath = tabbarIconPath[i]
    }
    if (t.selectedIconPath) {
      t.selectedIconPath = tabbarSelectedIconPath[i]
    }
  }
}
config.routes = [
  ${config.pages?.map(path => genResource(path, pages, this)).join('')}
]
${execBeforeCreateWebApp || ''}
var inst = ${creator}(component, ${frameworkArgs})
createRouter(inst, config, ${importFrameworkName})
`

  return code
}
