/* eslint-disable dot-notation */
import { addLeadingSlash, Current, eventCenter, getCurrentPage, getHomePage, requestAnimationFrame, stripBasename, stripTrailing } from '@tarojs/runtime'
import queryString from 'query-string'

import { bindPageResize } from '../events/resize'
import { bindPageScroll } from '../events/scroll'
import { history, setHistory } from '../history'
import { loadAnimateStyle, loadRouterStyle } from '../style'
import { routesAlias } from '../utils'
import NavigationBarHandler from './navigation-bar'
import stacks from './stack'

import type { PageInstance } from '@tarojs/runtime'
import type { PageConfig, RouterAnimate } from '@tarojs/taro'
import type { History } from 'history'
import type { Route, SpaRouterConfig } from '../../types/router'

export default class PageHandler {
  public config: SpaRouterConfig
  protected readonly defaultAnimation: RouterAnimate = { duration: 300, delay: 50 }
  protected unloadTimer: ReturnType<typeof setTimeout> | null
  protected hideTimer: ReturnType<typeof setTimeout> | null
  protected lastHidePage: HTMLElement | null
  protected lastUnloadPage: PageInstance | null
  protected navigationBarHandler: NavigationBarHandler

  public homePage: string
  public originHomePage: string

  constructor (config: SpaRouterConfig, public history: History) {
    this.config = config
    this.homePage = getHomePage(this.routes[0].path, this.basename, this.customRoutes, this.config.entryPagePath)
    this.originHomePage = this.config.entryPagePath || this.routes[0].path || this.basename
    this.mount()
    this.navigationBarHandler = new NavigationBarHandler(this)
  }

  get currentPage () {
    const routePath = getCurrentPage(this.routerMode, this.basename)
    return routePath === '/' ? this.homePage : routePath
  }

  get appId () { return this.config.appId || 'app' }
  get router () { return this.config.router || {} }
  get routerMode () { return this.router.mode || 'hash' }
  get customRoutes () { return this.router.customRoutes || {} }
  get routes () { return this.config.routes || [] }
  get tabBarList () { return this.config.tabBar?.list || [] }
  get PullDownRefresh () { return this.config.PullDownRefresh }
  get animation () { return this.config?.animation ?? this.defaultAnimation }
  get animationDelay () {
    return (typeof this.animation === 'object'
      ? this.animation.delay
      : this.animation
        ? this.defaultAnimation?.delay
        : 0) || 0
  }

  get animationDuration () {
    return (typeof this.animation === 'object'
      ? this.animation.duration
      : this.animation
        ? this.defaultAnimation?.duration
        : 0) || 0
  }

  set pathname (p) { this.router.pathname = p }
  get pathname () { return this.router.pathname }
  get basename () { return this.router.basename || '' }

  get pageConfig () {
    const routePath = addLeadingSlash(stripBasename(this.pathname, this.basename))
    const homePage = addLeadingSlash(this.homePage)
    return this.routes.find(r => {
      const pagePath = addLeadingSlash(r.path)
      return [pagePath, homePage].includes(routePath) || routesAlias.getConfig(pagePath)?.includes(routePath)
    })
  }

  isTabBar (pathname: string) {
    const routePath = addLeadingSlash(stripBasename(pathname, this.basename)).split('?')[0]
    const pagePath = Object.entries(this.customRoutes).find(
      ([, target]) => {
        if (typeof target === 'string') {
          return target === routePath
        } else if (target?.length > 0) {
          return target.includes(routePath)
        }
        return false
      }
    )?.[0] || routePath

    return !!pagePath && this.tabBarList.some(t => stripTrailing(t.pagePath) === pagePath)
  }

  isDefaultNavigationStyle () {
    let style = this.config.window?.navigationStyle
    if (typeof this.pageConfig?.navigationStyle === 'string') {
      style = this.pageConfig.navigationStyle
    }
    return style !== 'custom'
  }

  isSamePage (page?: PageInstance | null) {
    const routePath = stripBasename(this.pathname, this.basename)
    const pagePath = stripBasename(page?.path, this.basename)
    return pagePath.startsWith(routePath + '?')
  }

