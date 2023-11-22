import { isFunction } from '@tarojs/shared'
import path from 'path'

import { appendVirtualModulePrefix, prettyPrintJson, stripVirtualModulePrefix, virtualModulePrefixREG } from '../utils'

import type { ViteHarmonyCompilerContext, VitePageMeta } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export const PAGE_SUFFIX = '.ets?page-loader=true'
export const TARO_TABBAR_PAGE_PATH = 'taro_tabbar'

function isEnable (app?: boolean, page?: boolean) {
  if (app && page !== false) {
    return true
  } else if (page) {
    return true
  }
}

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
        console.info('taro-ele' + new Array(level).join('   '), \`<\${res.nodeName} \${attr}>\`)
      })
      tree.childNodes.forEach(child => {
        showTree(child, level+1)
      })
      taskQueen.push(() => {
        console.info('taro-ele' + new Array(level).join('   '), \`</\${res.nodeName}>\`)
      })
    } else {
      taskQueen.push(() => {
        console.info('taro-ele' + new Array(level).join('   '), \`<\${res.nodeName} \${attr}/>\`)
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

function renderPage (isTabPage: boolean, appEnableRefresh = false, enableRefresh = false) {
  let pageStr = `Stack({ alignContent: Alignment.TopStart }) {
  Scroll(${isTabPage ? 'this.scroller[index]' : 'this.scroller'}) {
    Column() {
      TaroView({ node: ${isTabPage ? 'this.node[index]' : 'this.node'} })
    }
  }
  .onScroll(() => {
    if (!this.page) return

    const { xOffset: currentXOffset, yOffset: currentYOffset } = ${isTabPage ? 'this.scroller[index]' : 'this.scroller'}?.currentOffset()
    this.page?.onPageScroll?.call(this, {
      scrollTop: currentYOffset || 0,
      scrollLeft: currentXOffset || 0,
    })
  })
}
.width('100%')
.height('100%')
`

  if (enableRefresh) {
    const enableStr = appEnableRefresh
      ? `this.getConfig(${isTabPage ? 'index' : ''}).enablePullDownRefresh !== false`
      : `this.getConfig(${isTabPage ? 'index' : ''}).enablePullDownRefresh`
    pageStr = `if (${enableStr}) {
  Refresh({ refreshing: ${isTabPage ? 'this.isRefreshing[index]' : 'this.isRefreshing'} }) {
    ${transArr2Str(pageStr.split('\n'), 4)}
  }
  .onStateChange((state) => {
    if (state === RefreshStatus.Refresh) {
      ${isTabPage ? 'this.isRefreshing[index]' : 'this.isRefreshing'} = true
      this.page?.onPullDownRefresh?.call(this)
    } else if (state === RefreshStatus.Done) {
      ${isTabPage ? 'this.isRefreshing[index]' : 'this.isRefreshing'} = false
    } else if (state === RefreshStatus.Drag) {
      this.page?.onPullIntercept?.call(this)
    }
  })
} else {
  ${transArr2Str(pageStr.split('\n'), 2)}
}`
  }

  if (isTabPage) {
    pageStr = `Tabs({
  barPosition: this.position !== 'top' ? BarPosition.End : BarPosition.Start,
  controller: this.controller,
  index: this.currentIndex,
}) {
  ForEach(this.tabBarList, (item, index) => {
    TabContent() {
      ${transArr2Str(pageStr.split('\n'), 6)}
    }.tabBar(this.renderTabItemBuilder(index, item))
  }, (item, index) => item.key || index)
}
.vertical(false)
.barMode(BarMode.Fixed)
.barHeight(this.isTabbarShow ? 56 : 0)
.animationDuration(this.animationDuration)
.onChange((index: number) => {
  if (this.currentIndex !== index) {
    this.page.onHide?.call(this)
    this.setCurrentIndex(index)
  }
  this.handlePageAppear()
  this.page?.onShow?.call(this)
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
      const appConfig = viteCompilerContext.app.config
      const tabbarList = appConfig.tabBar?.list || []
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
        const enableRefresh = isTabbarPage
          ? (page as VitePageMeta[]).some(e => isEnable(appConfig.window?.enablePullDownRefresh, e.config.enablePullDownRefresh))
          : isEnable(appConfig.window?.enablePullDownRefresh, (viteCompilerContext.getPageById(rawId) as VitePageMeta)?.config.enablePullDownRefresh)

        const structCodeArray: unknown[] = [
          '@Entry',
          '@Component',
          'struct Index {',
        ]
        const generateState = [
          'page: PageInstance',
          isTabbarPage
            ? [
              `scroller: Scroller[] = [${
                tabbarList.map(() => 'new Scroller()').join(', ')
              }]`,
              `@State node: TaroElement[] = [${
                tabbarList.map(() => 'new TaroElement("Block")').join(', ')
              }]`,
              enableRefresh
                ? `@State isRefreshing: boolean[] = [${
                  tabbarList.map(() => 'false').join(', ')
                }]`
                : null,
              `@State pageList: PageInstance[] = []`,
            ]
            : [
              'scroller: Scroller = new Scroller()',
              '@State node: TaroElement = new TaroElement("Block")',
              enableRefresh
                ? '@State isRefreshing: boolean = false'
                : null,
            ],
          '@State appConfig: AppConfig = window.__taroAppConfig || {}',
          '@StorageLink("__TARO_PAGE_STACK") pageStack: string[] = []',
        ].flat()
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
    const state = router.getState()
    state.path ||= '${isTabbarPage ? TARO_TABBAR_PAGE_PATH : (page as VitePageMeta).name}'
    if (this.pageStack.length >= state.index) {
      this.pageStack.length = state.index - 1
    }
    this.pageStack.push(state)
    ${isTabbarPage ? `const params = router.getParams() || {}
    let index = params.$page
      ? this.tabBarList.findIndex(e => e.pagePath === params.$page)
      : this.tabBarList.findIndex(e => e.pagePath === this.entryPagePath)
    index = index >= 0 ? index : 0
    this.handlePageAppear(index)
    this.setCurrentIndex(index)
    this.bindEvent()` : 'this.handlePageAppear()'}
  }

  onPageShow () {
    const state = router.getState()
    state.path ||= '${isTabbarPage ? TARO_TABBAR_PAGE_PATH : (page as VitePageMeta).name}'
    if (this.pageStack[this.pageStack.length - 1].path !== state.path) {
      this.pageStack.length = state.index
      this.pageStack[state.index - 1] = state
    }
    ${isTabbarPage ? `this.switchTabHandler({ url: '${TARO_TABBAR_PAGE_PATH}', params: router.getParams() || {} })
    this.pageList?.forEach(item => {
      item?.onShow?.call(this)
    })` : 'this.page?.onShow?.call(this)'}
  }

  onPageHide () {
    ${isTabbarPage ? `this.pageList?.forEach(item => {
      item?.onHide?.call(this)
    })` : 'this.page?.onHide?.call(this)'}
  }

  aboutToDisappear () {
    ${isTabbarPage ? `this.pageList?.forEach(item => {
      item?.onUnLoad?.call(this)
    })
    this.removeEvent()` : 'this.page?.onUnLoad?.call(this)'}
  }`,
          SHOW_TREE ? transArr2Str(showTreeFunc(isTabbarPage).split('\n'), 2) : null,
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
      'if (!this.pageList[index]) {',
      '  const pageName = this.tabBarList[index]?.pagePath',
      '  this.pageList[index] = createPageConfig(component[pageName], pageName, this.getConfig(index))',
      '  this.page = this.pageList[index]',
      '  this.page.onLoad?.call(this, params, (instance) => {',
      '    this.node[index] = instance',
      '  })',
      '}',
    ], 4)
    : transArr2Str([
      `this.page = createPageConfig(component, '${(page as VitePageMeta).name}', config)`,
      'this.page.onLoad?.call(this, params, (instance) => {',
      '  this.node = instance',
      '})',
    ], 4)}
  }

  getConfig(${isTabbarPage ? 'index = this.currentIndex' : ''}) {
    ${isTabbarPage ? `return config[index]` : 'return config'}
  }`,
          isTabbarPage ? `
  setCurrentIndex(index: number) {
    this.currentIndex = index
    this.page = this.pageList[index]
  }

  updateTabBarKey = (index = 0, odd = '') => {
    const obj = this.tabBarList[index]
    if (Object.keys(obj).every(key => odd[key] === obj[key])) return

    const idx = obj.key || index
    const len = this.tabBarList.length
    obj.key = (Math.floor(idx / len) + 1) * len + index
  }

  routerChangeHandler = () => {}

  switchTabHandler = ({ params }) => {
    const index = this.tabBarList.findIndex(e => e.pagePath === params.$page)
    if (index >= 0 && this.currentIndex !== index) {
      this.page.onHide?.call(this)
      this.setCurrentIndex(index)
    }
  }

  setTabBarBadgeHandler = ({ index, text = '' }) => {
    const list = [...this.tabBarList]
    if (index in list) {
      const obj = list[index]
      const odd = { ... obj }
      obj.showRedDot = false
      obj.badgeText = text
      this.updateTabBarKey(index, odd)
    }
    this.tabBarList = list
  }

  removeTabBarBadgeHandler = ({ index }) => {
    const list = [...this.tabBarList]
    if (index in list) {
      const obj = list[index]
      const odd = { ... obj }
      obj.badgeText = null
      this.updateTabBarKey(index, odd)
    }
    this.tabBarList = list
  }

  showTabBarRedDotHandler = ({ index }) => {
    const list = [...this.tabBarList]
    if (index in list) {
      const obj = list[index]
      const odd = { ... obj }
      obj.badgeText = null
      obj.showRedDot = true
      this.updateTabBarKey(index, odd)
    }
    this.tabBarList = list
  }

  hideTabBarRedDotHandler = ({ index }) => {
    const list = [...this.tabBarList]
    if (index in list) {
      const obj = list[index]
      const odd = { ... obj }
      obj.showRedDot = false
      this.updateTabBarKey(index, odd)
    }
    this.tabBarList = list
  }

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

  setTabBarStyleHandler = ({ backgroundColor, borderStyle, color, selectedColor }) => {
    if (backgroundColor) this.backgroundColor = backgroundColor
    if (borderStyle) this.borderStyle = borderStyle
    if (color) this.color = color
    if (selectedColor) this.selectedColor = selectedColor
  }

  setTabBarItemHandler = ({ index, iconPath, selectedIconPath, text }) => {
    const list = [...this.tabBarList]
    if (index in list) {
      const obj = list[index]
      const odd = { ... obj }
      if (iconPath) {
        obj.iconPath = iconPath
        this.withImage = true
      }
      if (selectedIconPath) obj.selectedIconPath = selectedIconPath
      if (text) obj.text = text
      this.updateTabBarKey(index, odd)
    }
    this.tabBarList = list
  }

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

  @Builder renderTabBarInnerBuilder(index: number, item: TabBarItem) {
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
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .margin({ top: 7, bottom: 7 })
      } else {
        Text(item.text)
          .fontColor(this.currentIndex === index ? this.selectedColor : this.color)
          .fontSize(16)
          .fontWeight(this.currentIndex === index ? 500 : 400)
          .lineHeight(22)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .margin({ top: 17, bottom: 7 })
      }
    }
  }

  @Builder renderTabItemBuilder(index: number, item: TabBarItem) {
    Column() {
      if (!!item.badgeText || item.showRedDot) {
        Badge({
          value: item.badgeText || '',
          position: BadgePosition.RightTop,
          style: {
            badgeSize: !!item.badgeText ? 16 : 6,
            badgeColor: Color.Red,
          }
        }) {
          this.renderTabBarInnerBuilder(index, item)
        }
      } else {
        this.renderTabBarInnerBuilder(index, item)
      }
    }
    .margin({ top: 4 })
    .width('100%').height('100%')
    .justifyContent(FlexAlign.SpaceEvenly)
  }` : null,
          `
  build() {
    ${transArr2Str(renderPage(isTabbarPage, appConfig.window?.enablePullDownRefresh, enableRefresh).split('\n'), 4)}
  }`)

        structCodeArray.push('}')
        let instantiatePage = transArr2Str(structCodeArray)
        if (isFunction(viteCompilerContext.loaderMeta.modifyInstantiate)) {
          instantiatePage = viteCompilerContext.loaderMeta.modifyInstantiate(instantiatePage, 'page')
        }

        const code = transArr2Str([
          'import TaroView from "@tarojs/components/view"',
          `import { createPageConfig, ReactMeta } from '${creatorLocation}'`,
          'import { Current, PageInstance, TaroElement, window } from "@tarojs/runtime"',
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
