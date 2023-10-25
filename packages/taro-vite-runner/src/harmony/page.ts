import { isFunction } from '@tarojs/shared'
import path from 'path'

import { appendVirtualModulePrefix, prettyPrintJson, stripVirtualModulePrefix, virtualModulePrefixREG } from '../utils'

import type { ViteHarmonyCompilerContext, VitePageMeta } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export const PAGE_SUFFIX = '.ets?page-loader=true'
export const TARO_TABBAR_PAGE_PATH = 'taro_tabbar'

const SHOW_TREE = true
const showTreeFunc = (isTabbarPage) => `\nasync showTree() {
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

  showTree(this.node${isTabbarPage ? '[this.currentIndex]' : ''})
  for (let i = 0; i < taskQueen.length; i++) {
    taskQueen[i]()
    await new Promise((resolve) => setTimeout(resolve, 16))
  }
}`
const SHOW_TREE_BTN = `\nButton({ type: ButtonType.Circle, stateEffect: true }) {
  Text('打印 NodeTree')
    .fontSize(7).fontColor(Color.White)
    .size({ width: 25, height: 25 })
    .textAlign(TextAlign.Center)
}
.width(55).height(55).margin({ left: 20 }).backgroundColor(Color.Blue)
.position({ x: '75%', y: '80%' })
.onClick(this.showTree.bind(this))`

function transArr2Str (array: unknown[], prefixSpace = 0) {
  return array.filter(e => typeof e === 'string').join(`\n${' '.repeat(prefixSpace)}`)
}

