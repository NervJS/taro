import { fs, isEmptyObject } from '@tarojs/helper'
import { isString } from '@tarojs/shared'
import path from 'path'

import { appendVirtualModulePrefix, prettyPrintJson, stripVirtualModulePrefix } from '../utils'
import { PAGE_SUFFIX, TARO_TABBAR_PAGE_PATH } from './page'

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
        const { taroConfig, cwd: appPath, app } = viteCompilerContext
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

        const { pages = [], entryPagePath = pages[0], tabBar } = appConfig
        let entryPath = entryPagePath
        const tabbarList = tabBar?.list || []
        const tabbarIndex = tabbarList.findIndex(item => item.pagePath === entryPagePath)
        if (tabbarIndex >= 0) {
          entryPath = TARO_TABBAR_PAGE_PATH
          // TODO 寻找其它方案传入 tabbarIndex 用于 switchTab
          // entryPagePath = `${TARO_TABBAR_PAGE_PATH}?current=${tabbarIndex}`
        }
        let instantiateApp = `export default class EntryAbility extends UIAbility {
  app

  onCreate(want, launchParam) {
    AppStorage.SetOrCreate('__TARO_ENTRY_PAGE_PATH', '${entryPagePath}')
    AppStorage.SetOrCreate('__TARO_PAGE_STACK', [])
    this.app = ${createApp}
    this.app.onLaunch({
      ...want,
      ...launchParam
    })
  }

  onDestroy() {}

  onWindowStageCreate(stage) {
    context.resolver(this.context)
    stage.loadContent('${entryPath}', (err, data) => {
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

        // rawfile innerHTML模版，供innerhtml的webview加载
        const { outputRoot = 'dist' } = taroConfig
        const rawFileDir = path.join(path.resolve(outputRoot, '..'), 'resources/rawfile')
        if (!fs.existsSync(rawFileDir)) {
          fs.mkdirSync(rawFileDir, { recursive: true })
        }
        const targetPath = path.join(rawFileDir, 'innerHTML.html')
        fs.writeFile(targetPath, Buffer.from(`<html><body></body></html>`, 'utf-8'))

        const tabbar = appConfig.tabBar
        // pages
        viteCompilerContext.pages.forEach(page => {
          const list = tabbar?.list || []
          if (list.every(item => item.pagePath !== page.name)) {
            this.emitFile({
              type: 'chunk',
              id: page.scriptPath,
              fileName: viteCompilerContext.getScriptPath(page.name),
              implicitlyLoadedAfterOneOf: [rawId]
            })
          }
        })

        // tabbar
        if (tabbar && !isEmptyObject(tabbar)) {
          const tabbarPage = TARO_TABBAR_PAGE_PATH
          const tabbarPath = path.join(appPath, taroConfig.sourceRoot || 'src', `${tabbarPage}${PAGE_SUFFIX}`)
          this.emitFile({
            type: 'chunk',
            id: tabbarPath,
            fileName: `${tabbarPage}.ets`,
            implicitlyLoadedAfterOneOf: [rawId]
          })
          const list = tabbar.list || []
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
          'import Taro, { initNativeApi, initPxTransform } from "@tarojs/taro"',
          'import router from "@ohos.router"',
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
          'initNativeApi(Taro)',
        ].join('\n')
      }
    }
  }
}
