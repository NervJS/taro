import path from 'path'

import { appendVirtualModulePrefix, stripVirtualModulePrefix, virtualModulePrefixREG } from '../utils'
import { PageParser } from './template'

import type { ViteHarmonyCompilerContext, VitePageMeta } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export const PAGE_SUFFIX = '.ets?page-loader=true'
export const TARO_TABBAR_PAGE_PATH = 'taro_tabbar'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  return {
    name: 'taro:vite-harmony-page',
    enforce: 'pre',
    resolveId (source, importer, options) {
      if (viteCompilerContext?.isPage(source) && options.isEntry) {
        if (viteCompilerContext.getPageById(source)?.isNative) return null
        return appendVirtualModulePrefix(source + PAGE_SUFFIX)
      } else if (source.endsWith(PAGE_SUFFIX)) {
        return appendVirtualModulePrefix(source)
      } else if (virtualModulePrefixREG.test(importer || '')) {
        importer = stripVirtualModulePrefix(importer || '')
        if (source.includes(TARO_TABBAR_PAGE_PATH) && source === importer.replace(PAGE_SUFFIX, '')) {
          return appendVirtualModulePrefix(source)
        } else {
          return this.resolve(source, importer, options)
        }
      }
      return null
    },
    load (id) {
      if (!viteCompilerContext) return
      const { taroConfig, cwd: appPath, app } = viteCompilerContext
      const appConfig = app.config
      const parse = new PageParser(appPath, appConfig, taroConfig, viteCompilerContext.loaderMeta)
      const tabbarList = appConfig.tabBar?.list || []
      const pages = viteCompilerContext.getPages()
      if (id === appendVirtualModulePrefix(path.join(appPath, taroConfig.sourceRoot || 'src', `${TARO_TABBAR_PAGE_PATH}`))) {
        return parse.parseTabbar(pages)
      }

      if (id.endsWith(PAGE_SUFFIX)) {
        const rawId = stripVirtualModulePrefix(id).replace(PAGE_SUFFIX, '')
        const isTabbarPage = !viteCompilerContext.getPageById(rawId)
        let page: VitePageMeta | VitePageMeta[] | undefined = viteCompilerContext.getPageById(rawId)

        if (isTabbarPage) {
          page = tabbarList.map(item => pages.find(e => e.name === item.pagePath)!)
        }

        if (!page) {
          viteCompilerContext.logger.warn(`编译页面 ${rawId} 失败!`)
          process.exit(1)
        }

        return parse.parse(rawId, page)
      }
    },
  }
}
