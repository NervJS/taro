import { fs, isEmptyObject } from '@tarojs/helper'
import { isString } from '@tarojs/shared'
import path from 'path'

import { appendVirtualModulePrefix, prettyPrintJson, stripVirtualModulePrefix } from '../utils'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

const ENTRY_SUFFIX = '?entry-loader=true'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  return {
    name: 'taro:vite-harmony-entry',
    enforce: 'pre',
    resolveId (source, _importer, options) {
      if (viteCompilerContext?.isApp(source) && options.isEntry) {
        return appendVirtualModulePrefix(source + ENTRY_SUFFIX)
      }
      return null
    },
    load (id) {
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

        const { pages = [], entryPagePath = pages[0] } = appConfig
        let instantiateApp = `export default class EntryAbility extends UIAbility {
  app

  onCreate(want, launchParam) {
    this.app = ${createApp}
    this.app.onLaunch({
      ...want,
      ...launchParam
    })
  }

  onDestroy() {}

  onWindowStageCreate(stage) {
    context.resolver(this.context)
    stage.loadContent("${entryPagePath}", (err, data) => {
      if (err.code) {
        return this.app?.onError?.call(this, err)
      }
    })
  }

  onWindowStageDestroy() {
    this.app?.onUnload?.call(this)
  }

  onForeground() {
    this.app?.onShow?.call(this)
  }

  onBackground() {
    this.app?.onHide?.call(this)
  }
}`

        if (typeof modifyInstantiate === 'function') {
          instantiateApp = modifyInstantiate(instantiateApp, 'app')
        }

        // pages
        viteCompilerContext.pages.forEach(page => {
          this.emitFile({
            type: 'chunk',
            id: page.scriptPath,
            fileName: viteCompilerContext.getScriptPath(page.name),
            implicitlyLoadedAfterOneOf: [rawId]
          })
        })

        // tabbar
        if (appConfig.tabBar && !isEmptyObject(appConfig.tabBar)) {
          const list = appConfig.tabBar.list || []
          list.forEach(async item => {
            const { iconPath, selectedIconPath } = item
            const { sourceDir } = viteCompilerContext


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
          const themePath = path.resolve(viteCompilerContext.sourceDir, appConfig.themeLocation)
          this.emitFile({
            type: 'asset',
            fileName: appConfig.themeLocation,
            source: fs.readFileSync(themePath)
          })
          this.addWatchFile(themePath)
        }

        return [
          '// @ts-nocheck',
          setReconciler,
          'import UIAbility from "@ohos.app.ability.UIAbility"',
          'import { window, context } from "@tarojs/runtime"',
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
          '})',
        ].join('\n')
      }
    }
  }
}
