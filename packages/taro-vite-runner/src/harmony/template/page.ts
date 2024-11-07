import path from 'node:path'

import { isFunction } from '@tarojs/shared'

import { escapePath, resolveAbsoluteRequire } from '../../utils'
import { TARO_COMP_SUFFIX } from '../entry'
import { TARO_TABBAR_PAGE_PATH } from '../page'
import BaseParser from './base'

import type { AppConfig, TabBarItem } from '@tarojs/taro'
import type { TRollupResolveMethod } from '@tarojs/taro/types/compile/config/plugin'
import type { ViteHarmonyBuildConfig, VitePageMeta } from '@tarojs/taro/types/compile/viteCompilerContext'

export interface IMethod {
  name: string
  decorators?: string[]
  prefix?: string
  type?: 'function' | 'arrow' | 'method' | 'async function' | 'async arrow' | 'async method'
  params?: string[] | false
  return?: string
  body?: string
}

export interface TaroHarmonyPageMeta extends VitePageMeta {
  id: string
  originName: string
  entryOption?: Record<string, unknown>

  modifyRenderState?: (this: Parser, state: (string | null)[], page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) => void

  modifyPageParams?: (this: Parser, paramsString: string, page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) => string

  modifyPageImport?: (this: Parser, importStr: string[], page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) => void

  modifyPageAppear?: (this: Parser, appearStr: string, page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) => string

  modifyPageDisappear?: (this: Parser, appearStr: string, page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) => string

  modifyPageBuild?: (this: Parser, buildStr: string, page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) => string

  modifyPageMethods?: (this: Parser, methods: IMethod[], page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) => void
}

const SHOW_TREE = false

export default class Parser extends BaseParser {
  isTabbarPage: boolean
  enableRefresh: number // 0: false, 1: true, 2: part
  tabbarList: TabBarItem[]

  #setReconciler = ''
  #setReconcilerPost = ''

  constructor (
    protected appPath: string,
    protected appConfig: AppConfig,
    public buildConfig: ViteHarmonyBuildConfig,
    public loaderMeta: Record<string, unknown>,
    public isPure?: boolean
  ) {
    super()
    this.init()
  }