function renderPage (isTabPage: boolean) {
  let pageStr = `Stack({ alignContent: Alignment.TopStart }) {
  Scroll(this.scroller) {
    Column() {
      TaroView({ node: ${isTabPage ? 'this.node[index]' : 'this.node'} })
    }
  }
  .onScroll(() => {
    if (!this.page) return

    this.page?.onPageScroll?.call(this)
  })
}
.width('100%')
.height('100%')
`

  if (isTabPage) {
    pageStr = `Tabs({
  barPosition: this.position !== 'top' ? BarPosition.End : BarPosition.Start,
  controller: this.controller,
  index: this.currentIndex,
}) {
  ForEach(this.tabBar.list, (item, index) => {
    TabContent() {
      ${transArr2Str(pageStr.split('\n'), 6)}
    }.tabBar(this.renderTabBuilder(index, item))
  }, item => item.pagePath)
}
.vertical(false)
.barMode(BarMode.Fixed)
.barHeight(this.isTabbarShow ? 56 : 0)
.animationDuration(this.animationDuration)
.onChange((index: number) => {
  this.getPage(this.currentIndex).onHide?.call(this)
  this.currentIndex = index
  this.handlePageAppear()
  this.getPage()?.onShow?.call(this)
})
.backgroundColor(this.backgroundColor)`
  }
  if (SHOW_TREE) {
    pageStr = `if (true) {
  ${transArr2Str(pageStr.split('\n'), 2)}
  ${transArr2Str(SHOW_TREE_BTN.split('\n'), 2)}
}`
  }
  return pageStr
}

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
      const { taroConfig, cwd: appPath } = viteCompilerContext
      const tabbarList = viteCompilerContext.app.config.tabBar?.list || []
      const pages = viteCompilerContext.getPages()
      if (id === appendVirtualModulePrefix(path.join(appPath, taroConfig.sourceRoot || 'src', `${TARO_TABBAR_PAGE_PATH}`))) {
        return transArr2Str([
          tabbarList.map((e, i) => `import page${i} from './${e.pagePath}'`).join('\n'),
          '',
          tabbarList.map((e, i) => {
            const page = pages.find(item => item.name === e.pagePath)
            return transArr2Str([
              page?.config.enableShareTimeline ? `page${i}.enableShareTimeline = true` : null,
              page?.config.enableShareAppMessage ? `page${i}.enableShareAppMessage = true` : null,
            ])
          }).join('\n'),
          '',
          `
export default { ${
  tabbarList.map((e, i) => {
    return `'${e.pagePath}': page${i}`
  }).join(', ')
} }`])
      }
      if (id.endsWith(PAGE_SUFFIX)) {
        const {
          creatorLocation,
          importFrameworkStatement,
        } = viteCompilerContext.loaderMeta
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

        const structCodeArray: unknown[] = [
          '@Entry',
          '@Component',
          'struct Index {',
        ]
        const generateState = [
          'page',
          'scroller: Scroller = new Scroller()',
          '',
          isTabbarPage ? `@State node: TaroElement[] = [${
            tabbarList.map(() => 'new TaroElement("Block")').join(', ')
          }]` : '@State node: TaroElement = new TaroElement("Block")',
          '@State appConfig: AppConfig = window.__taroAppConfig || {}',
        ]
        if (isTabbarPage) {
          generateState.push(
            '@StorageProp("__TARO_ENTRY_PAGE_PATH") entryPagePath: string = ""',
            '@State isTabbarShow: boolean = true',
            '@State tabBar: TabBar = this.appConfig.tabBar || {}',
            '@State tabBarList: TabBarItem[] = this.tabBar.list || []',
            '@State color: string = this.tabBar.color || "#7A7E83"',
            '@State selectedColor: string = this.tabBar.selectedColor || "#3CC51F"',
            '@State backgroundColor: string = this.tabBar.backgroundColor || "#FFFFFF"',
            '@State borderStyle: "white" | "black" = this.tabBar.borderStyle || "black"',
            '@State position: "top" | "bottom" = this.tabBar.position || "bottom"',
            '@State withImage: boolean = this.tabBarList.every(e => !!e.iconPath)',
            '@State animationDuration: number = 400',
            '@State currentIndex: number = 0',
            'private controller: TabsController = new TabsController()',
          )
        }
        structCodeArray.push(
          transArr2Str(generateState, 2),
          `
  aboutToAppear() {
    ${isTabbarPage ? `let index = this.tabBarList.findIndex(e => e.pagePath === this.entryPagePath)
    index = index >= 0 ? index : 0
    this.handlePageAppear(index)
    this.currentIndex = index
    this.bindEvent()` : 'this.handlePageAppear()'}
  }

  onPageShow () {
    ${isTabbarPage ? `this.page?.forEach(item => {
      item?.onShow?.call(this)
    })` : 'this.page?.onShow?.call(this)'}
  }

  onPageHide () {
    ${isTabbarPage ? `this.page?.forEach(item => {
      item?.onHide?.call(this)
    })` : 'this.page?.onHide?.call(this)'}
  }

  aboutToDisappear () {
    ${isTabbarPage ? `this.page?.forEach(item => {
      item?.onUnLoad?.call(this)
    })
    this.removeEvent()` : 'this.page?.onUnLoad?.call(this)'}
  }`,
          SHOW_TREE ? transArr2Str(['', '', ...showTreeFunc(isTabbarPage).split('\n')], 2) : null,
          `
  handlePageAppear(${isTabbarPage ? 'index = this.currentIndex' : ''}) {
    const isCustomStyle = this.appConfig.window?.navigationStyle === 'custom'
    if ((isCustomStyle && this.getConfig().navigationStyle !== 'default') || this.getConfig().navigationStyle === 'custom') {
      (Current as any).contextPromise
        .then(context => {
          const win = window.__ohos.getTopWindow(context)
          win.then(mainWindow => {
            mainWindow.setFullScreen(true)
            mainWindow.setSystemBarEnable(["status", "navigation"])
          })
        })
    }
    const params = router.getParams() || {}

    ${isTabbarPage
    ? transArr2Str([
      'this.page ||= []',
      'if (!this.page[index]) {',
      '  const pageName = this.tabBarList[index]?.pagePath',
      '  const page = createPageConfig(component[pageName], pageName)',
      '  this.page[index] = page',
      '  this.page[index].onLoad?.call(this, params, (instance) => {',
      '    this.node[index] = instance',
      '  })',
      '}',
    ], 4)
    : transArr2Str([
      `const page = createPageConfig(component, '${(page as VitePageMeta).name}')`,
      'this.page = page',
      'this.page.onLoad?.call(this, params, (instance) => {',
      '  this.node = instance',
      '})',
    ], 4)}
  }

  getPage(${isTabbarPage ? 'index = this.currentIndex' : ''}) {
    ${isTabbarPage ? `return this.page[index]` : 'return this.page'}
  }

  getConfig(${isTabbarPage ? 'index = this.currentIndex' : ''}) {
    ${isTabbarPage ? `return config[index]` : 'return config'}
  }`,
          isTabbarPage ? `
  routerChangeHandler = () => {}

  switchTabHandler = () => {}

  setTabBarBadgeHandler = () => {}

  removeTabBarBadgeHandler = () => {}

  showTabBarRedDotHandler = () => {}

  hideTabBarRedDotHandler = () => {}

  showTabBarHandler = ({ animation = false }) => {
    if (animation) {
      animateTo({
        duration: this.animationDuration,
        tempo: 1,
        playMode: PlayMode.Normal,
        iterations: 1,
      }, () => {
        this.isTabbarShow = true
      })
    } else {
      this.isTabbarShow = true
    }
  }

  hideTabBarHandler = ({ animation = false }) => {
    if (animation) {
      animateTo({
        duration: this.animationDuration,
        tempo: 1,
        playMode: PlayMode.Normal,
        iterations: 1,
      }, () => {
        this.isTabbarShow = false
      })
    } else {
      this.isTabbarShow = false
    }
  }

  setTabBarStyleHandler = () => {}

  setTabBarItemHandler = () => {}

  bindEvent () {
    eventCenter.on('__taroRouterChange', this.routerChangeHandler)
    eventCenter.on('__taroSwitchTab', this.switchTabHandler)
    eventCenter.on('__taroSetTabBarBadge', this.setTabBarBadgeHandler)
    eventCenter.on('__taroRemoveTabBarBadge', this.removeTabBarBadgeHandler)
    eventCenter.on('__taroShowTabBarRedDotHandler', this.showTabBarRedDotHandler)
    eventCenter.on('__taroHideTabBarRedDotHandler', this.hideTabBarRedDotHandler)
    eventCenter.on('__taroShowTabBar', this.showTabBarHandler)
    eventCenter.on('__taroHideTabBar', this.hideTabBarHandler)
    eventCenter.on('__taroSetTabBarStyle', this.setTabBarStyleHandler)
    eventCenter.on('__taroSetTabBarItem', this.setTabBarItemHandler)
  }

  removeEvent () {
    eventCenter.off('__taroRouterChange', this.routerChangeHandler)
    eventCenter.off('__taroSwitchTab', this.switchTabHandler)
    eventCenter.off('__taroSetTabBarBadge', this.setTabBarBadgeHandler)
    eventCenter.off('__taroRemoveTabBarBadge', this.removeTabBarBadgeHandler)
    eventCenter.off('__taroShowTabBarRedDotHandler', this.showTabBarRedDotHandler)
    eventCenter.off('__taroHideTabBarRedDotHandler', this.hideTabBarRedDotHandler)
    eventCenter.off('__taroShowTabBar', this.showTabBarHandler)
    eventCenter.off('__taroHideTabBar', this.hideTabBarHandler)
    eventCenter.off('__taroSetTabBarStyle', this.setTabBarStyleHandler)
    eventCenter.off('__taroSetTabBarItem', this.setTabBarItemHandler)
  }

  @Builder renderTabBuilder(index: number, item: TabBarItem) {
    Column() {
      if (this.withImage) {
        Image(this.currentIndex === index && item.selectedIconPath || item.iconPath)
          .width(24)
          .height(24)
          .objectFit(ImageFit.Contain)
        Text(item.text)
          .fontColor(this.currentIndex === index ? this.selectedColor : this.color)
          .fontSize(10)
          .fontWeight(this.currentIndex === index ? 500 : 400)
          .lineHeight(14)
          .margin({ top: 7, bottom: 7 })
      } else {
        Text(item.text)
          .fontColor(this.currentIndex === index ? this.selectedColor : this.color)
          .fontSize(16)
          .fontWeight(this.currentIndex === index ? 500 : 400)
          .lineHeight(22)
          .margin({ top: 17, bottom: 7 })
      }
    }.width('100%').height('100%').justifyContent(FlexAlign.Center)
  }` : null,
          `
  build() {
    ${transArr2Str(renderPage(isTabbarPage).split('\n'), 4)}
  }`)

        structCodeArray.push('}')
        let instantiatePage = transArr2Str(structCodeArray)
        if (isFunction(viteCompilerContext.loaderMeta.modifyInstantiate)) {
          instantiatePage = viteCompilerContext.loaderMeta.modifyInstantiate(instantiatePage, 'page')
        }

        const code = transArr2Str([
          'import TaroView from "@tarojs/components/view"',
          `import { createPageConfig, ReactMeta } from '${creatorLocation}'`,
          'import { Current, TaroElement, window } from "@tarojs/runtime"',
          'import { eventCenter } from "@tarojs/runtime/dist/runtime.esm"',
          'import { AppConfig, TabBar, TabBarItem } from "@tarojs/taro"',
          `import component from "${rawId}"`,
          'import router from "@ohos.router"',
          importFrameworkStatement,
          `const config = ${page instanceof Array ? prettyPrintJson(page.map(e => e.config)) : prettyPrintJson(page.config)}`,
          !isTabbarPage && (page as VitePageMeta)?.config.enableShareTimeline ? 'component.enableShareTimeline = true' : null,
          !isTabbarPage && (page as VitePageMeta)?.config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : null,
          '',
          instantiatePage,
        ])
        return code
      }
    },
  }
}

/**
 * TODO: currentIndex
 */
