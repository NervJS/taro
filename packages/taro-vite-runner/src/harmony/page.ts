import { appendVirtualModulePrefix, prettyPrintJson, stripVirtualModulePrefix } from '../utils'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

const PAGE_SUFFIX = '.ets?page-loader=true'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  return {
    name: 'taro:vite-harmony-page',
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
        const {
          creatorLocation,
          importFrameworkStatement,
          // frameworkArgs,
        } = viteCompilerContext.loaderMeta
        const rawId = stripVirtualModulePrefix(id).replace(PAGE_SUFFIX, '')
        const page = viteCompilerContext.getPageById(rawId)

        if (!page) {
          viteCompilerContext.logger.warn(`编译页面 ${rawId} 失败!`)
          process.exit(1)
        }

        const pageConfig = prettyPrintJson(page.config)

        let instantiatePage = [
          '@Component',
          `@Entry
struct Index {
  page\n
  scroller: Scroller = new Scroller()\n
  @State node: TaroElement = new TaroElement("Block")\n
  aboutToAppear() {
    const params = router.getParams() || {}

    this.page = createPageConfig(component, '${page.name}')
    this.page.onLoad(params, (instance) => {
      this.node = instance
    })
  }

  build() {
    Scroll(this.scroller) {
      Column() {
        if (this.node.tagName === 'VIEW') {
          TaroView({ node: this.node })
        } else if (this.node.tagName === 'TEXT') {
          TaroText({ node: this.node })
        } else if (this.node.tagName === 'IMAGE') {
          TaroImage({ node: this.node })
        } else if (this.node.tagName === 'SCROLL-VIEW') {
          TaroScrollView({ node: this.node })
        } else if (this.node.tagName === 'BUTTON') {
          TaroButton({ node: this.node })
        }
      }
    }
  }
}`,
        ].filter(e => typeof e === 'string').join('\n')

        if (typeof viteCompilerContext.loaderMeta.modifyInstantiate === 'function') {
          instantiatePage = viteCompilerContext.loaderMeta.modifyInstantiate(instantiatePage, 'page')
        }

        return [
          'import TaroView from "@tarojs/components/view"',
          'import TaroText from "@tarojs/components/text"',
          'import TaroImage from "@tarojs/components/image"',
          'import TaroButton from "@tarojs/components/button"',
          'import TaroScrollView from "@tarojs/components/scrollView"',
          'import { TaroElement } from "@tarojs/runtime"',
          `import component from "${rawId}"`,
          `import { createPageConfig, ReactMeta } from '${creatorLocation}'`,
          "import router from '@ohos.router';",
          importFrameworkStatement,
          `var config = ${pageConfig}`,
          page.config.enableShareTimeline ? 'component.enableShareTimeline = true' : null,
          page.config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : null,
          '',
          instantiatePage,
        ].filter(e => typeof e === 'string').join('\n')
      }
    },
  }
}