  init () {
    this.tabbarList = this.appConfig.tabBar?.list || []

    const runtimePath = Array.isArray(this.buildConfig.runtimePath) ? this.buildConfig.runtimePath : [this.buildConfig.runtimePath]
    this.#setReconciler = runtimePath.reduce((res, item) => {
      if (item && /^post:/.test(item)) {
        this.#setReconcilerPost += `import '${item.replace(/^post:/, '')}'\n`
        return res
      } else {
        return res + `import '${item}'\n`
      }
    }, '') || ''
  }

  getInitPxTransform () {
    return super.getInitPxTransform(this.buildConfig)
  }

  isEnable (app?: boolean, page?: boolean) {
    if (app && page !== false) return true
    return !!page
  }

  renderState ({
    scope = ['page', 'tabbar'],
    decorator = '',
    name = '',
    type = '',
    prefix = '',
    suffix = '',
    connector = ', ',
    foreach = (_item: unknown, _idx: number | string) => '',
    disabled = false,
  },
  isTabPage: boolean,
  ) {
    if (disabled || scope.length < 1) return null

    if (scope.includes('tabbar') && isTabPage) {
      return `${decorator ? `@${decorator} ` : ''}${name}: ${type}[] = [${prefix}${this.tabbarList.map(foreach).filter(e => e.length).join(connector)}${suffix}]`
    }
    if (scope.includes('page')) {
      return `${decorator ? `@${decorator} ` : ''}${name}: ${type} = ${prefix}${foreach(null, '')}${suffix}`
    }
    return null
  }

  renderMethods (methods: IMethod[]) {
    return methods.map((method, index) => {
      const { name = '', decorators = [], params = [], body, prefix = '', type = 'method' } = method
      if (!name || methods.findIndex(e => e.name === name) !== index) {
        console.warn(`Taro(PageParser): Method name is empty or duplicate: ${name}`)
        return null
      }

      const decoratorStr = decorators.length > 0 ? `${decorators.map(e => `@${e}`).join('\n')}\n` : ''
      const prefixSrc = `${decoratorStr}${prefix ? `${prefix} ` : ''}`
      const paramStr = params ? `${params.join(', ')}` : ''
      const promiseSymbol = type.includes('async') ? 'async ' : ''
      const returnStr = method.return ? `: ${method.return}` : ''

      if (/\bfunction\b/.test(type)) {
        return `${prefixSrc}${name}: ${promiseSymbol}function (${paramStr})${returnStr} {${body ? `\n${this.transArr2Str(body.split('\n'), 2)}\n` : ''}}`
      } else if (/\barrow\b/.test(type)) {
        return `${prefixSrc}${name} = ${promiseSymbol}(${paramStr})${returnStr} => {${body ? `\n${this.transArr2Str(body.split('\n'), 2)}\n` : ''}}`
      } else {
        return `${prefixSrc}${promiseSymbol}${name} (${paramStr})${returnStr}${body ? ` {\n${this.transArr2Str(body.split('\n'), 2)}\n}` : ''}`
      }
    }).join('\n\n')
  }

  getInstantiatePage (page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) {
    const entryOption = page instanceof Array ? page[0].entryOption : page.entryOption
    const { modifyInstantiate } = this.loaderMeta
    const structCodeArray: unknown[] = [
      '@Component',
      `${this.buildConfig.isBuildNativeComp ? 'export default ' : ''}struct Index {`,
    ]

    // 如果是编译成原生组件，则不需要加 @Entry 头部，否则都加上 @Entry，当成 Page 入口
    if (!this.buildConfig.isBuildNativeComp) {
      structCodeArray.unshift('@Entry')
    } else if (entryOption) {
      structCodeArray.unshift(`@Entry(${this.prettyPrintJson(page instanceof Array ? TARO_TABBAR_PAGE_PATH : entryOption)})`)
    }

    const generateState = [
      this.renderState({
        name: 'scroller', type: 'Scroller', foreach: () => 'new Scroller()', disabled: this.buildConfig.isBuildNativeComp
      }, this.isTabbarPage),
      'page?: PageInstance',
      'onReady?: TaroAny',
      this.renderState({
        decorator: 'State', name: 'pageList', type: 'PageInstance', scope: ['tabbar'], disabled: this.buildConfig.isBuildNativeComp
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'State', name: 'node', type: '(TaroElement | null)', foreach: () => 'null'
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'State', name: 'layerNode', type: '(TaroElement | null)', foreach: () => 'null'
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'State', name: 'isRefreshing', type: 'boolean', foreach: () => 'false', disabled: this.enableRefresh === 0
      }, this.isTabbarPage),
      // Note: 仅普通页面包含 Home 按钮
      this.renderState({
        decorator: 'State', name: 'navigationBarHomeBtn', type: 'boolean', foreach: () => 'true', scope: ['page'], disabled: this.buildConfig.isBuildNativeComp && !entryOption
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'State', name: 'navigationBarLoading', type: 'boolean', foreach: () => 'false', disabled: this.buildConfig.isBuildNativeComp && !entryOption
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'State', name: 'navigationBarBackgroundColor', type: 'string', foreach: (_, i) => `config${i}.navigationBarBackgroundColor`, disabled: this.buildConfig.isBuildNativeComp && !entryOption
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'State', name: 'navigationBarTextStyle', type: 'string', foreach: (_, i) => `config${i}.navigationBarTextStyle`, disabled: this.buildConfig.isBuildNativeComp && !entryOption
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'State', name: 'navigationBarTitleText', type: 'string', foreach: (_, i) => `config${i}.navigationBarTitleText`, disabled: this.buildConfig.isBuildNativeComp && !entryOption
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'State', name: 'pageBackgroundColor', type: 'string', foreach: (_, i) => `config${i}.backgroundColor`, disabled: this.buildConfig.isBuildNativeComp && !entryOption
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'State', name: 'pageBackgroundContentColor', type: 'string', foreach: (_, i) => `config${i}.backgroundColorContent`, disabled: this.buildConfig.isBuildNativeComp && !entryOption
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'State', name: 'props', type: 'TaroObject', foreach: () => '{}', disabled: !this.buildConfig.isBuildNativeComp
      }, this.isTabbarPage),
      this.renderState({
        decorator: 'StorageLink("__TARO_PAGE_STACK")', name: 'pageStack', type: 'router.RouterState[]', foreach: () => '[]', disabled: this.buildConfig.isBuildNativeComp
      }, false),
      this.renderState({
        decorator: 'StorageProp("__TARO_ENTRY_PAGE_PATH")', name: 'entryPagePath', type: 'string', foreach: () => '""', disabled: this.buildConfig.isBuildNativeComp
      }, false),
      this.renderState({
        decorator: 'State', name: 'appConfig', type: 'Taro.AppConfig', foreach: () => 'window.__taroAppConfig || {}', disabled: this.buildConfig.isBuildNativeComp
      }, false),
      this.renderState({
        decorator: 'State', name: 'tabBarList', type: `${this.isTabbarPage ? 'ITabBarItem' : 'Taro.TabBarItem'}[]`, foreach: () => 'this.appConfig.tabBar?.list || []', disabled: this.buildConfig.isBuildNativeComp
      }, false),
    ].filter(item => item !== '').flat()

    if (this.isTabbarPage) {
      generateState.push(
        '@State isTabBarShow: boolean = true',
        '@State tabBar: Partial<Taro.TabBar> = this.appConfig.tabBar || {}',
        '@State tabBarColor: string = this.tabBar.color || "#7A7E83"',
        '@State tabBarSelectedColor: string = this.tabBar.selectedColor || "#3CC51F"',
        '@State tabBarBackgroundColor: string = this.tabBar.backgroundColor || "#FFFFFF"',
        '@State tabBarBorderStyle: "white" | "black" = this.tabBar.borderStyle || "black"',
        '@State tabBarPosition: "top" | "bottom" = this.tabBar.position || "bottom"',
        '@State tabBarWithImage: boolean = this.tabBarList.every(e => !!e.iconPath)',
        '@State tabBarAnimationDuration: number = 400',
        '@State tabBarCurrentIndex: number = 0',
        'private tabBarController: TabsController = new TabsController()',
      )
    }

    const modifyPageBuild = page instanceof Array ? page[0].modifyPageBuild : page.modifyPageBuild
    const modifyRenderState = page instanceof Array ? page[0].modifyRenderState : page.modifyRenderState
    const modifyPageMethods = page instanceof Array ? page[0].modifyPageMethods : page.modifyPageMethods

    if (isFunction(modifyRenderState)) {
      modifyRenderState.call(this, generateState, page)
    }

    // 生成 build 函数内容
    let buildStr = this.renderPage(
      this.isTabbarPage,
      this.appConfig.window?.enablePullDownRefresh,
      this.enableRefresh,
    )

    if (isFunction(modifyPageBuild)) {
      buildStr = modifyPageBuild.call(this, buildStr, page)
    }

    const generateMethods: IMethod[] = [{
      name: 'getPageState',
      body: `const state = router.getState()
state.path ||= '${this.isTabbarPage ? TARO_TABBAR_PAGE_PATH : (page as TaroHarmonyPageMeta).name}'
if (state.path.endsWith('/')) {
state.path += 'index'
}
return state`,
    },
    {
      name: 'aboutToAppear',
      body: this.generatePageAboutToAppear(page),
    },
    {
      name: 'aboutToDisappear',
      body: this.generatePageAboutToDisAppear(page)
    },
    {
      name: 'handlePageAppear',
      params: this.isTabbarPage ? ['index = this.tabBarCurrentIndex'] : [],
      body: this.generatePageHandleAppear(page),
    }]

    if (this.buildConfig.isBuildNativeComp && !entryOption) {
      const idx = generateMethods.findIndex(e => e.name === 'getPageState')
      generateMethods.splice(idx, 1)
    } else {
      generateMethods.push({
        name: 'onPageShow',
        body: this.generatePageShown(),
      },
      {
        name: 'onPageHide',
        body: this.generatePageHidden(),
      }, {
        name: 'handleNavigationStyle',
        type: 'arrow',
        params: ['option: TaroObject'],
        body: this.transArr2Str([
          `if (option.title) this.navigationBarTitleText${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} = option.title`,
          `if (option.backgroundColor) this.navigationBarBackgroundColor${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} = option.backgroundColor || '#000000'`,
          `if (option.frontColor) this.navigationBarTextStyle${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} = option.frontColor || 'white'`,
          this.isTabbarPage
            ? null
            : `if (typeof option.home === 'boolean') this.navigationBarHomeBtn = option.home`,
          `if (typeof option.loading === 'boolean') this.navigationBarLoading${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} = option.loading`,
        ]),
      }, {
        name: 'handlePageStyle',
        type: 'arrow',
        params: ['option: TaroObject'],
        body: this.transArr2Str([
          // TODO backgroundTextStyle
          `if (option.backgroundColor) this.pageBackgroundColor${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} = option.backgroundColor || '#FFFFFF'`,
          `if (option.backgroundColorContext) this.pageBackgroundContentColor${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} = option.backgroundColorContext || '#FFFFFF'`,
        ]),
      }, {
        name: 'bindPageEvent',
        body: this.transArr2Str([
          `eventCenter?.on('__taroNavigationStyle', this.handleNavigationStyle)`,
          `eventCenter?.on('__taroPageStyle', this.handlePageStyle)`,
        ]),
      }, {
        name: 'removePageEvent',
        body: this.transArr2Str([
          `eventCenter?.off('__taroNavigationStyle', this.handleNavigationStyle)`,
          `eventCenter?.off('__taroPageStyle', this.handlePageStyle)`,
        ]),
      }, {
        decorators: ['Builder'],
        name: 'renderTitle',
        body: `Flex({
  direction: FlexDirection.Row,
  justifyContent: FlexAlign.Start,
  alignItems: ItemAlign.Center,
}) {${!this.isTabbarPage && !this.buildConfig.isBuildNativeComp
  // FIXME 这里 pageStack 更新问题，需要第二次才能显示 Home 按钮
    ? `if (this.pageStack[0].path !== this.entryPagePath && this.navigationBarHomeBtn && this.pageStack.length === 1) {
    Image($r('app.media.taro_home'))
      .height(convertNumber2VP(40 / 7.5, 'vw'))
      .width(convertNumber2VP(40 / 7.5, 'vw'))
      .margin({ left: convertNumber2VP(40 / 7.5, 'vw'), right: convertNumber2VP(-20 / 7.5, 'vw') })
      .fillColor((this.navigationBarTextStyle || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)
      .objectFit(ImageFit.Contain)
      .onClick(() => {
        router.replaceUrl({
          url: this.tabBarList.find(e => e.pagePath === this.entryPagePath) ? '${TARO_TABBAR_PAGE_PATH}' : this.entryPagePath,
          params: {
            '$page': this.entryPagePath,
          },
        })
      })
  } else if (this.pageStack.length > 1) {
    Image($r('app.media.taro_arrow_left'))
      .height(convertNumber2VP(40 / 7.5, 'vw'))
      .width(convertNumber2VP(40 / 7.5, 'vw'))
      .margin({ left: convertNumber2VP(40 / 7.5, 'vw'), right: convertNumber2VP(-20 / 7.5, 'vw') })
      .fillColor((this.navigationBarTextStyle || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)
      .objectFit(ImageFit.Contain)
      .onClick(() => {
        router.back()
      })
  }` : ''}
  Text(this.navigationBarTitleText${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} || '${this.appConfig.window?.navigationBarTitleText || ''}')
    .margin({ left: convertNumber2VP(40 / 7.5, 'vw') })
    .fontSize(convertNumber2VP(32 / 7.5, 'vw'))
    .fontColor((this.navigationBarTextStyle${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)
  if (this.navigationBarLoading${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''}) {
    LoadingProgress()
      .margin({ left: convertNumber2VP(10 / 7.5, 'vw') })
      .height(convertNumber2VP(40 / 7.5, 'vw'))
      .width(convertNumber2VP(40 / 7.5, 'vw'))
      .color((this.navigationBarTextStyle${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)
  }
}
.height('100%')
.width('100%')
.backgroundColor(this.navigationBarBackgroundColor${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} || '${this.appConfig.window?.navigationBarBackgroundColor || '#000000'}')
.padding({
  top: px2vp(sysInfo.safeArea?.top || 0),
})
.zIndex(1)`,
      })

      if (this.isTabbarPage) {
        generateMethods.push({
          name: 'setTabBarCurrentIndex',
          type: 'arrow',
          params: ['index: number'],
          body: this.transArr2Str([
            'this.tabBarCurrentIndex = index',
            'this.page = this.pageList[index]',
          ]),
        }, {
          name: 'updateTabBarKey',
          type: 'arrow',
          params: ['index = 0', 'odd: TaroAny = {}'],
          body: this.transArr2Str([
            `const obj: TaroAny = this.tabBarList[index]`,
            `if (Object.keys(obj).every(key => odd[key] === obj[key])) return`,
            '',
            `const idx: TaroAny = obj.key || index`,
            `const len = this.tabBarList.length`,
            `obj.key = (Math.floor(idx / len) + 1) * len + index`,
          ]),
        }, {
          name: 'handleSwitchTab',
          type: 'arrow',
          params: ['option: TaroObject'],
          body: this.transArr2Str([
            `const index = this.tabBarList.findIndex(e => e.pagePath === option.params.$page)`,
            `if (index >= 0 && this.tabBarCurrentIndex !== index) {`,
            `  this.page?.onHide?.()`,
            `  this.setTabBarCurrentIndex(index)`,
            `}`,
          ]),
        }, {
          name: 'handleSetTabBarBadge',
          type: 'arrow',
          params: ['option: TaroObject'],
          body: this.transArr2Str([
            `const list = [...this.tabBarList]`,
            `if (!!list[option.index]) {`,
            `  const obj = list[option.index]`,
            `  const odd: ITabBarItem = ObjectAssign(obj)`,
            `  obj.showRedDot = false`,
            `  obj.badgeText = option.text`,
            `  this.updateTabBarKey(option.index, odd)`,
            `}`,
            `this.tabBarList = list`,
          ]),
        }, {
          name: 'handleRemoveTabBarBadge',
          type: 'arrow',
          params: ['option: TaroObject'],
          body: this.transArr2Str([
            `const list = [...this.tabBarList]`,
            `if (!!list[option.index]) {`,
            `  const obj = list[option.index]`,
            `  const odd: ITabBarItem = ObjectAssign(obj)`,
            `  obj.badgeText = undefined`,
            `  this.updateTabBarKey(option.index, odd)`,
            `}`,
            `this.tabBarList = list`,
          ]),
        }, {
          name: 'handleShowTabBarRedDot',
          type: 'arrow',
          params: ['option: TaroObject'],
          body: this.transArr2Str([
            `const list = [...this.tabBarList]`,
            `if (!!list[option.index]) {`,
            `  const obj = list[option.index]`,
            `  const odd: ITabBarItem = ObjectAssign(obj)`,
            `  obj.badgeText = undefined`,
            `  obj.showRedDot = true`,
            `  this.updateTabBarKey(option.index, odd)`,
            `}`,
            `this.tabBarList = list`,
          ]),
        }, {
          name: 'handleHideTabBarRedDot',
          type: 'arrow',
          params: ['option: TaroObject'],
          body: this.transArr2Str([
            `const list = [...this.tabBarList]`,
            `if (!!list[option.index]) {`,
            `  const obj = list[option.index]`,
            `  const odd: ITabBarItem = ObjectAssign(obj)`,
            `  obj.showRedDot = false`,
            `  this.updateTabBarKey(option.index, odd)`,
            `}`,
            `this.tabBarList = list`,
          ]),
        }, {
          name: 'handleShowTabBar',
          type: 'arrow',
          params: ['option: TaroObject'],
          body: this.transArr2Str([
            `if (option.animation) {`,
            `  animateTo({`,
            `    duration: this.tabBarAnimationDuration,`,
            `    tempo: 1,`,
            `    playMode: PlayMode.Normal,`,
            `    iterations: 1,`,
            `  }, () => {`,
            `    this.isTabBarShow = true`,
            `  })`,
            `} else {`,
            `  this.isTabBarShow = true`,
            `}`,
          ]),
        }, {
          name: 'handleHideTabBar',
          type: 'arrow',
          params: ['option: TaroObject'],
          body: this.transArr2Str([
            `if (option.animation) {`,
            `  animateTo({`,
            `    duration: this.tabBarAnimationDuration,`,
            `    tempo: 1,`,
            `    playMode: PlayMode.Normal,`,
            `    iterations: 1,`,
            `  }, () => {`,
            `    this.isTabBarShow = false`,
            `  })`,
            `} else {`,
            `  this.isTabBarShow = false`,
            `}`,
          ]),
        }, {
          name: 'handleSetTabBarStyle',
          type: 'arrow',
          params: ['option: TaroObject'],
          body: this.transArr2Str([
            `if (option.backgroundColor) this.tabBarBackgroundColor = option.backgroundColor`,
            `if (option.borderStyle) this.tabBarBorderStyle = option.borderStyle`,
            `if (option.color) this.tabBarColor = option.color`,
            `if (option.selectedColor) this.tabBarSelectedColor = option.selectedColor`,
          ]),
        }, {
          name: 'handleSetTabBarItem',
          type: 'arrow',
          params: ['option: TaroObject'],
          body: this.transArr2Str([
            `const list = [...this.tabBarList]`,
            `if (!!list[option.index]) {`,
            `  const obj = list[option.index]`,
            `  const odd: ITabBarItem = ObjectAssign(obj)`,
            `  if (option.iconPath) {`,
            `    obj.iconPath = option.iconPath`,
            `    this.tabBarWithImage = true`,
            `  }`,
            `  if (option.selectedIconPath) obj.selectedIconPath = option.selectedIconPath`,
            `  if (option.text) obj.text = option.text`,
            `  this.updateTabBarKey(option.index, odd)`,
            `}`,
            `this.tabBarList = list`,
          ]),
        }, {
          name: 'bindTabBarEvent',
          body: this.transArr2Str([
            `eventCenter.on('__taroSwitchTab', this.handleSwitchTab)`,
            `eventCenter.on('__taroSetTabBarBadge', this.handleSetTabBarBadge)`,
            `eventCenter.on('__taroRemoveTabBarBadge', this.handleRemoveTabBarBadge)`,
            `eventCenter.on('__taroShowTabBarRedDotHandler', this.handleShowTabBarRedDot)`,
            `eventCenter.on('__taroHideTabBarRedDotHandler', this.handleHideTabBarRedDot)`,
            `eventCenter.on('__taroShowTabBar', this.handleShowTabBar)`,
            `eventCenter.on('__taroHideTabBar', this.handleHideTabBar)`,
            `eventCenter.on('__taroSetTabBarStyle', this.handleSetTabBarStyle)`,
            `eventCenter.on('__taroSetTabBarItem', this.handleSetTabBarItem)`,
          ]),
        }, {
          name: 'removeTabBarEvent',
          body: this.transArr2Str([
            `eventCenter.off('__taroSwitchTab', this.handleSwitchTab)`,
            `eventCenter.off('__taroSetTabBarBadge', this.handleSetTabBarBadge)`,
            `eventCenter.off('__taroRemoveTabBarBadge', this.handleRemoveTabBarBadge)`,
            `eventCenter.off('__taroShowTabBarRedDotHandler', this.handleShowTabBarRedDot)`,
            `eventCenter.off('__taroHideTabBarRedDotHandler', this.handleHideTabBarRedDot)`,
            `eventCenter.off('__taroShowTabBar', this.handleShowTabBar)`,
            `eventCenter.off('__taroHideTabBar', this.handleHideTabBar)`,
            `eventCenter.off('__taroSetTabBarStyle', this.handleSetTabBarStyle)`,
            `eventCenter.off('__taroSetTabBarItem', this.handleSetTabBarItem)`,
          ]),
        }, {
          decorators: ['Builder'],
          name: 'renderTabBarInnerBuilder',
          params: ['index: number', 'item: ITabBarItem'],
          body: this.transArr2Str([
            'Column() {',
            '  if (this.tabBarWithImage) {',
            '    Image(this.tabBarCurrentIndex === index && item.selectedIconPath || item.iconPath)',
            '      .width(24)',
            '      .height(24)',
            '      .objectFit(ImageFit.Contain)',
            '    Text(item.text)',
            '      .fontColor(this.tabBarCurrentIndex === index ? this.tabBarSelectedColor : this.tabBarColor)',
            '      .fontSize(10)',
            '      .fontWeight(this.tabBarCurrentIndex === index ? 500 : 400)',
            '      .lineHeight(14)',
            '      .maxLines(1)',
            '      .textOverflow({ overflow: TextOverflow.Ellipsis })',
            '      .margin({ top: 7, bottom: 7 })',
            '  } else {',
            '    Text(item.text)',
            '      .fontColor(this.tabBarCurrentIndex === index ? this.tabBarSelectedColor : this.tabBarColor)',
            '      .fontSize(16)',
            '      .fontWeight(this.tabBarCurrentIndex === index ? 500 : 400)',
            '      .lineHeight(22)',
            '      .maxLines(1)',
            '      .textOverflow({ overflow: TextOverflow.Ellipsis })',
            '      .margin({ top: 17, bottom: 7 })',
            '  }',
            '}',
          ]),
        }, {
          decorators: ['Builder'],
          name: 'renderTabItemBuilder',
          params: ['index: number', 'item: ITabBarItem'],
          body: this.transArr2Str([
            'Column() {',
            '  if (!!item.badgeText || item.showRedDot) {',
            '    Badge({',
            '      value: item.badgeText || "",',
            '      position: BadgePosition.RightTop,',
            '      style: {',
            '        badgeSize: !!item.badgeText ? 16 : 6,',
            '        badgeColor: Color.Red,',
            '      }',
            '    }) {',
            '      this.renderTabBarInnerBuilder(index, item)',
            '    }',
            '  } else {',
            '    this.renderTabBarInnerBuilder(index, item)',
            '  }',
            '}',
            '.margin({ top: 4 })',
            '.width("100%").height("100%")',
            '.justifyContent(FlexAlign.SpaceEvenly)',
          ]),
        })
      }
    }

    if (this.enableRefresh) {
      const params = ['state: RefreshStatus']
      if (this.isTabbarPage) {
        params.unshift('index = this.tabBarCurrentIndex')
      }
      generateMethods.push({
        name: 'handleRefreshStatus',
        params,
        body: this.transArr2Str([
          `if (state === RefreshStatus.Refresh) {`,
          `  ${this.isTabbarPage ? 'this.isRefreshing[index]' : 'this.isRefreshing'} = true`,
          `  callFn(this.page?.onPullDownRefresh, this)`,
          `} else if (state === RefreshStatus.Done) {`,
          `  ${this.isTabbarPage ? 'this.isRefreshing[index]' : 'this.isRefreshing'} = false`,
          `} else if (state === RefreshStatus.Drag) {`,
          `  callFn(this.page?.onPullIntercept, this)`,
          `}`,
        ]),
      })
    }

    if (SHOW_TREE) {
      generateMethods.push({
        name: 'handleTree',
        params: ['tree: TaroNode | null', 'level = 1', 'taskQueen: TFunc[] = []'],
        body: `if (!tree) return

const res: Record<string, string> = {}
Object.keys(tree).forEach(k => {
  const item: TaroAny = tree[k]
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
    this.handleTree(child, level + 1, taskQueen)
  })
  taskQueen.push(() => {
    console.info('taro-ele' + new Array(level).join('   '), \`</\${res.nodeName}>\`)
  })
} else {
  taskQueen.push(() => {
    console.info('taro-ele' + new Array(level).join('   '), \`<\${res.nodeName} \${attr}/>\`)
  })
}`,
      }, {
        name: 'showTree',
        type: 'async arrow',
        body: `const taskQueen: TFunc[] = []

this.handleTree(this.node${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''}, 1, taskQueen)
for (let i = 0; i < taskQueen.length; i++) {
  taskQueen[i]()
  await new Promise<void>((resolve) => setTimeout(resolve, 16))
}`,
      })
    }

    if (isFunction(modifyPageMethods)) {
      modifyPageMethods.call(this, generateMethods, page)
    }

    generateMethods.push({
      name: 'build',
      body: buildStr,
    })

    structCodeArray.push(
      this.transArr2Str(generateState, 2),
      '',
      this.transArr2Str(this.renderMethods(generateMethods).split('\n'), 2),
    )

    structCodeArray.push('}', '')

    let instantiatePage = this.transArr2Str(structCodeArray)
    if (isFunction(modifyInstantiate)) {
      instantiatePage = modifyInstantiate.call(this, instantiatePage, 'page', page)
    }

    return instantiatePage
  }

  generatePageHandleAppear (page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) {
    let paramsString = 'router.getParams() as Record<string, string> || {}'

    const modifyPageParams = page instanceof Array ? page[0].modifyPageParams : page.modifyPageParams
    if (isFunction(modifyPageParams)) {
      paramsString = modifyPageParams.call(this, paramsString, page)
    }

    return `${this.buildConfig.isBuildNativeComp ? '' : `if (${this.appConfig.window?.navigationStyle === 'custom'
      ? `config${this.isTabbarPage ? '[index]' : ''}.navigationStyle !== 'default'`
      : `config${this.isTabbarPage ? '[index]' : ''}.navigationStyle === 'custom'`}) {
  Current.contextPromise
    .then((context: common.BaseContext) => {
      const win = window.__ohos.getLastWindow(context)
      win.then(mainWindow => {${this.buildConfig.isBuildNativeComp ? '' : `
        mainWindow.setFullScreen(true)
        mainWindow.setSystemBarEnable(["status", "navigation"])
    })
  })`}
}\n`}
const params = ${paramsString}
${this.isTabbarPage
    ? `this.pageList ||= []
if (!this.pageList[index]) {
  this.pageList[index] = createComponent[index]()
  this.page = this.pageList[index]
  callFn(this.page?.onLoad, this, params, (instance: TaroElement) => {
    this.node[index] = instance
  })
  callFn(this.page?.onReady, this, params)
}
`
    : `this.page = createComponent()
this.onReady = bindFn(this.page?.onReady, this.page)
callFn(this.page?.onLoad, this, params, (instance: TaroElement) => {
  this.node = instance
})
callFn(this.page?.onReady, this, params)`
}`
  }

  renderPage (isTabPage: boolean, appEnableRefresh = false, enableRefresh = 0) {
    const isCustomNavigationBar = this.appConfig.window?.navigationStyle === 'custom'
    let pageStr = ''
    if (this.buildConfig.isBuildNativeComp) {
      return `if (this.node) {
  TaroView({ node: this.node as TaroViewElement, createLazyChildren: createLazyChildren })
  if (${isTabPage ? 'this.layerNode[index]' : 'this.layerNode'}) {
    Stack() {
      createLazyChildren(${isTabPage ? 'this.layerNode[index]' : 'this.layerNode'} as TaroElement, 1)
    }
    .position({ x: 0, y: 0 })
    .height('100%')
    .width('100%')
    .responseRegion({ x: 0, y: 0, width: 0, height: 0 })
  }
}`
    }

    pageStr = `Scroll(${isTabPage ? 'this.scroller[index]' : 'this.scroller'}) {
  Column() {
    if (${isTabPage ? 'this.node[index]' : 'this.node'}) {
      TaroView({ node: ${isTabPage ? 'this.node[index]' : 'this.node'} as TaroViewElement, createLazyChildren: createLazyChildren })
      if (${isTabPage ? 'this.layerNode[index]' : 'this.layerNode'}) {
        Stack() {
          createLazyChildren(${isTabPage ? 'this.layerNode[index]' : 'this.layerNode'} as TaroElement, 1)
        }
        .position({ x: 0, y: 0 })
        .height('100%')
        .width('100%')
        .responseRegion({ x: 0, y: 0, width: 0, height: 0 })
      }
    }
  }
  .width('100%')
  .alignItems(HorizontalAlign.Start)
  .constraintSize({
    minHeight: '100%',
  })
  .onAreaChange((_: Area, area: Area) => {
    const node: TaroElement | null = ${isTabPage ? 'this.node[index]' : 'this.node'}
    if (node) {
      node._nodeInfo._scroll = area
    }
  })
}
.backgroundColor(${isTabPage ? 'this.pageBackgroundContentColor[index] || this.pageBackgroundColor[index]' : 'this.pageBackgroundContentColor || this.pageBackgroundColor'} || "${this.appConfig.window?.backgroundColorContent || this.appConfig.window?.backgroundColor || '#FFFFFF'}")
.clip(false)
.height('100%')
.scrollBar(typeof config${isTabPage ? '[index]' : ''}.enableScrollBar === 'boolean' ? config${isTabPage ? '[index]' : ''}.enableScrollBar : ${!this.appConfig.window?.enableScrollBar ? 'false' : 'true'})
.onAreaChange((_: Area, area: Area) => {
  const node: TaroElement | null = ${isTabPage ? 'this.node[index]' : 'this.node'}
  if (node) {
    node._nodeInfo._client = area
  }
})
.onDidScroll(() => {
  if (!this.page) return

  const offset: TaroObject = ${isTabPage ? 'this.scroller[index]' : 'this.scroller'}?.currentOffset()
  callFn(this.page?.onPageScroll, this, {
    scrollTop: offset.xOffset || 0,
    scrollLeft: offset.yOffset || 0,
  })
})
.onScrollStop(() => {
  if (!this.page) return

  const offset: TaroObject = ${isTabPage ? 'this.scroller[index]' : 'this.scroller'}?.currentOffset()
  const distance: number = config${isTabPage ? '[index]' : ''}.onReachBottomDistance || ${this.appConfig.window?.onReachBottomDistance || 50}
  const clientHeight: number = Number(this.node${isTabPage ? '[index]' : ''}?._nodeInfo?._client?.height) || 0
  const scrollHeight: number = Number(this.node${isTabPage ? '[index]' : ''}?._nodeInfo?._scroll?.height) || 0
  if (scrollHeight - clientHeight - offset.yOffset <= distance) {
    callFn(this.page?.onReachBottom, this)
  }
})`

    if (isTabPage && enableRefresh > 1) {
      pageStr = `if (${appEnableRefresh
        ? `config${isTabPage ? '[index]' : ''}.enablePullDownRefresh !== false`
        : `config${isTabPage ? '[index]' : ''}.enablePullDownRefresh`}) {
  Refresh({ refreshing: ${isTabPage ? 'this.isRefreshing[index]' : 'this.isRefreshing'} }) {
${this.transArr2Str(pageStr.split('\n'), 4)}
  }
  .onStateChange(bindFn(this.handleRefreshStatus, this, index))
} else {
${this.transArr2Str(pageStr.split('\n'), 2)}
}`
    } else if (enableRefresh === 1) {
      pageStr = `Refresh({ refreshing: ${isTabPage ? 'this.isRefreshing[index]' : 'this.isRefreshing'} }) {
${this.transArr2Str(pageStr.split('\n'), 2)}
}
.onStateChange(bindFn(this.handleRefreshStatus, this${isTabPage ? ', index' : ''}))`
    }

    // Note: 增加头部导航
    pageStr = `Navigation() {
${this.transArr2Str(pageStr.split('\n'), 4)}
}
.backgroundColor(${isTabPage ? 'this.pageBackgroundColor[index]' : 'this.pageBackgroundColor'} || "${this.appConfig.window?.backgroundColor || '#FFFFFF'}")
.height('100%')
.width('100%')
.title({ builder: this.renderTitle, height: 48 + px2vp(sysInfo.safeArea?.top || 0) })
.titleMode(NavigationTitleMode.Mini)
.hideTitleBar(${isCustomNavigationBar ? `config${isTabPage ? '[index]' : ''}.navigationStyle !== 'default'` : `config${isTabPage ? '[index]' : ''}.navigationStyle === 'custom'`})
.hideBackButton(true)`

    if (isTabPage) {
      // TODO: 根据页面配置判断每个页面是否需要注入下拉刷新模块
      pageStr = `Tabs({
  barPosition: this.tabBarPosition !== 'top' ? BarPosition.End : BarPosition.Start,
  controller: this.tabBarController,
  index: this.tabBarCurrentIndex,
}) {
  ForEach(this.tabBarList, (item: ITabBarItem, index) => {
    TabContent() {
${this.transArr2Str(pageStr.split('\n'), 6)}
    }.tabBar(this.renderTabItemBuilder(index, item))
  }, (item: ITabBarItem, index) => \`\${item.key || index}\`)
}
.vertical(false)
.barMode(BarMode.Fixed)
.barHeight(this.isTabBarShow ? 56 : 0)
.animationDuration(this.tabBarAnimationDuration)
.onChange((index: number) => {
  if (this.tabBarCurrentIndex !== index) {
    callFn(this.page?.onHide, this)
    this.setTabBarCurrentIndex(index)
  }
  this.handlePageAppear()
  callFn(this.page?.onShow, this)
})
.backgroundColor(this.tabBarBackgroundColor)
.padding({
  bottom: px2vp(sysInfo.screenHeight - (sysInfo.safeArea?.bottom || 0)),
})`
    }
    if (SHOW_TREE) {
      pageStr = this.transArr2Str([
        'if (true) {',
        this.transArr2Str(pageStr.split('\n'), 2),
        this.transArr2Str([
          'Button({ type: ButtonType.Circle, stateEffect: true }) {',
          '  Text(\'打印 NodeTree\')',
          '    .fontSize(7).fontColor(Color.White)',
          '    .size({ width: 25, height: 25 })',
          '    .textAlign(TextAlign.Center)',
          '}',
          '.width(55).height(55).margin({ left: 20 })',
          '.backgroundColor(Color.Blue)',
          '.position({ x: \'75%\', y: \'80%\' })',
          '.onClick(bindFn(this.showTree, this))',
        ], 2),
        '}',
      ])
    }
    return pageStr
  }

  generatePageAboutToAppear (page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) {
    const modifyPageAppear = page instanceof Array ? page[0].modifyPageAppear : page.modifyPageAppear

    const isBlended = this.buildConfig.blended || this.buildConfig.isBuildNativeComp

    // 生成 aboutToAppear 函数内容
    let appearStr = `${isBlended ? 'initHarmonyElement()\n' : ''}${this.transArr2Str(([] as unknown[]).concat(
      this.buildConfig.isBuildNativeComp ? [] : [
        'const state = this.getPageState()',
        'if (this.pageStack.length >= state.index) {',
        '  this.pageStack.length = state.index - 1',
        '}',
        `this.pageStack.push(state)`,
      ],
      this.isTabbarPage ? [
        'const params = router.getParams() as Record<string, string> || {}',
        'let index: TaroAny = params.$page',
        '  ? this.tabBarList.findIndex(e => e.pagePath === params.$page)',
        '  : this.tabBarList.findIndex(e => e.pagePath === this.entryPagePath)',
        'index = index >= 0 ? index : 0',
        'this.handlePageAppear(index)',
        'this.setTabBarCurrentIndex(index)',
        'this.bindTabBarEvent()',
      ] : ['this.handlePageAppear()']
    ))}`

    if (isFunction(modifyPageAppear)) {
      appearStr = modifyPageAppear.call(this, appearStr, page)
    }

    return appearStr
  }

  generatePageAboutToDisAppear (page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) {
    const modifyPageDisappear = page instanceof Array ? page[0].modifyPageDisappear : page.modifyPageDisappear

    // 生成 aboutToDisappear 函数内容
    let disappearStr = this.transArr2Str([
      this.isTabbarPage ? `this.pageList?.forEach(item => {
callFn(item?.onUnload, this)
})
this.removeTabBarEvent()` : 'callFn(this.page?.onUnload, this)'])

    if (isFunction(modifyPageDisappear)) {
      disappearStr = modifyPageDisappear.call(this, disappearStr, page)
    }

    return disappearStr
  }

  generatePageShown () {
    const arr = [
      'this.bindPageEvent()',
      'const state = this.getPageState()',
      'if (this.pageStack[this.pageStack.length - 1].path !== state.path) {',
      '  this.pageStack.length = state.index',
      '  this.pageStack[state.index - 1] = state',
      '}',
    ]
    if (this.isTabbarPage) {
      arr.push(`this.handleSwitchTab({ params: router.getParams() || {} })`)
      arr.push(`this.pageList?.forEach(item => {`)
      arr.push(`  callFn(item?.onShow, this)`)
      arr.push(`})`)
    } else {
      arr.push('callFn(this.page?.onShow, this)')
    }
    return this.transArr2Str(arr)
  }

  generatePageHidden () {
    const arr = ['this.removePageEvent()']
    if (this.isTabbarPage) {
      arr.push(`this.pageList?.forEach(item => {`)
      arr.push(`  callFn(item?.onHide, this)`)
      arr.push(`})`)
    } else {
      arr.push('callFn(this.page?.onHide, this)')
    }
    return this.transArr2Str(arr)
  }

  parse (rawId: string, page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[], name = 'TaroPage', resolve?: TRollupResolveMethod) {
    const { modifyResolveId } = this.loaderMeta
    const { outputRoot = 'dist', sourceRoot = 'src' } = this.buildConfig
    const targetRoot = path.resolve(this.appPath, sourceRoot)

    const isBlended = this.buildConfig.blended || this.buildConfig.isBuildNativeComp
    this.isTabbarPage = page instanceof Array
    const pageRefresh: boolean[] = page instanceof Array
      ? page.map(e => this.isEnable(this.appConfig.window?.enablePullDownRefresh, e.config.enablePullDownRefresh))
      : [this.isEnable(this.appConfig.window?.enablePullDownRefresh, (page as TaroHarmonyPageMeta)?.config.enablePullDownRefresh)]
    if (pageRefresh.every(e => !!e)) {
      this.enableRefresh = 1
    } else {
      this.enableRefresh = pageRefresh.some(e => !!e) ? 2 : 0
    }

    let renderPath = path.posix.normalize(path.relative(
      path.dirname(rawId),
      path.join(targetRoot, 'render')
    ))
    renderPath = renderPath.split(path.sep).join('/')
    if (/^[^./]/.test(renderPath)) {
      renderPath = `./${renderPath}`
    }
    const importList = [
      'import type Taro from "@tarojs/taro/types"',
      'import type { PageInstance, TaroAny, TaroElement, TaroObject, TaroNode, TaroViewElement, TFunc } from "@tarojs/runtime"',
      'import type common from "@ohos.app.ability.common"',
      '',
      isBlended ? this.#setReconciler : '',
      'import router from "@ohos.router"',
      'import { TaroView } from "@tarojs/components"',
      'import { getSystemInfoSync } from "@tarojs/taro"',
      'import { eventCenter, bindFn, callFn, convertNumber2VP, Current, document, initHarmonyElement, ObjectAssign, window } from "@tarojs/runtime"',
      `import { createLazyChildren } from "${renderPath}"`,
    ]

    if (this.isTabbarPage) {
      importList.push(
        ...this.tabbarList.map((e, i) => `import page${i}, { config as config${i} } from './${e.pagePath}${TARO_COMP_SUFFIX}'`),
      )
    } else {
      importList.push(
        `import createComponent, { config } from "${path.resolve(targetRoot, (page as TaroHarmonyPageMeta).originName) + TARO_COMP_SUFFIX}"`,
      )
    }
    if (isBlended && this.#setReconcilerPost) {
      importList.push(this.#setReconcilerPost)
    }

    const modifyPageImport = page instanceof Array ? page[0].modifyPageImport : page.modifyPageImport
    if (isFunction(modifyPageImport)) {
      modifyPageImport.call(this, importList, page)
    }

    const code = this.transArr2Str([
      ...importList,
      this.isTabbarPage ? [
        `const createComponent = [${this.tabbarList.map((_, i) => `page${i}`).join(', ')}]`,
        `const config = [${this.tabbarList.map((_, i) => `config${i}`).join(', ')}]`,
        '',
        'interface ITabBarItem extends Taro.TabBarItem {',
        this.transArr2Str([
          'key?: number',
          'badgeText?: string',
          'showRedDot?: boolean',
        ], 2),
        '}',
      ] : null,
      '',
      'const sysInfo: TaroAny = getSystemInfoSync()',
      this.getInstantiatePage(page),
    ])

    return resolveAbsoluteRequire({
      name,
      importer: rawId,
      code,
      outputRoot,
      targetRoot,
      resolve,
      modifyResolveId,
    })
  }

  parseEntry (rawId: string, page: TaroHarmonyPageMeta) {
    const { creatorLocation, frameworkArgs, importFrameworkStatement, modifyEntryFile } = this.loaderMeta
    const entryOption = page instanceof Array ? page[0].entryOption : page.entryOption
    const isBlended = this.buildConfig.blended || this.buildConfig.isBuildNativeComp
    // FIXME: pure 参数应该使用 page.entryOption 替代
    const createFn = this.isPure
      ? 'createNativeComponentConfig'
      : isBlended
        ? 'createNativePageConfig' : 'createPageConfig'
    const pageName = entryOption?.routeName || page.name
    const createPageOrComponent = `${createFn}(component, ${this.isPure
      ? `${frameworkArgs}`
      : isBlended
        ? `'${pageName}', ${frameworkArgs}` : `'${pageName}', config`})`

    const rawCode = this.transArr2Str([
      `import { ${createFn} } from '${creatorLocation}'`,
      `import component from "${escapePath(rawId)}"`,
      isBlended ? 'import { initPxTransform } from "@tarojs/taro"' : null,
      importFrameworkStatement,
      `export const config = ${this.prettyPrintJson(page.config)}`,
      isBlended ? this.getInitPxTransform() : null,
      page?.config.enableShareTimeline ? 'component.enableShareTimeline = true' : null,
      page?.config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : null,
      `export default () => ${createPageOrComponent}`,
    ])

    return isFunction(modifyEntryFile) ? modifyEntryFile.call(this, 'page', rawId, rawCode, page) : rawCode
  }
}