  get search () {
    let search = '?'
    if (this.routerMode === 'hash') {
      const idx = location.hash.indexOf('?')
      if (idx > -1) {
        search = location.hash.slice(idx)
      }
    } else {
      search = location.search
    }
    return search.substring(1)
  }

  get usingWindowScroll () {
    let usingWindowScroll = false
    if (typeof this.pageConfig?.usingWindowScroll === 'boolean') {
      usingWindowScroll = this.pageConfig.usingWindowScroll
    }
    const win = window as any
    win.__taroAppConfig ||= {}
    win.__taroAppConfig.usingWindowScroll = usingWindowScroll
    return usingWindowScroll
  }

  getQuery (stamp = '', search = '', options: Record<string, unknown> = {}) {
    search = search ? `${search}&${this.search}` : this.search
    const query = search
      ? queryString.parse(search, { decode: false })
      : {}

    query.stamp = stamp
    return { ...query, ...options }
  }

  mount () {
    setHistory(this.history, this.basename)
    this.pathname = history.location.pathname
    // Note: 注入页面样式
    this.animation && loadAnimateStyle(this.animationDuration)
    loadRouterStyle(this.tabBarList.length > 1, this.usingWindowScroll)
  }

  onReady (page: PageInstance, onLoad = true) {
    const pageEl = this.getPageContainer(page)
    if (pageEl && !pageEl?.['__isReady']) {
      const el = pageEl.firstElementChild
      const componentOnReady = el?.['componentOnReady']
      if (componentOnReady) {
        componentOnReady?.().then(() => {
          requestAnimationFrame(() => {
            page.onReady?.()
            pageEl!['__isReady'] = true
          })
        })
      } else {
        page.onReady?.()
        pageEl!['__isReady'] = true
      }
      onLoad && (pageEl['__page'] = page)
    }
  }

  load (page: PageInstance, pageConfig: Route = {}, stampId: string, pageNo = 0) {
    if (!page) return

    // NOTE: 页面栈推入太晚可能导致 getCurrentPages 无法获取到当前页面实例
    stacks.push(page)
    const param = this.getQuery(stampId, '', page.options)
    let pageEl = this.getPageContainer(page)
    if (pageEl) {
      pageEl.classList.remove('taro_page_shade')
      this.isTabBar(this.pathname) && pageEl.classList.add('taro_tabbar_page')
      this.isDefaultNavigationStyle() && pageEl.classList.add('taro_navigation_page')
      this.addAnimation(pageEl, pageNo === 0)
      page.onShow?.()
      this.navigationBarHandler.load()
      this.bindPageEvents(page, pageConfig)
      this.triggerRouterChange()
    } else {
      // FIXME 在 iOS 端快速切换页面时，可能不会执行回调注入对应类名导致 TabBar 白屏
      page.onLoad?.(param, () => {
        pageEl = this.getPageContainer(page)
        this.isTabBar(this.pathname) && pageEl?.classList.add('taro_tabbar_page')
        this.isDefaultNavigationStyle() && pageEl?.classList.add('taro_navigation_page')
        this.addAnimation(pageEl, pageNo === 0)
        page.onShow?.()
        this.navigationBarHandler.load()
        this.onReady(page, true)
        this.bindPageEvents(page, pageConfig)
        this.triggerRouterChange()
      })
    }
  }

  unload (page?: PageInstance | null, delta = 1, top = false) {
    if (!page) return

    stacks.delta = --delta
    stacks.pop()
    if (this.animation && top) {
      if (this.unloadTimer) {
        clearTimeout(this.unloadTimer)
        this.lastUnloadPage?.onUnload?.()
        this.unloadTimer = null
      }
      this.lastUnloadPage = page
      const pageEl = this.getPageContainer(page)
      pageEl?.classList.remove('taro_page_stationed')
      pageEl?.classList.remove('taro_page_show')
      if (pageEl) {
        pageEl.style.zIndex = '1'
      }

      this.unloadTimer = setTimeout(() => {
        this.unloadTimer = null
        this.lastUnloadPage?.onUnload?.()
        eventCenter.trigger('__taroPageOnShowAfterDestroyed')
      }, this.animationDuration)
    } else {
      const pageEl = this.getPageContainer(page)
      pageEl?.classList.remove('taro_page_stationed')
      pageEl?.classList.remove('taro_page_show')
      page?.onUnload?.()
      setTimeout(() => {
        eventCenter.trigger('__taroPageOnShowAfterDestroyed')
      }, 0)
    }
    if (delta >= 1) this.unload(stacks.last, delta)
  }

