/* eslint-disable dot-notation */
import { RouterAnimate } from '@tarojs/taro'
import { PageInstance, requestAnimationFrame } from '@tarojs/runtime'
import queryString from 'query-string'

import { bindPageScroll } from '../scroll'
import stacks from './stack'
import { Route, RouterConfig } from './'
import { setHistoryMode, stripBasename } from '../history'
import { loadAnimateStyle } from '../animation'
import { initTabbar } from '../tabbar'
import { addLeadingSlash, routesAlias } from '../utils'

function setDisplay (el?: HTMLElement | null, type = '') {
  if (el) {
    el.style.display = type
  }
}

export default class PageHandler {
  protected config: RouterConfig
  protected readonly defaultAnimation: RouterAnimate = { duration: 300, delay: 50 }
  protected hideTimer: number | null
  protected unloadTimer: number | null
  protected lastHidePage: HTMLElement | null
  protected lastUnloadPage: PageInstance | null

  constructor (config: RouterConfig) {
    this.config = config
    this.mount()
  }

  get appId () { return 'app' }
  get router () { return this.config.router }
  get routerMode () { return this.router.mode || 'hash' }
  get customRoutes () { return this.router.customRoutes || {} }
  get routes () { return this.config.routes }
  get tabBarList () { return this.config.tabBar?.list || [] }
  get PullDownRefresh () { return this.config.PullDownRefresh }
  get animation () { return this.config?.animation ?? this.defaultAnimation }
  get animationDelay () {
    return typeof this.animation === 'object'
      ? this.animation.delay
      : this.animation
        ? this.defaultAnimation?.delay
        : 0
  }

  get animationDuration () {
    return typeof this.animation === 'object'
      ? this.animation.duration
      : this.animation
        ? this.defaultAnimation?.duration
        : 0
  }

  set pathname (p) { this.router.pathname = p }
  get pathname () { return this.router.pathname }
  get basename () { return this.router.basename || '' }
  get pageConfig () {
    return this.routes.find(r => {
      const routePath = stripBasename(this.pathname, this.basename)
      const pagePath = addLeadingSlash(r.path)
      return pagePath === routePath || routesAlias.getConfig(pagePath)?.includes(routePath)
    })
  }

  get isTabBar () {
    const routePath = stripBasename(this.pathname, this.basename)
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

  isSamePage (page?: PageInstance | null) {
    const routePath = stripBasename(this.pathname, this.basename)
    const pagePath = stripBasename(page?.path, this.basename)
    return pagePath.startsWith(routePath + '?')
  }

  get search () {
    let search = '?'
    if (this.routerMode) {
      const idx = location.hash.indexOf('?')
      if (idx > -1) {
        search = location.hash.slice(idx)
      }
    } else {
      search = location.search
    }
    return search.substr(1)
  }

  getQuery (stamp = 0, search = '') {
    search = search ? `${search}&${this.search}` : this.search
    const query = search
      ? queryString.parse(search)
      : {}

    query.stamp = stamp.toString()
    return query
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
    const pageEl = document.getElementById(page.path!)
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

    let pageEl = document.getElementById(page.path!)
    if (pageEl) {
      setDisplay(pageEl)
      this.isTabBar && pageEl.classList.add('taro_tabbar_page')
      this.addAnimation(pageEl, stacksIndex === 0)
    } else {
      page.onLoad?.(this.getQuery(stacksIndex), () => {
        pageEl = document.getElementById(page.path!)
        this.isTabBar && pageEl?.classList.add('taro_tabbar_page')
        this.addAnimation(pageEl, stacksIndex === 0)
        this.onReady(page, true)
      })
    }
    stacks.push(page)
    page.onShow?.()
    bindPageScroll(page, pageConfig)
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
      const pageEl = document.getElementById(page.path!)
      pageEl?.classList.remove('taro_page_show')

      this.unloadTimer = setTimeout(() => {
        this.unloadTimer = null
        this.lastUnloadPage?.onUnload?.()
      }, this.animationDuration)
    } else {
      const pageEl = document.getElementById(page.path!)
      pageEl?.classList.remove('taro_page_show')
      page?.onUnload?.()
    }
    if (delta >= 1) this.unload(stacks.last, delta)
  }

  show (page?: PageInstance | null, pageConfig: Route = {}, stacksIndex = 0) {
    if (!page) return

    page.onShow?.()
    let pageEl = document.getElementById(page.path!)
    if (pageEl) {
      setDisplay(pageEl)
      this.addAnimation(pageEl, stacksIndex === 0)
    } else {
      page.onLoad?.(this.getQuery(stacksIndex), () => {
        pageEl = document.getElementById(page.path!)
        this.addAnimation(pageEl, stacksIndex === 0)
        this.onReady(page, false)
      })
    }
    bindPageScroll(page, pageConfig)
  }

  hide (page?: PageInstance | null) {
    if (!page) return

    // NOTE: 修复多页并发问题，此处可能因为路由跳转过快，执行时页面可能还没有创建成功
    const pageEl = document.getElementById(page.path!)
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
      }, this.animationDelay)
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
      }, this.animationDelay)
    } else {
      pageEl.classList.add('taro_page_show')
    }
  }
}
