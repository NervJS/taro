import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'
import { AppConfig, PageConfig } from '@tarojs/taro'
import { join, dirname } from 'path'

function genResource (path: string, pages: Map<string, PageConfig>, { context }: webpack.loader.LoaderContext) {
  return `
  Object.assign({
      path: '${path}',
      load: () => {
          return import('${join(context, path)}')
      }
  }, ${JSON.stringify(pages.get(path))} || {}),
`
}

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const config: AppConfig = options.config
  const pages: Map<string, PageConfig> = options.pages
  let tabBarCode = `const tabbarIconPath = []
const tabbarSelectedIconPath = []
`
  if (config.tabBar) {
    const tabbarList = config.tabBar.list
    for (let i = 0; i < tabbarList.length; i++) {
      const t = tabbarList[i]
      if (t.iconPath) {
        tabBarCode += `tabbarIconPath[${i}] = require('${join(dirname(this.resourcePath), t.iconPath)}').default\n`
      }
      if (t.selectedIconPath) {
        tabBarCode += `tabbarSelectedIconPath[${i}] = require('${join(dirname(this.resourcePath), t.selectedIconPath)}').default\n`
      }
    }
  }

  const webComponents = `applyPolyfills().then(() => {
  defineCustomElements(window)
})
`
  const vue = `
import '@tarojs/components/h5/vue'
`

  const code = `import Taro from '@tarojs/taro'
import component from '${join(dirname(this.resourcePath), options.filename)}'
import { defineCustomElements, applyPolyfills } from '@tarojs/components/loader'
import '@tarojs/components/dist/taro-components/taro-components.css'
${options.framework === 'vue' ? vue : ''}
${webComponents}
const config = ${JSON.stringify(config)}
${config.tabBar ? tabBarCode : ''}
if (config.tabBar) {
  const tabbarList = config.tabBar.list
  for (let i = 0; i < tabbarList.length; i++) {
    const t = tabbarList[i]
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
Taro.createRouter(component, config, '${options.framework}')
`

  return code
}