  show (page?: PageInstance | null, pageConfig: Route = {}, pageNo = 0) {
    if (!page) return

    const param = this.getQuery(page['$taroParams']['stamp'], '', page.options)
    let pageEl = this.getPageContainer(page)
    if (pageEl) {
      pageEl.classList.remove('taro_page_shade')
      this.addAnimation(pageEl, pageNo === 0)
      page.onShow?.()
      this.navigationBarHandler.load()
      this.bindPageEvents(page, pageConfig)
      this.triggerRouterChange()
    } else {
      page.onLoad?.(param, () => {
        pageEl = this.getPageContainer(page)
        this.addAnimation(pageEl, pageNo === 0)
        page.onShow?.()
        this.navigationBarHandler.load()
        this.onReady(page, false)
        this.bindPageEvents(page, pageConfig)
        this.triggerRouterChange()
      })
    }
  }

  hide (page?: PageInstance | null, animation = false) {
    if (!page) return

    // NOTE: 修复多页并发问题，此处可能因为路由跳转过快，执行时页面可能还没有创建成功
    const pageEl = this.getPageContainer(page)
    if (pageEl) {
      if (animation) {
        if (this.hideTimer) {
          clearTimeout(this.hideTimer)
          this.hideTimer = null
          this.lastHidePage?.classList?.add?.('taro_page_shade')
        }
        this.lastHidePage = pageEl
        this.hideTimer = setTimeout(() => {
          this.hideTimer = null
          pageEl.classList.add('taro_page_shade')
        }, this.animationDuration + this.animationDelay)
        page.onHide?.()
      } else {
        if (this.hideTimer) {
          clearTimeout(this.hideTimer)
          this.hideTimer = null
          this.lastHidePage?.classList?.add?.('taro_page_shade')
        }
        pageEl.classList.add('taro_page_shade')
        this.lastHidePage = pageEl
      }
    } else {
      setTimeout(() => this.hide(page), 0)
    }
  }

  addAnimation (pageEl?: HTMLElement | null, first = false) {
    if (!pageEl) return

    if (this.animation && !first) {
      setTimeout(() => {
        pageEl.classList.add('taro_page_show')
        setTimeout(() => {
          pageEl.classList.add('taro_page_stationed')
        }, this.animationDuration)
      }, this.animationDelay)
    } else {
      pageEl.classList.add('taro_page_show')
      pageEl.classList.add('taro_page_stationed')
    }
  }

  getPageContainer (page?: PageInstance | null): HTMLElement | null {
    const path = page ? page?.path : Current.page?.path
    const id = path?.replace(/([^a-z0-9\u00a0-\uffff_-])/ig, '\\$1')
    if (page) {
      return document.querySelector(`.taro_page#${id}`)
    }
    const el: HTMLDivElement | null = (id
      ? document.querySelector(`.taro_page#${id}`)
      : document.querySelector('.taro_page') ||
    document.querySelector('.taro_router')) as HTMLDivElement
    return el
  }

  getScrollingElement (page?: PageInstance | null) {
    if (this.usingWindowScroll) return window
    return this.getPageContainer(page) || window
  }

  bindPageEvents (page: PageInstance, config: Partial<PageConfig> = {}) {
    const scrollEl = this.getScrollingElement(page)
    const distance = config.onReachBottomDistance || this.config.window?.onReachBottomDistance || 50
    bindPageScroll(page, scrollEl, distance)
    bindPageResize(page)
  }

  triggerRouterChange () {
    /**
     * @tarojs/runtime 中生命周期跑在 promise 中，所以这里需要 setTimeout 延迟事件调用
     * TODO 考虑将生命周期返回 Promise，用于处理相关事件调用顺序
     */
    setTimeout(() => {
      eventCenter.trigger('__afterTaroRouterChange', {
        toLocation: {
          path: this.pathname
        }
      })
    }, 0)
  }
}
