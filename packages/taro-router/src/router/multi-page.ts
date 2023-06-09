/* eslint-disable dot-notation */
import { Current, PageInstance } from '@tarojs/runtime'
import queryString from 'query-string'

import { bindPageResize } from '../events/resize'
import { bindPageScroll } from '../events/scroll'
import { setHistoryMode } from '../history'
import { loadRouterStyle } from '../style'
import { initTabbar } from '../tabbar'
import { addLeadingSlash, stripBasename } from '../utils'

import type { PageConfig } from '@tarojs/taro'
import type { MpaRouterConfig, Route } from '../../types/router'

export default class MultiPageHandler {
  protected config: MpaRouterConfig

  constructor (config: MpaRouterConfig) {
    this.config = config
    this.mount()
  }

  get appId () { return this.config.appId || 'app' }
  get router () { return this.config.router || {} }
  get routerMode () { return this.router.mode || 'hash' }
  get customRoutes () { return this.router.customRoutes || {} }
  get tabBarList () { return this.config.tabBar?.list || [] }
  get PullDownRefresh () { return this.config.PullDownRefresh }

  set pathname (p) { this.router.pathname = p }
  get pathname () { return this.router.pathname }
  get basename () { return this.router.basename || '' }
  get pageConfig () { return this.config.route }

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

    return !!pagePath && this.tabBarList.some(t => t.pagePath === pagePath)
  }

  get search () { return location.search.substr(1) }

  get usingWindowScroll () {
    let usingWindowScroll = true
    if (typeof this.pageConfig?.usingWindowScroll === 'boolean') {
      usingWindowScroll = this.pageConfig.usingWindowScroll
    }
    const win = window as any
    win.__taroAppConfig ||= {}
    win.__taroAppConfig.usingWindowScroll = usingWindowScroll
    return usingWindowScroll
  }

  getQuery (search = '', options: Record<string, unknown> = {}) {
    search = search ? `${search}&${this.search}` : this.search
    const query = search
      ? queryString.parse(search)
      : {}
    return { ...query, ...options }
  }

  mount () {
    setHistoryMode(this.routerMode, this.router.basename)

    loadRouterStyle(this.usingWindowScroll)

    const appId = this.appId
    let app = document.getElementById(appId)
    let isPosition = true
    if (!app) {
      app = document.createElement('div')
      app.id = appId
      isPosition = false
    }
    const appWrapper = app?.parentNode || app?.parentElement || document.body
    app.classList.add('taro_router')

    if (this.tabBarList.length > 1) {
      const container = document.createElement('div')
      container.classList.add('taro-tabbar__container')
      container.id = 'container'

      const panel = document.createElement('div')
      panel.classList.add('taro-tabbar__panel')

      panel.appendChild(app.cloneNode(true))
      container.appendChild(panel)

      if (!isPosition) {
        appWrapper.appendChild(container)
      } else {
        appWrapper.replaceChild(container, app)
      }

      initTabbar(this.config)
    } else {
      if (!isPosition) appWrapper.appendChild(app)
    }
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

  load (page: PageInstance, pageConfig: Route = {}) {
    if (!page) return

    page.onLoad?.(this.getQuery('', page.options), () => {
      if (this.isTabBar) {
        const pageEl = this.getPageContainer(page)
        pageEl?.classList.add('taro_tabbar_page')
      }
      this.onReady(page, true)
      page.onShow?.()
      this.bindPageEvents(page, pageConfig)
    })
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
}
