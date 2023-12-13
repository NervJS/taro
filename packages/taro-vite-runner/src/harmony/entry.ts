import { fs, isEmptyObject } from '@tarojs/helper'
import { isString } from '@tarojs/shared'
import path from 'path'

import { appendVirtualModulePrefix, stripVirtualModulePrefix } from '../utils'
import { AppParser } from './template'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export const ENTRY_SUFFIX = '?entry-loader=true'
export const TARO_COMP_SUFFIX = '_taro_comp'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  const name = 'taro:vite-harmony-entry'

  return {
    name,
    enforce: 'pre',
    resolveId (source, _importer, options) {
      // Note: 组件编译模式下不需要生成入口文件
      if (viteCompilerContext.taroConfig.isBuildNativeComp) return null

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
          // const list = tabbar?.list || []
          // if (list.every(item => item.pagePath !== page.name)) {}
          this.emitFile({
            type: 'chunk',
            id: page.scriptPath,
            fileName: viteCompilerContext.getScriptPath(page.name + TARO_COMP_SUFFIX),
            implicitlyLoadedAfterOneOf: [rawId]
          })
        })

        // emit tabbar
        if (tabbar && !isEmptyObject(tabbar)) {
          // const tabbarPage = TARO_TABBAR_PAGE_PATH
          // const tabbarPath = path.join(appPath, taroConfig.sourceRoot || 'src', `${tabbarPage}${PAGE_SUFFIX}`)
          // this.emitFile({
          //   type: 'chunk',
          //   id: tabbarPath,
          //   fileName: `${tabbarPage}${viteCompilerContext.fileType.script}`,
          //   implicitlyLoadedAfterOneOf: [rawId]
          // })
          const list = tabbar.list || []
          list.forEach(async item => {
            const { iconPath, selectedIconPath } = item
            const { sourceDir } = viteCompilerContext

            if (iconPath) {
              const filePath = path.resolve(sourceDir, iconPath)
              this.emitFile({
                type: 'asset',
                fileName: path.relative('/', iconPath),
                source: await fs.readFile(filePath)
              })
              this.addWatchFile(filePath)
            }

            if (selectedIconPath) {
              const filePath = path.resolve(sourceDir, selectedIconPath)
              this.emitFile({
                type: 'asset',
                fileName: path.relative('/', selectedIconPath),
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

        this.emitFile({
          type: 'prebuilt-chunk',
          fileName: viteCompilerContext.getTargetFilePath(app.name, '.ets'),
          code: parse.parse(rawId, name, this.resolve),
          exports: ['default'],
        })
        return parse.parseEntry(rawId, appConfig)
      }
    }
  }
}
