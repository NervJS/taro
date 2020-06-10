import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import { AppConfig, PageConfig } from '@tencent/tarojs-taro'
import { join, dirname } from 'path'
import { importFramework, getFrameworkArgs } from './utils'

function genResource (path: string, pages: Map<string, PageConfig>, loaderContext: webpack.loader.LoaderContext) {
  const stringify = (s: string): string => stringifyRequest(loaderContext, s)
  return `
  Object.assign({
      path: '${path}',
      load: function() {
          return import(${stringify(join(loaderContext.context, path))})
      }
  }, ${JSON.stringify(pages.get(path))} || {}),
`
}

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const config: AppConfig = options.config
  const pages: Map<string, PageConfig> = options.pages
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
  const vue = `
import '@tarojs/components/h5/vue'
`

  const code = `import Taro from '@tencent/tarojs-taro'
import component from ${stringify(join(dirname(this.resourcePath), options.filename))}
import { window } from '@tencent/tarojs-runtime'
import { defineCustomElements, applyPolyfills } from '@tarojs/components/loader'
${importFramework(options.framework)}
import '@tarojs/components/dist/taro-components/taro-components.css'
${options.framework === 'vue' ? vue : ''}
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
Taro.createRouter(component, config, '${options.framework}', ${getFrameworkArgs(options.framework)})
`

  return code
}
