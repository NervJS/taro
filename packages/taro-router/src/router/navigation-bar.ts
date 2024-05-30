import { eventCenter } from '@tarojs/runtime'

import { navigateBack, reLaunch } from '../api'
import { isDingTalk } from '../utils'
import stacks from './stack'

import type PageHandler from './page'

interface NavigationBarCache {
  backgroundColor?: string
  fontColor?: string
  title?: string
  show?: boolean
  loading?: boolean
}

export default class NavigationBarHandler {
  pageContext: PageHandler
  navigationBarElement: HTMLElement
  cache: Record<string, NavigationBarCache>
  isLoadDdEntry = false

  constructor (pageContext: PageHandler) {
    this.cache = {}
    this.pageContext = pageContext
    this.init()

    eventCenter.on('__taroH5SetNavigationBarTitle', (title) => {
      this.setTitle(title)
    })

    eventCenter.on('__taroH5setNavigationBarLoading', (loading) => {
      this.setNavigationLoading(loading)
    })

    eventCenter.on('__taroH5setNavigationBarColor', ({ backgroundColor, frontColor }) => {
      if (typeof backgroundColor === 'string') this.setNavigationBarBackground(backgroundColor)

      if (typeof frontColor === 'string') this.setNavigationBarTextStyle(frontColor)
    })
  }

  private toHomeFn () {
    reLaunch({ url: this.pageContext.originHomePage })
  }

  private backFn () {
    navigateBack()
  }

  get homeBtnElement () {
    if (!this.navigationBarElement) return null
    return this.navigationBarElement.getElementsByClassName('taro-navigation-bar-home')?.[0]
  }

  get backBtnElement () {
    if (!this.navigationBarElement) return null
    return this.navigationBarElement.getElementsByClassName('taro-navigation-bar-back')?.[0]
  }

  get titleElement () {
    if (!this.navigationBarElement) return null
    return this.navigationBarElement.getElementsByClassName('taro-navigation-bar-title')?.[0]
  }

  get loadingElement () {
    if (!this.navigationBarElement) return null
    return this.navigationBarElement.getElementsByClassName('taro-navigation-bar-loading')[0]
  }

  init () {
    this.setNavigationBarElement()
    if (!this.navigationBarElement) return
    this.homeBtnElement?.addEventListener('click', this.toHomeFn.bind(this))
    this.backBtnElement?.addEventListener('click', this.backFn.bind(this))
  }

  setNavigationBarElement () {
    this.navigationBarElement = document.getElementById('taro-navigation-bar') as HTMLElement
  }

  load () {
    this.setCacheValue()
    this.setTitle()
    this.setNavigationBarVisible()
    this.setFnBtnState()
    this.setNavigationBarBackground()
    this.setNavigationBarTextStyle()
    this.setNavigationLoading()
  }

  setCacheValue () {
    const currentPage = this.pageContext.originPathname
    if (typeof this.cache[currentPage] !== 'object') {
      this.cache[currentPage] = {}
    }
  }

  setFnBtnState () {
    const currentRouter = this.pageContext.currentPage
    if (this.pageContext.isTabBar(currentRouter) || this.pageContext.homePage === currentRouter) {
      this.fnBtnToggleToNone()
    } else if (stacks.length > 1) {
      this.fnBtnToggleToBack()
    } else {
      this.fnBtnToggleToHome()
    }
  }

  shiftLoadingState (show: boolean) {
    if (!this.loadingElement) return
    if (show) {
      this.loadingElement.classList.add('taro-navigation-bar-loading-show')
    } else {
      this.loadingElement.classList.remove('taro-navigation-bar-loading-show')
    }
  }

  setNavigationLoading (show?: boolean) {
    if (!this.navigationBarElement) return
    const currentPage = this.pageContext.originPathname
    let isShow
    if (typeof show === 'boolean') {
      isShow = show
      this.cache[currentPage] &&
      (this.cache[currentPage].loading = isShow)
    } else {
      const cacheValue = this.cache[currentPage]?.loading
      if (typeof cacheValue === 'boolean') {
        isShow = cacheValue
      } else {
        // 默认值为 false
        isShow = false
        this.cache[currentPage] &&
        (this.cache[currentPage].loading = isShow)
      }
    }

    this.shiftLoadingState(isShow)
  }

