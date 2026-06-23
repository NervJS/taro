import path from 'node:path'

import { fs, isEmptyObject, removePathPrefix } from '@tarojs/helper'
import { isString } from '@tarojs/shared'

import { appendVirtualModulePrefix, escapePath, prettyPrintJson, stripVirtualModulePrefix } from '../utils'
import { baseCompName, customWrapperName } from '../utils/constants'
import { miniTemplateLoader, QUERY_IS_NATIVE_PAGE } from './native-support'

import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

const ENTRY_SUFFIX = '?entry-loader=true'

export default function (viteCompilerContext: ViteMiniCompilerContext): PluginOption {
  return {
    name: 'taro:vite-mini-entry',
    enforce: 'pre',
    resolveId (source, _importer, options) {
      if (viteCompilerContext?.isApp(source) && options.isEntry) {
        return appendVirtualModulePrefix(source + ENTRY_SUFFIX)
      }
      return null
    },
    async load (id) {
      if (viteCompilerContext && id.endsWith(ENTRY_SUFFIX)) {
        const rawId = stripVirtualModulePrefix(id).replace(ENTRY_SUFFIX, '')
        const { taroConfig, app } = viteCompilerContext
        const appConfig = app.config
        const runtimePath = Array.isArray(taroConfig.runtimePath) ? taroConfig.runtimePath : [taroConfig.runtimePath]
        let setReconcilerPost = ''
        const setReconciler = runtimePath.reduce((res, item) => {
          if (item && /^post:/.test(item)) {
            setReconcilerPost += `import '${item.replace(/^post:/, '')}'\n`
            return res
          } else {
            return res + `import '${item}'\n`
          }
        }, '')

        const { importFrameworkStatement, frameworkArgs, creator, creatorLocation, modifyInstantiate } = viteCompilerContext.loaderMeta
        const createApp = `${creator}(component, ${frameworkArgs})`

        const appConfigStr = prettyPrintJson(appConfig)

        let instantiateApp = taroConfig.blended
          ? [
            `\nvar app = ${createApp}`,
            'app.onLaunch()',
            'exports.taroApp = app'
          ].join('\n')
          : `var inst = App(${createApp})`

        if (typeof modifyInstantiate === 'function') {
          instantiateApp = modifyInstantiate(instantiateApp, 'app')
        }

        // pages
        viteCompilerContext.pages.forEach(async page => {
          // 小程序原生页面
          if (page.isNative) {
            if (page.templatePath) {
              const source = miniTemplateLoader(this, page.templatePath, viteCompilerContext.sourceDir)
              this.emitFile({
                type: 'asset',
                fileName: viteCompilerContext.getTemplatePath(page.name),
                source
              })
            }
            page.cssPath && this.addWatchFile(page.cssPath)
          }
          this.emitFile({
            type: 'chunk',
            id: `${page.scriptPath}${page.isNative ? QUERY_IS_NATIVE_PAGE : ''}`,
            fileName: viteCompilerContext.getScriptPath(page.name),
            implicitlyLoadedAfterOneOf: [rawId]
          })
        })

        // native components
        for (const comp of viteCompilerContext.nativeComponents.values()) {
          viteCompilerContext.generateNativeComponent(this, comp, [rawId])
        }

        // comp' script
        if (!viteCompilerContext.taroConfig.template.isSupportRecursive) {
          this.emitFile({
            type: 'chunk',
            id: path.resolve(__dirname, '../template/comp'),
            fileName: viteCompilerContext.getScriptPath(baseCompName),
            implicitlyLoadedAfterOneOf: [rawId]
          })
        }

        // custom-wrapper' script
        this.emitFile({
          type: 'chunk',
          id: path.resolve(__dirname, '../template/custom-wrapper'),
          fileName: viteCompilerContext.getScriptPath(customWrapperName),
          implicitlyLoadedAfterOneOf: [rawId]
        })

        // tabbar
        if (appConfig.tabBar && !isEmptyObject(appConfig.tabBar)) {
          const list = appConfig.tabBar.list || []
          const { sourceDir } = viteCompilerContext
          list.forEach(async item => {
            const { iconPath, selectedIconPath } = item
            if (iconPath) {
              const filePath = path.resolve(sourceDir, iconPath)
              this.emitFile({
                type: 'asset',
                fileName: removePathPrefix(iconPath),
                source: Uint8Array.from(fs.readFileSync(filePath))
              })
              this.addWatchFile(filePath)
            }

            if (selectedIconPath) {
              const filePath = path.resolve(sourceDir, selectedIconPath)
              this.emitFile({
                type: 'asset',
                fileName: removePathPrefix(selectedIconPath),
                source: Uint8Array.from(fs.readFileSync(filePath))
              })
              this.addWatchFile(filePath)
            }
          })
        }

        // darkmode
        if (appConfig.darkmode && isString(appConfig.themeLocation)) {
          const themePath = path.resolve(viteCompilerContext.sourceDir, appConfig.themeLocation)
          this.emitFile({
            type: 'asset',
            fileName: appConfig.themeLocation,
            source: Uint8Array.from(fs.readFileSync(themePath))
          })
          this.addWatchFile(themePath)
        }

        return [
          setReconciler,
          'import { window } from "@tarojs/runtime"',
          `import { ${creator} } from "${creatorLocation}"`,
          'import { initPxTransform } from "@tarojs/taro"',
          setReconcilerPost,
          `import component from "${escapePath(rawId)}"`,
          importFrameworkStatement,
          `var config = ${appConfigStr};`,
          'window.__taroAppConfig = config',
          instantiateApp,
          'initPxTransform({',
          `designWidth: ${taroConfig.designWidth || 750},`,
          `deviceRatio: ${JSON.stringify(taroConfig.deviceRatio || { 750: 1 })}`,
          '})'
        ].join('\n')
      }
    }
  }
}
