import { getDefaultPostcssConfig } from '../postcss/postcss.h5'
import { appendVirtualModulePrefix } from '../utils'

import type { PluginOption } from 'vite'
import type { PageMeta } from '../utils/compiler/base'

const ENTRY_SUFFIX = '?entry-loader=true'

function genResource (page: PageMeta) {
  return [
    'Object.assign({',
    `  path: '${page.name}',`,
    '  load: async function(context, params) {',
    `    const page = await import("${page.scriptPath}")`,
    '    return [page, context, params]',
    '  }',
    `}, ${JSON.stringify(page.config)})`
  ].join('\n')
}


export default function (compiler): PluginOption {
  const { taroConfig, app, pages } = compiler
  const { router } = taroConfig
  const isMultiRouterMode = router?.mode === 'multi'
  const routerConfig = taroConfig.router || {}

  return {
    name: 'taro:vite-h5-entry',
    enforce: 'pre',
    async resolveId (source, importer) {
      const resolved = await this.resolve(source, importer, { skipSelf: true })
      if (!resolved?.id) return null
      // mpa 模式，入口文件为每个page下的config
      if (isMultiRouterMode && pages.some(({ configPath })=> configPath === resolved.id)) {
        return appendVirtualModulePrefix(resolved.id + ENTRY_SUFFIX)
      }
      if (resolved.id === compiler.app.configPath) {
        return appendVirtualModulePrefix(resolved.id + ENTRY_SUFFIX)
      }
      return null
    },
    load (id) {
      if (id.endsWith(ENTRY_SUFFIX)) {
        const { pageName } = compiler
        const routerCreator = isMultiRouterMode ? 'createMultiRouter' : 'createRouter'
        const appConfig = {
          router: routerConfig,
          ...app.config,
        }
        const page = pages.find(({ name }) => name === pageName) as PageMeta
        const routesConfig = isMultiRouterMode
          ? [
            'config.routes = []',
            `config.route = ${genResource(page)}`,
            `config.pageName = "${pageName}"`
          ].join('\n')
          : [
            'config.routes = [',
            `${pages.map(page => genResource(page)).join(',\n')}`,
            ']',
          ].join('\n')

        // runtime
        const runtimePath = Array.isArray(taroConfig.runtimePath) ? taroConfig.runtimePath : (taroConfig.runtimePath ? [taroConfig.runtimePath] : [])
        let setReconcilerPost = ''
        const setReconciler = runtimePath.reduce((res, item) => {
          if (/^post:/.test(item)) {
            setReconcilerPost += `import '${item.replace(/^post:/, '')}'\n`
            return res
          } else {
            return res + `import '${item}'\n`
          }
        }, '')

        // tabbar
        let tabBarCode = ''
        if (appConfig.tabBar) {
          tabBarCode = [
            'var tabbarIconPath = []',
            'var tabbarSelectedIconPath = []\n',
          ].join('\n')
          const tabbarList = appConfig.tabBar.list
          tabBarCode = tabbarList.reduce((prev, current, index) => {
            if (current.iconPath) {
              prev += `tabbarIconPath[${index}] = '${current.iconPath.replace(/^./, '')}'\n`
            }
            if (current.selectedIconPath) {
              prev += `tabbarSelectedIconPath[${index}] = '${current.selectedIconPath.replace(/^./, '')}'\n`
            }
            return prev
          }, tabBarCode)
          tabBarCode += [
            'var tabbarList = config.tabBar.list',
            'for (var i = 0; i < tabbarList.length; i++) {',
            '  var t = tabbarList[i]',
            '  if (t.iconPath) {',
            '    t.iconPath = tabbarIconPath[i]',
            '  }',
            '  if (t.selectedIconPath) {',
            '    t.selectedIconPath = tabbarSelectedIconPath[i]',
            '  }',
            '}',
          ].join('\n')
        }

        const {
          creator,
          creatorLocation,
          importFrameworkStatement,
          extraImportForWeb,
          execBeforeCreateWebApp,
          frameworkArgs,
          importFrameworkName,
        } = compiler.loaderMeta

        // pxTransform
        const __postcssOption = getDefaultPostcssConfig({
          designWidth: taroConfig.designWidth,
          deviceRatio: taroConfig.deviceRatio,
          option: taroConfig.postcss,
          esnextModules: taroConfig.esnextModules || []
        })
        const [, pxtransformOption] = __postcssOption.find(([name]) => name === 'postcss-pxtransform') || []
        const pxTransformConfig = pxtransformOption?.config || {}

        return [
          setReconciler,
          'import { initPxTransform } from "@tarojs/taro"',
          `import { ${routerCreator} } from "@tarojs/router"`,
          `import component from "${app.scriptPath}"`,
          'import { window } from "@tarojs/runtime"',
          `import { ${creator} } from "${creatorLocation}"`,
          importFrameworkStatement,
          extraImportForWeb,
          setReconcilerPost,
          `var config = window.__taroAppConfig = ${JSON.stringify(appConfig)}`,
          tabBarCode,
          routesConfig,
          execBeforeCreateWebApp || '',
          `var inst = ${creator}(component, ${frameworkArgs})`,
          `${routerCreator}(inst, config, ${importFrameworkName})`,
          'initPxTransform({',
          `  designWidth: ${pxTransformConfig.designWidth},`,
          `  deviceRatio: ${JSON.stringify(pxTransformConfig.deviceRatio)},`,
          `  baseFontSize: ${pxTransformConfig.baseFontSize || (pxTransformConfig.minRootSize >= 1 ? pxTransformConfig.minRootSize : 20)},`,
          `  unitPrecision: ${pxTransformConfig.unitPrecision},`,
          `  targetUnit: ${JSON.stringify(pxTransformConfig.targetUnit)}`,
          '})',
        ].join('\n')
      }
    }
  }
}
