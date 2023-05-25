import { fs, isEmptyObject } from '@tarojs/helper'
import { isString } from '@tarojs/shared'
import path from 'path'

import { appendVirtualModulePrefix, getMiniCompiler, prettyPrintJson, stripVirtualModulePrefix } from '../utils'
import { baseCompName, customWrapperName } from '../utils/constants'
import { miniTemplateLoader, QUERY_IS_NATIVE_COMP,QUERY_IS_NATIVE_PAGE } from './native-support'

import type { PluginOption } from 'vite'

const ENTRY_SUFFIX = '?entry-loader=true'

export default function (/* taroConfig: MiniBuildConfig */): PluginOption {
  return {
    name: 'taro:vite-mini-entry',
    enforce: 'pre',
    resolveId (source, _importer, options) {
      const compiler = getMiniCompiler(this)
      if (compiler?.isApp(source) && options.isEntry) {
        return appendVirtualModulePrefix(source + ENTRY_SUFFIX)
      }
      return null
    },
    load (id) {
      const compiler = getMiniCompiler(this)
      if (compiler && id.endsWith(ENTRY_SUFFIX)) {
        const rawId = stripVirtualModulePrefix(id).replace(ENTRY_SUFFIX, '')
        const { taroConfig, app } = compiler
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

        const { importFrameworkStatement, frameworkArgs, creator, creatorLocation, modifyInstantiate } = compiler.loaderMeta
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
        compiler.pages.forEach(page => {
          // 小程序原生页面
          if (page.isNative) {
            if (page.templatePath) {
              const source = miniTemplateLoader(this, page.templatePath, compiler.sourceDir)
              this.emitFile({
                type: 'asset',
                fileName: compiler.getTemplatePath(page.name),
                source
              })
            }
            page.cssPath && this.addWatchFile(page.cssPath)
          }
          this.emitFile({
            type: 'chunk',
            id: `${page.scriptPath}${page.isNative ? QUERY_IS_NATIVE_PAGE : ''}`,
            fileName: compiler.getScriptPath(page.name),
            implicitlyLoadedAfterOneOf: [rawId]
          })
        })

        // native components
        for (const comp of compiler.nativeComponents.values()) {
          this.emitFile({
            type: 'chunk',
            id: comp.scriptPath + QUERY_IS_NATIVE_COMP,
            fileName: compiler.getScriptPath(comp.name),
            implicitlyLoadedAfterOneOf: [rawId]
          })
          const source = miniTemplateLoader(this, comp.templatePath, compiler.sourceDir)
          this.emitFile({
            type: 'asset',
            fileName: compiler.getTemplatePath(comp.name),
            source
          })
          comp.cssPath && this.addWatchFile(comp.cssPath)
        }

        // comp' script
        if (!compiler.taroConfig.template.isSupportRecursive) {
          this.emitFile({
            type: 'chunk',
            id: path.resolve(__dirname, '../template/comp'),
            fileName: compiler.getScriptPath(baseCompName),
            implicitlyLoadedAfterOneOf: [rawId]
          })
        }

        // custom-wrapper' script
        this.emitFile({
          type: 'chunk',
          id: path.resolve(__dirname, '../template/custom-wrapper'),
          fileName: compiler.getScriptPath(customWrapperName),
          implicitlyLoadedAfterOneOf: [rawId]
        })

        // tabbar
        if (appConfig.tabBar && !isEmptyObject(appConfig.tabBar)) {
          const list = appConfig.tabBar.list || []
          list.forEach(async item => {
            const { iconPath, selectedIconPath } = item
            const { sourceDir } = compiler


            if (iconPath) {
              const filePath = path.resolve(sourceDir, iconPath)
              this.emitFile({
                type: 'asset',
                fileName: item.iconPath,
                source: await fs.readFile(filePath)
              })
              this.addWatchFile(filePath)
            }

            if (selectedIconPath) {
              const filePath = path.resolve(sourceDir, selectedIconPath)
              this.emitFile({
                type: 'asset',
                fileName: selectedIconPath,
                source: await fs.readFile(filePath)
              })
              this.addWatchFile(filePath)
            }
          })
        }

        // darkmode
        if (appConfig.darkmode && isString(appConfig.themeLocation)) {
          const themePath = path.resolve(compiler.sourceDir, appConfig.themeLocation)
          this.emitFile({
            type: 'asset',
            fileName: appConfig.themeLocation,
            source: fs.readFileSync(themePath)
          })
          this.addWatchFile(themePath)
        }

        return [
          setReconciler,
          'import { window } from "@tarojs/runtime"',
          `import { ${creator} } from "${creatorLocation}"`,
          'import { initPxTransform } from "@tarojs/taro"',
          setReconcilerPost,
          `import component from "${rawId}"`,
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
