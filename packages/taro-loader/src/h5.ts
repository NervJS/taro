import { readConfig } from '@tarojs/helper'
import { AppConfig } from '@tarojs/taro'
import { IH5Config } from '@tarojs/taro/types/compile'
import { getOptions, stringifyRequest } from 'loader-utils'
import { dirname, join, sep } from 'path'

import { REG_POST } from './constants'

import type * as webpack from 'webpack'

function genResource (path: string, pages: Map<string, string>, loaderContext: webpack.LoaderContext<any>, syncFileName: string | false = false) {
  const stringify = (s: string): string => stringifyRequest(loaderContext, s)
  const importDependent = syncFileName ? 'require' : 'import'
  return `Object.assign({
  path: '${path}',
  load: function(context, params) {
    const page = ${importDependent}(${stringify(join(loaderContext.context, syncFileName || path))})
    return [page, context, params]
  }
}, ${JSON.stringify(readConfig(pages.get(path.split(sep).join('/'))!))})`
}

export default function (this: webpack.LoaderContext<any>) {
  const options = getOptions(this)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const config: AppConfig & IH5Config = options.config
  const routerMode = config?.router?.mode || 'hash'
  const isBuildNativeComp = options.isBuildNativeComp
  const isMultiRouterMode = routerMode === 'multi'

  const pathDirname = dirname(this.resourcePath)
  const pageName = isMultiRouterMode ? join(pathDirname, options.filename).replace(options.sourceDir + sep, '') : ''
  const pages: Map<string, string> = new Map(options.pages)
  const pxTransformConfig = options.pxTransformConfig
  const runtimePath = Array.isArray(options.runtimePath) ? options.runtimePath : [options.runtimePath]
  let setReconcilerPost = ''
  const setReconciler = runtimePath.reduce((res, item) => {
    if (REG_POST.test(item)) {
      setReconcilerPost += `import '${item.replace(REG_POST, '')}'\n`
      return res
    } else {
      return res + `import '${item}'\n`
    }
  }, '')

  if (isBuildNativeComp) {
    const compPath = join(pathDirname, options.filename)
    return `import component from ${stringify(compPath)}
import { initPxTransform } from '@tarojs/taro'
${setReconcilerPost}
component.config = {}
component.pxTransformConfig = {}
Object.assign(component.config, ${JSON.stringify(readConfig(this.resourcePath))})
initPxTransform.call(component, {
  designWidth: ${pxTransformConfig.designWidth},
  deviceRatio: ${JSON.stringify(pxTransformConfig.deviceRatio)},
  baseFontSize: ${pxTransformConfig.baseFontSize || (pxTransformConfig.minRootSize >= 1 ? pxTransformConfig.minRootSize : 20)},
  unitPrecision: ${pxTransformConfig.unitPrecision},
  targetUnit: ${JSON.stringify(pxTransformConfig.targetUnit)}
})
export default component`
  }
  if (options.bootstrap) return `import(${stringify(join(options.sourceDir, `${isMultiRouterMode ? pageName : options.entryFileName}.boot`))})`

  let tabBarCode = `var tabbarIconPath = []
var tabbarSelectedIconPath = []
`
  if (config.tabBar) {
    const tabbarList = config.tabBar.list
    for (let i = 0; i < tabbarList.length; i++) {
      const t = tabbarList[i]
      if (t.iconPath) {
        const iconPath = stringify(join(pathDirname, t.iconPath))
        tabBarCode += `tabbarIconPath[${i}] = typeof require(${iconPath}) === 'object' ? require(${iconPath}).default : require(${iconPath})\n`
      }
      if (t.selectedIconPath) {
        const iconPath = stringify(join(pathDirname, t.selectedIconPath))
        tabBarCode += `tabbarSelectedIconPath[${i}] = typeof require(${iconPath}) === 'object' ? require(${iconPath}).default : require(${iconPath})\n`
      }
    }
  }

  const routesConfig = isMultiRouterMode ? `config.routes = []
config.route = ${genResource(pageName, pages, this, options.filename)}
config.pageName = "${pageName}"` : `config.routes = [
  ${config.pages?.map(path => genResource(path, pages, this)).join(',')}
]`
  const routerCreator = isMultiRouterMode ? 'createMultiRouter' : 'createRouter'

  const code = `${setReconciler}
import { initPxTransform } from '@tarojs/taro'
import { ${routerCreator} } from '@tarojs/router'
import component from ${stringify(join(options.sourceDir, options.entryFileName))}
import { window } from '@tarojs/runtime'
import { ${options.loaderMeta.creator} } from '${options.loaderMeta.creatorLocation}'
${options.loaderMeta.importFrameworkStatement}
${options.loaderMeta.extraImportForWeb}
${setReconcilerPost}
var config = ${JSON.stringify(config)}
window.__taroAppConfig = config
${config.tabBar ? tabBarCode : ''}
if (config.tabBar) {
  var tabbarList = config.tabBar.list
  for (var i = 0; i < tabbarList.length; i++) {
    var t = tabbarList[i]
    if (t.iconPath) {
      t.iconPath = tabbarIconPath[i]
    }
    if (t.selectedIconPath) {
      t.selectedIconPath = tabbarSelectedIconPath[i]
    }
  }
}
${routesConfig}
${options.loaderMeta.execBeforeCreateWebApp || ''}
var inst = ${options.loaderMeta.creator}(component, ${options.loaderMeta.frameworkArgs})
${routerCreator}(inst, config, ${options.loaderMeta.importFrameworkName})
initPxTransform({
  designWidth: ${pxTransformConfig.designWidth},
  deviceRatio: ${JSON.stringify(pxTransformConfig.deviceRatio)},
  baseFontSize: ${pxTransformConfig.baseFontSize || (pxTransformConfig.minRootSize >= 1 ? pxTransformConfig.minRootSize : 20)},
  unitPrecision: ${pxTransformConfig.unitPrecision},
  targetUnit: ${JSON.stringify(pxTransformConfig.targetUnit)}
})
`
  return code
}