  setNavigationBarBackground (backgroundColor?: string) {
    if (!this.navigationBarElement) return

    const currentPage = this.pageContext.originPathname
    let color
    if (typeof backgroundColor === 'string') {
      color = backgroundColor
      this.cache[currentPage] &&
      (this.cache[currentPage].backgroundColor = color)
    } else {
      const cacheValue = this.cache[currentPage]?.backgroundColor
      if (typeof cacheValue === 'string') {
        color = cacheValue
      } else {
        color = this.pageContext.config?.window?.navigationBarBackgroundColor || '#000000'
        this.cache[currentPage] &&
        (this.cache[currentPage].backgroundColor = color)
      }
    }
    (this.navigationBarElement as HTMLElement).style.background = color
  }

  setNavigationBarTextStyle (fontColor?: string) {
    if (!this.navigationBarElement) return

    const currentPage = this.pageContext.originPathname
    let color
    if (typeof fontColor === 'string') {
      color = fontColor
      this.cache[currentPage] &&
      (this.cache[currentPage].fontColor = color)
    } else {
      const cacheValue = this.cache[currentPage]?.fontColor
      if (typeof cacheValue === 'string') {
        color = cacheValue
      } else {
        color = this.pageContext.config?.window?.navigationBarTextStyle || 'white'
        this.cache[currentPage] &&
        (this.cache[currentPage].fontColor = color)
      }
    }
    (this.navigationBarElement as HTMLElement).style.color = color
  }

  setTitle (title?) {
    const currentPage = this.pageContext.originPathname
    let proceedTitle
    if (typeof title === 'string') {
      proceedTitle = title
      this.cache[currentPage] &&
      (this.cache[currentPage].title = proceedTitle)
    } else {
      const cacheValue = this.cache[currentPage]?.title
      if (typeof cacheValue === 'string') {
        proceedTitle = cacheValue
      } else {
        proceedTitle = this.pageContext.pageConfig?.navigationBarTitleText ?? document.title
        this.cache[currentPage] &&
        (this.cache[currentPage].title = proceedTitle)
      }
    }

    if (process.env.SUPPORT_DINGTALK_NAVIGATE !== 'disabled' && isDingTalk()) {
      if (!this.isLoadDdEntry) {
        this.isLoadDdEntry = true
        require('dingtalk-jsapi/platform')
      }
      const setDingTitle = require('dingtalk-jsapi/api/biz/navigation/setTitle').default
      setDingTitle({ proceedTitle })
    }
    document.title = proceedTitle
    if (!this.titleElement) return
    this.titleElement.innerHTML = proceedTitle
  }

  fnBtnToggleToHome () {
    if (!this.navigationBarElement) return
    this.navigationBarElement.classList.add('taro-navigation-bar-home-icon')
    this.navigationBarElement.classList.remove('taro-navigation-bar-back-icon')
  }

  fnBtnToggleToBack () {
    if (!this.navigationBarElement) return
    this.navigationBarElement.classList.remove('taro-navigation-bar-home-icon')
    this.navigationBarElement.classList.add('taro-navigation-bar-back-icon')
  }

  fnBtnToggleToNone () {
    if (!this.navigationBarElement) return
    this.navigationBarElement.classList.remove('taro-navigation-bar-home-icon')
    this.navigationBarElement.classList.remove('taro-navigation-bar-back-icon')
  }

  setNavigationBarVisible (show?) {
    if (!this.navigationBarElement) return

    let shouldShow
    if (typeof show === 'boolean') {
      shouldShow = show
    } else {
      shouldShow = this.pageContext.config.window?.navigationStyle
      if (typeof this.pageContext.pageConfig?.navigationStyle === 'string') {
        shouldShow = this.pageContext.pageConfig.navigationStyle
      }
    }
    if (shouldShow === 'default') {
      this.navigationBarElement.classList.add('taro-navigation-bar-show')
      this.navigationBarElement.classList.remove('taro-navigation-bar-hide')
    } else {
      this.navigationBarElement.classList.add('taro-navigation-bar-hide')
      this.navigationBarElement.classList.remove('taro-navigation-bar-show')
    }
  }
}
