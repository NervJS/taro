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
    this.page?.onLoad?.call(this, params, (instance) => {
      this.node = instance
    })
  }

  onPageShow () {
    if (!this.page) return

    this.page?.onShow?.call(this)
  }

  onPageHide () {
    if (!this.page) return

    this.page?.onHide?.call(this)
  }

  aboutToDisappear () {
    if (!this.page) return

    this.page?.onUnLoad?.call(this)
  }



  async showTree() {
    const taskQueen = []

    function showTree (tree, level = 1) {
      const res = {}
      Object.keys(tree).forEach(k => {
        const item = tree[k]
        if (k === 'nodeName' && item === 'TEXT') {
          return
        }
        // 匹配的属性
        if (['nodeName', '_st', '_textContent', '_attrs'].includes(k)) {
          res[k] = item
        }
      })
      let attr = ''
      Object.keys(res).forEach(k => {
        // 过滤空的
        if (k === 'nodeName') {
          return
        } else  if (k === '_textContent' && !res[k]) {
          return
        } else if (k === '_st' && !Object.keys(res[k]).length) {
          return
        } else if (k === '_attrs' && !Object.keys(res[k]).length) {
          return
        }
        attr += \`\${k}=\${JSON.stringify(res[k])} \`
      })

      if(tree.childNodes?.length) {
        taskQueen.push(() => {
          console.info('fuck-ele' + new Array(level).join('   '), \`<\${res.nodeName} \${attr}>\`)
        })
        tree.childNodes.forEach(child => {
          showTree(child, level+1)
        })
        taskQueen.push(() => {
          console.info('fuck-ele' + new Array(level).join('   '), \`</\${res.nodeName}>\`)
        })
      } else {
        taskQueen.push(() => {
          console.info('fuck-ele' + new Array(level).join('   '), \`<\${res.nodeName} \${attr}/>\`)
        })
      }
    }

    showTree(this.node)
    for (let i = 0; i < taskQueen.length; i++) {
      taskQueen[i]()
      await new Promise((resolve) => setTimeout(resolve, 16))
    }
  }

  build() {
    Scroll(this.scroller) {
      Column() {
        Button('打印NodeTree')
          .onClick(this.showTree.bind(this))
        TaroView({ node: this.node })
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
