import { fs, isEmptyObject } from '@tarojs/helper'
import { isString } from '@tarojs/shared'
import path from 'path'

import { appendVirtualModulePrefix, getHarmonyCompiler, prettyPrintJson, stripVirtualModulePrefix } from '../utils'

import type { PluginOption } from 'vite'

const ENTRY_SUFFIX = '?entry-loader=true'

export default function (/* taroConfig: HarmonyBuildConfig */): PluginOption {
  return {
    name: 'taro:vite-harmony-entry',
    enforce: 'pre',
    resolveId (source, _importer, options) {
      const compiler = getHarmonyCompiler(this)
      if (compiler?.isApp(source) && options.isEntry) {
        return appendVirtualModulePrefix(source + ENTRY_SUFFIX)
      }
      return null
    },
    load (id) {
      const compiler = getHarmonyCompiler(this)
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

        let instantiateApp = `var inst = App(${createApp})`

        if (typeof modifyInstantiate === 'function') {
          instantiateApp = modifyInstantiate(instantiateApp, 'app')
        }

        // pages
        compiler.pages.forEach(page => {
          this.emitFile({
            type: 'chunk',
            id: page.scriptPath,
            fileName: compiler.getScriptPath(page.name),
            implicitlyLoadedAfterOneOf: [rawId]
          })
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
