import path from 'node:path'

import { fs, isEmptyObject, normalizePath } from '@tarojs/helper'

import { getDefaultPostcssConfig } from '../postcss/postcss.h5'
import { appendVirtualModulePrefix, generateQueryString, getMode, getQueryParams } from '../utils'
import { ENTRY_QUERY, PAGENAME_QUERY } from '../utils/constants'

import type { ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteH5CompilerContext): PluginOption {
  const tabbarAssetsCache = new Map<string, string>()
  const { taroConfig, app } = viteCompilerContext
  const routerConfig = taroConfig.router || {}
  const isProd = getMode(taroConfig) === 'production'
  const configPath = normalizePath(app.configPath)
  return {
    name: 'taro:vite-h5-entry',
    enforce: 'pre',

    async resolveId (source, importer, options) {
      // mpa 模式关于 入口脚本文件 的处理已经解藕到 mpa.ts
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true })
      if (resolved?.id && resolved.id === configPath) {
        const params = {
          [ENTRY_QUERY]: 'true'
        }
        const queryString = generateQueryString(params)
        return appendVirtualModulePrefix(resolved.id + `?${queryString}`)
      }
      return null
    },
    load (id) {
      const queryParams = getQueryParams(id)
      const encodeIsEntry = queryParams?.[ENTRY_QUERY] || ''
      const encodePagename = queryParams?.[PAGENAME_QUERY] || ''
      const isEntry = decodeURIComponent(encodeIsEntry as string)
      const pagename = decodeURIComponent(encodePagename as string)

      if (isEntry) {
        const appConfig = {
          router: routerConfig,
          ...app.config,
        }
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

        const getTabbarIconPath = (iconPath) => {
          return isProd
            ? path.join('/', taroConfig.staticDirectory as string, 'images', path.basename(iconPath))
            : iconPath.replace(/^./, '')
        }

        const emitTabbarIcon = async (sourceDir, iconPath) => {
          const filePath = path.resolve(sourceDir, iconPath)
          const fileName = path.join(taroConfig.staticDirectory as string, 'images', path.basename(iconPath))
          if (!tabbarAssetsCache.get(fileName)) {
            tabbarAssetsCache.set(fileName, filePath)
            this.emitFile({
              type: 'asset',
              fileName,
              source: await fs.readFile(filePath)
            })
            this.addWatchFile(filePath)
          }
        }

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
              prev += `tabbarIconPath[${index}] = '${getTabbarIconPath(current.iconPath)}'\n`
            }
            if (current.selectedIconPath) {
              prev += `tabbarSelectedIconPath[${index}] = '${getTabbarIconPath(current.selectedIconPath)}'\n`
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

        // tabbar && pro
        if (appConfig.tabBar && !isEmptyObject(appConfig.tabBar) && isProd) {
          const list = appConfig.tabBar.list || []
          const { sourceDir } = viteCompilerContext
          list.forEach(async item => {
            const { iconPath, selectedIconPath } = item
            if (iconPath) {
              await emitTabbarIcon.bind(this)(sourceDir, iconPath)
            }
            if (selectedIconPath) {
              await emitTabbarIcon.bind(this)(sourceDir, selectedIconPath)
            }
          })
        }

        const { getRoutesConfig, routerCreator } = viteCompilerContext.routerMeta
        const routesConfig = getRoutesConfig(pagename)

        const {
          creator,
          creatorLocation,
          importFrameworkStatement,
          extraImportForWeb,
          execBeforeCreateWebApp,
          frameworkArgs,
          importFrameworkName,
        } = viteCompilerContext.loaderMeta

        // pxTransform
        const __postcssOption = getDefaultPostcssConfig({
          designWidth: taroConfig.designWidth,
          deviceRatio: taroConfig.deviceRatio,
          option: taroConfig.postcss,
          esnextModules: taroConfig.esnextModules || []
        })
        const [, pxtransformOption] = __postcssOption.find(([name]) => name === 'postcss-pxtransform') || []
        const pxTransformConfig = pxtransformOption?.config || {}
        const routerMode = appConfig?.router?.mode || 'hash'
        const historyCreator = routerMode === 'browser' ? 'createBrowserHistory' : routerMode === 'multi' ? 'createMpaHistory' : 'createHashHistory'
        const appMountHandler = appConfig.tabBar ? 'handleAppMountWithTabbar' : 'handleAppMount'

        return [
          setReconciler,
          'import "@tarojs/components/global.css"',
          'import { initPxTransform } from "@tarojs/taro"',
          `import { ${routerCreator}, ${historyCreator}, ${appMountHandler} } from "@tarojs/router"`,
          `import component from "${normalizePath(app.scriptPath)}"`,
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
          `var history = ${historyCreator}({ window })`,
          `${appMountHandler}(config, history)`,
          `${routerCreator}(history, inst, config, ${importFrameworkName})`,
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
