/* eslint-disable dot-notation */
import { Current, PageInstance, requestAnimationFrame } from '@tarojs/runtime'
import queryString from 'query-string'

import { loadAnimateStyle } from '../animation'
import { bindPageResize } from '../events/resize'
import { bindPageScroll } from '../events/scroll'
import { setHistoryMode } from '../history'
import { initTabbar } from '../tabbar'
import { addLeadingSlash, routesAlias, stripBasename, stripTrailing } from '../utils'
import stacks from './stack'

import type { PageConfig, RouterAnimate } from '@tarojs/taro'
import type { Route, SpaRouterConfig } from '../../types/router'

function setDisplay (el?: HTMLElement | null, type = '') {
  if (el) {
    el.style.display = type
  }
}

export default class PageHandler {
  protected config: SpaRouterConfig
  protected readonly defaultAnimation: RouterAnimate = { duration: 300, delay: 50 }
  protected unloadTimer: ReturnType<typeof setTimeout> | null
  protected hideTimer: ReturnType<typeof setTimeout> | null
  protected lastHidePage: HTMLElement | null
  protected lastUnloadPage: PageInstance | null

  public homePage: string

  constructor (config: SpaRouterConfig) {
    this.config = config
    this.homePage = this.getHomePage()
    this.mount()
  }

  get appId () { return 'app' }
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

  get isTabBar () {
    const routePath = addLeadingSlash(stripBasename(this.pathname, this.basename))
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

  getHomePage () {
    const routePath = addLeadingSlash(stripBasename(this.routes[0].path, this.basename))
    const alias = Object.entries(this.customRoutes).find(
      ([key]) => key === routePath
    )?.[1] || routePath
    return this.config.entryPagePath || (typeof alias === 'string' ? alias : alias[0]) || this.basename
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
    return search.substr(1)
  }

  getQuery (stamp = 0, search = '', options: Record<string, unknown> = {}) {
    search = search ? `${search}&${this.search}` : this.search
    const query = search
      ? queryString.parse(search, { decode: false })
      : {}

    query.stamp = stamp.toString()
    return { ...query, ...options }
  }

  mount () {
    setHistoryMode(this.routerMode, this.router.basename)
    document.getElementById('app')?.remove()

    this.animation && loadAnimateStyle(this.animationDuration)

    const app = document.createElement('div')
    app.id = this.appId
    app.classList.add('taro_router')

    if (this.tabBarList.length > 1) {
      const container = document.createElement('div')
      container.classList.add('taro-tabbar__container')
      container.id = 'container'

      const panel = document.createElement('div')
      panel.classList.add('taro-tabbar__panel')

      panel.appendChild(app)
      container.appendChild(panel)

      document.body.appendChild(container)

      initTabbar(this.config)
    } else {
      document.body.appendChild(app)
    }
  }

  onReady (page: PageInstance, onLoad = true) {
    const pageEl = this.getPageContainer(page)
    if (pageEl && !pageEl?.['__isReady']) {
      const el = pageEl.firstElementChild
      el?.['componentOnReady']?.()?.then(() => {
        requestAnimationFrame(() => {
          page.onReady?.()
          pageEl!['__isReady'] = true
        })
      })
      onLoad && (pageEl['__page'] = page)
    }
  }

  load (page: PageInstance, pageConfig: Route = {}, stacksIndex = 0) {
    if (!page) return

    // NOTE: 页面栈推入太晚可能导致 getCurrentPages 无法获取到当前页面实例
    stacks.push(page)
    const param = this.getQuery(stacks.length, '', page.options)
    let pageEl = this.getPageContainer(page)
    if (pageEl) {
      setDisplay(pageEl)
      this.isTabBar && pageEl.classList.add('taro_tabbar_page')
      this.addAnimation(pageEl, stacksIndex === 0)
      page.onShow?.()
      this.bindPageEvents(page, pageEl, pageConfig)
    } else {
      page.onLoad?.(param, () => {
        pageEl = this.getPageContainer(page)
        this.isTabBar && pageEl?.classList.add('taro_tabbar_page')
        this.addAnimation(pageEl, stacksIndex === 0)
        this.onReady(page, true)
        page.onShow?.()
        this.bindPageEvents(page, pageEl, pageConfig)
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

      this.unloadTimer = setTimeout(() => {
        this.unloadTimer = null
        this.lastUnloadPage?.onUnload?.()
      }, this.animationDuration)
    } else {
      const pageEl = this.getPageContainer(page)
      pageEl?.classList.remove('taro_page_stationed')
      pageEl?.classList.remove('taro_page_show')
      page?.onUnload?.()
    }
    if (delta >= 1) this.unload(stacks.last, delta)
  }

  show (page?: PageInstance | null, pageConfig: Route = {}, stacksIndex = 0) {
    if (!page) return

    const param = this.getQuery(stacks.length, '', page.options)
    let pageEl = this.getPageContainer(page)
    if (pageEl) {
      setDisplay(pageEl)
      this.addAnimation(pageEl, stacksIndex === 0)
      page.onShow?.()
      this.bindPageEvents(page, pageEl, pageConfig)
    } else {
      page.onLoad?.(param, () => {
        pageEl = this.getPageContainer(page)
        this.addAnimation(pageEl, stacksIndex === 0)
        this.onReady(page, false)
        page.onShow?.()
        this.bindPageEvents(page, pageEl, pageConfig)
      })
    }
  }

  hide (page?: PageInstance | null) {
    if (!page) return

    // NOTE: 修复多页并发问题，此处可能因为路由跳转过快，执行时页面可能还没有创建成功
    const pageEl = this.getPageContainer(page)
    if (pageEl) {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer)
        this.hideTimer = null
        setDisplay(this.lastHidePage, 'none')
      }
      this.lastHidePage = pageEl
      this.hideTimer = setTimeout(() => {
        this.hideTimer = null
        setDisplay(this.lastHidePage, 'none')
      }, this.animationDuration + this.animationDelay)
      page.onHide?.()
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
    return el || window
  }

  bindPageEvents (page: PageInstance, pageEl?: HTMLElement | null, config: Partial<PageConfig> = {}) {
    if (!pageEl) {
      pageEl = this.getPageContainer() as HTMLElement
    }
    const distance = config.onReachBottomDistance || this.config.window?.onReachBottomDistance || 50
    bindPageScroll(page, pageEl, distance)
    bindPageResize(page)
  }
}
