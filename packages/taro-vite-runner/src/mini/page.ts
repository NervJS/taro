import { appendVirtualModulePrefix, escapePath, prettyPrintJson, stripVirtualModulePrefix } from '../utils'

import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

const PAGE_SUFFIX = '?page-loader=true'

export default function (viteCompilerContext: ViteMiniCompilerContext): PluginOption {
  return {
    name: 'taro:vite-mini-page',
    enforce: 'pre',
    resolveId (source, _importer, options) {
      if (viteCompilerContext?.isPage(source) && options.isEntry) {
        if (viteCompilerContext.getPageById(source)?.isNative) return null
        return appendVirtualModulePrefix(source + PAGE_SUFFIX)
      }
      return null
    },
    load (id) {
      if (viteCompilerContext && id.endsWith(PAGE_SUFFIX)) {
        const rawId = stripVirtualModulePrefix(id).replace(PAGE_SUFFIX, '')
        const page = viteCompilerContext.getPageById(rawId)

        if (!page) {
          viteCompilerContext.logger.warn(`编译页面 ${rawId} 失败!`)
          process.exit(1)
        }

        const pageConfig = prettyPrintJson(page.config)

        let instantiatePage = `var inst = Page(createPageConfig(component, '${page.name}', {root:{cn:[]}}, config || {}))`

        if (typeof viteCompilerContext.loaderMeta.modifyInstantiate === 'function') {
          instantiatePage = viteCompilerContext.loaderMeta.modifyInstantiate(instantiatePage, 'page')
        }

        return [
          'import { createPageConfig } from "@tarojs/runtime"',
          `import component from "${escapePath(rawId)}"`,
          `var config = ${pageConfig}`,
          page.config.enableShareTimeline ? 'component.enableShareTimeline = true' : '',
          page.config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : '',
          instantiatePage,
        ].join('\n')
      }
    }
  }
}
