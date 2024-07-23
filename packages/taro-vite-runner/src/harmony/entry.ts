import path from 'node:path'

import { fs, isEmptyObject, removePathPrefix, resolveMainFilePath } from '@tarojs/helper'
import { isString } from '@tarojs/shared'

import { appendVirtualModulePrefix, stripVirtualModulePrefix } from '../utils'
import { QUERY_IS_NATIVE_SCRIPT } from './ets'
import { AppParser } from './template'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export const ENTRY_SUFFIX = '?entry-loader=true'
export const TARO_COMP_SUFFIX = '_taro_comp'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  const name = 'taro:vite-harmony-entry'
  let isFinished = false

  return {
    name,
    enforce: 'pre',
    resolveId (source, _importer, options) {
      // Note: 组件编译模式下不需要生成入口文件
      if (viteCompilerContext.taroConfig.isBuildNativeComp || viteCompilerContext.taroConfig.blended) return null

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
        if (!isFinished) {
          // Note: 监听 app 配置文件
          this.addWatchFile(viteCompilerContext.getConfigFilePath(viteCompilerContext.getAppScriptPath()))
        }
        // Note: rawfile innerHTML 模版，供 innerHtml 的 webview 加载
        const { outputRoot = 'dist' } = taroConfig
        const rawFileDir = path.join(path.resolve(outputRoot, '..'), 'resources/rawfile')
        if (!fs.existsSync(rawFileDir)) {
          fs.mkdirSync(rawFileDir, { recursive: true })
        }
        const targetPath = path.join(rawFileDir, 'innerHTML.html')
        fs.writeFile(targetPath, Buffer.from(`<html><body></body></html>`, 'utf-8'))
        const tabbar = appConfig.tabBar
        const parse = new AppParser(appPath, appConfig, taroConfig, viteCompilerContext.loaderMeta)
        // emit pages
        viteCompilerContext.pages.forEach(page => {
          if (page.isNative) {
            const { sourceDir, nativeExt } = viteCompilerContext as ViteHarmonyCompilerContext
            const nativePath = resolveMainFilePath(path.join(sourceDir, page.name), nativeExt)

            this.emitFile({
              type: 'chunk',
              id: nativePath + QUERY_IS_NATIVE_SCRIPT,
              fileName: path.relative(viteCompilerContext.sourceDir, nativePath) + QUERY_IS_NATIVE_SCRIPT,
              implicitlyLoadedAfterOneOf: [rawId]
            })
          } else {
            this.emitFile({
              type: 'chunk',
              id: page.scriptPath,
              fileName: viteCompilerContext.getScriptPath(page.name + TARO_COMP_SUFFIX),
              implicitlyLoadedAfterOneOf: [rawId]
            })
          }
        })

        // native components
        for (const comp of viteCompilerContext.nativeComponents.values()) {
          if (!comp.isPackage) {
            this.emitFile({
              type: 'chunk',
              id: comp.templatePath + QUERY_IS_NATIVE_SCRIPT,
              fileName: path.relative(viteCompilerContext.sourceDir, comp.templatePath) + QUERY_IS_NATIVE_SCRIPT,
              implicitlyLoadedAfterOneOf: [rawId]
            })
          }
        }

        // emit tabbar
        if (tabbar && !isEmptyObject(tabbar)) {
          const list = tabbar.list || []
          list.forEach(async item => {
            const { iconPath, selectedIconPath } = item
            const { sourceDir } = viteCompilerContext

            if (iconPath) {
              const filePath = path.resolve(sourceDir, iconPath)
              this.emitFile({
                type: 'asset',
                fileName: removePathPrefix(iconPath),
                source: await fs.readFile(filePath)
              })
              if (!isFinished) {
                this.addWatchFile(filePath)
              }
            }

            if (selectedIconPath) {
              const filePath = path.resolve(sourceDir, selectedIconPath)
              this.emitFile({
                type: 'asset',
                fileName: removePathPrefix(selectedIconPath),
                source: await fs.readFile(filePath)
              })
              if (!isFinished) {
                this.addWatchFile(filePath)
              }
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
          if (!isFinished) {
            this.addWatchFile(themePath)
          }
        }

        this.emitFile({
          type: 'prebuilt-chunk',
          fileName: viteCompilerContext.getTargetFilePath(app.name, '.ets'),
          code: parse.parse(rawId, name, this.resolve),
          exports: ['default'],
        })
        return parse.parseEntry(rawId, appConfig)
      }
    },
    buildEnd () {
      isFinished = true
    }
  }
}
