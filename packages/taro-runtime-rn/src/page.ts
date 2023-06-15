import { getCurrentRoute, isTabPage, PageProvider } from '@tarojs/router-rn'
import { Component, Context, createContext, createElement, createRef, forwardRef, RefObject } from 'react'
import { AppState, Dimensions, EmitterSubscription, RefreshControl, ScrollView } from 'react-native'

import { isClassComponent } from './app'
import { Current } from './current'
import { eventCenter } from './emmiter'
import EventChannel from './EventChannel'
import { Instance, PageInstance } from './instance'
import { BackgroundOption, BaseOption, CallbackResult, HooksMethods, PageConfig, ScrollOption, TextStyleOption } from './types/index'
import { EMPTY_OBJ, errorHandler, getPageStr, incrementId, isArray, isFunction, successHandler } from './utils'

const compId = incrementId()

// 页面实例
const instances = new Map<string, Instance>()

// 对标小程序的实例
const pagesObj = new Map<string, PageInstance>()

function setPageObject (inst: PageInstance, id: string): void {
  pagesObj.set(id, inst)
}

function getPageObject (id: string): PageInstance | void {
  return pagesObj.get(id)
}

export function injectPageInstance (inst: Instance, id: string): void {
  instances.set(id, inst)
}

export function getPageInstance (id: string): Instance | undefined {
  return instances.get(id)
}

function getLifecyle (instance, lifecyle) {
  return instance[lifecyle]
}

function safeExecute (path: string, lifecycle: keyof Instance, ...args: unknown[]) {
  const instance = instances.get(path)
  if (instance == null) {
    return
  }
  const func = getLifecyle(instance, lifecycle)

  if (isArray(func)) {
    const res = func.map(fn => fn.apply(instance, args))
    return res[0]
  }
  if (!isFunction(func)) {
    return
  }

  return func.apply(instance, args)
}

const globalAny: any = global
// eslint-disable-next-line import/no-mutable-exports
export let PageContext: Context<string> = EMPTY_OBJ

// APP 前后台状态发生变化时调用对应的生命周期函数
let appState = AppState.currentState

AppState.addEventListener('change', (nextAppState) => {
  const { page, app, router } = Current
  if (!page) return
  if (appState.match(/inactive|background/) && nextAppState === 'active') {
    app?.onShow && app.onShow({
      path: router?.path,
      query: router?.params
    })
    if (!page.__isReactComponent && page.__safeExecute) {
      page.__safeExecute('componentDidShow')
    } else if (page.onShow) {
      page.onShow()
    }
  }
  if (appState === 'active' && nextAppState.match(/inactive|background/)) {
    if (!page.__isReactComponent && page.__safeExecute) {
      page.__safeExecute('componentDidHide')
    } else if (page.onHide) {
      page.onHide()
    }
    app?.onHide && app.onHide()
  }
  appState = nextAppState
})
// 屏幕宽高发生变化
Dimensions.addEventListener('change', ({ window }) => {
  const { page } = Current
  if (!page) return
  if (!page.__isReactComponent && page.__safeExecute) {
    page.__safeExecute('onResize', { size: window })
  } else {
    if (page.onResize) {
      page.onResize({ size: window })
    }
  }
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createPageConfig (Page: any, pageConfig: PageConfig): any {
  const h = createElement
  const pagePath = pageConfig.pagePath.replace(/^\//, '') || ''

  const isReactComponent = isClassComponent(Page)
  if (PageContext === EMPTY_OBJ) {
    PageContext = createContext('')
  }

  let ScreenPage = Page
  if (!isReactComponent) {
    // eslint-disable-next-line react/display-name
    ScreenPage = forwardRef((props, ref) => {
      return h(Page, { forwardRef: ref, ...props }, null)
    })
  }

  const WrapScreen = (Screen: any) => {
    return class PageScreen extends Component<any, any> {
      screenRef: RefObject<any>
      pageScrollView: RefObject<any>
      unSubscribleBlur: any
      unSubscribleFocus: any
      unSubscribleTabPress: any
      pageId: string
      dimensionsSubscription: EmitterSubscription | undefined
      isPageReady: boolean

      constructor (props: any) {
        super(props)
        const refreshStyle = globalAny?.__taroRefreshStyle ?? {}
        const backgroundTextStyle = pageConfig.backgroundTextStyle || globalAny.__taroAppConfig?.appConfig?.window?.backgroundTextStyle || 'dark'
        this.state = {
          refreshing: false, // 刷新指示器
          textColor: refreshStyle.textColor || (backgroundTextStyle === 'dark' ? '#000000' : '#ffffff'),
          backgroundColor: refreshStyle.backgroundColor || '#ffffff'
        }
        appState = AppState.currentState
        this.screenRef = createRef<Instance>()
        this.pageScrollView = createRef()
        this.setPageInstance()
        this.pageId = `taro_page_${compId()}`
      }

      componentDidMount () {
        const { navigation, route } = this.props
        // 实现 useLoad hook
        // handleHooksEvent 在组件构造函数中调用不生效，只能在挂载之后进行调用
        this.handleHooksEvent('onLoad', route?.params ?? {})
        if (navigation) {
          this.unSubscribleTabPress = navigation.addListener('tabPress', () => this.onTabItemTap())
          this.unSubscribleFocus = navigation.addListener('focus', () => this.onFocusChange())
          this.unSubscribleBlur = navigation.addListener('blur', () => this.onBlurChange())
        }
        eventCenter.on('__taroPullDownRefresh', this.pullDownRefresh, this)
        eventCenter.on('__taroPageScrollTo', this.pageToScroll, this)
        eventCenter.on('__taroSetRefreshStyle', this.setRefreshStyle, this)
        
        // 如果是tabbar页面，因为tabbar是懒加载的，第一次点击事件还未监听，不会触发，初始化触发一下
        const lazy = globalAny.__taroAppConfig?.appConfig?.rn?.tabOptions?.lazy ?? true
        if(isTabPage() && lazy){
          this.onTabItemTap()
        }
      }

      componentWillUnmount () {
        const { navigation, route } = this.props
        eventCenter.off('__taroPullDownRefresh', this.pullDownRefresh, this)
        eventCenter.off('__taroPageScrollTo', this.pageToScroll, this)
        eventCenter.off('__taroSetRefreshStyle', this.setRefreshStyle, this)
        if (navigation) {
          this.unSubscribleTabPress()
          this.unSubscribleBlur()
          this.unSubscribleFocus()
        }
        if (route && route.key) {
          pagesObj.delete(route.key)
        }
        // 实现 useUnload hook
        this.handleHooksEvent('onUnload')
      }

      setPageInstance () {
        const pageRef = this.screenRef
        const pageId = this.pageId
        const { params = {}, key = '' } = this.props.route
        // 和小程序的page实例保持一致
        const inst: PageInstance = {
          config: pageConfig,
          route: pagePath,
          options: params,
          __isReactComponent: isReactComponent,
          __safeExecute (lifecycle, ...rest) {
            safeExecute(pageId, lifecycle, ...rest)
          },
          onReady () {
            const page = pageRef.current
            if (page != null && isFunction(page.componentDidMount)) {
              page.componentDidMount && page.componentDidMount()
            } else {
              safeExecute(pageId, 'onReady')
            }
          },
          onShow () {
            const page = pageRef.current
            if (page != null && isFunction(page.componentDidShow)) {
              page.componentDidShow && page.componentDidShow()
            } else {
              safeExecute(pageId, 'componentDidShow')
            }
          },
          onHide () {
            const page = pageRef.current
            if (page != null && isFunction(page.componentDidHide)) {
              page.componentDidHide && page.componentDidHide()
            } else {
              safeExecute(pageId, 'componentDidHide')
            }
          },
          onPullDownRefresh () {
            const page = pageRef.current
            if (page != null && isFunction(page.onPullDownRefresh)) {
              page.onPullDownRefresh && page.onPullDownRefresh()
            } else {
              safeExecute(pageId, 'onPullDownRefresh')
            }
          },
          onReachBottom () {
            const page = pageRef.current
            if (page != null && isFunction(page.onReachBottom)) {
              page.onReachBottom && page.onReachBottom()
            } else {
              safeExecute(pageId, 'onReachBottom')
            }
          },
          onPageScroll (options) {
            const page = pageRef.current
            if (page != null && isFunction(page.onPageScroll)) {
              page.onPageScroll && page.onPageScroll(options)
            } else {
              safeExecute(pageId, 'onPageScroll', options)
            }
          },
          onResize (options) {
            const page = pageRef.current
            if (page != null && isFunction(page.onResize)) {
              page.onResize && page.onResize(options)
            } else {
              safeExecute(pageId, 'onResize', options)
            }
          },
          onTabItemTap (options) {
            const page = pageRef.current
            if (page != null && isFunction(page.onTabItemTap)) {
              page.onTabItemTap && page.onTabItemTap(options)
            } else {
              safeExecute(pageId, 'onTabItemTap', options)
            }
          },
          onUnload () {
            const page = pageRef.current
            if (page != null && isFunction(page.componentWillUnmount)) {
              page.componentWillUnmount && page.componentWillUnmount()
            } else {
              safeExecute(pageId, 'onUnload')
            }
          },
          getOpenerEventChannel () {
            return EventChannel.pageChannel
          }
        }
        // 存储对应小程序的实例
        setPageObject(inst, key)

        Current.router = {
          params: params,
          path: pagePath.startsWith('/') ? pagePath : `/${pagePath}`
        }
        Current.page = inst
      }

      pullDownRefresh = (path, refresh) => {
        if (getPageStr(path) === getPageStr(pagePath)) {
          this.setState({ refreshing: refresh })
        }
      }

      setRefreshStyle = () => {
        const refreshStyle = globalAny?.__taroRefreshStyle ?? {}
        this.setState({
          textColor: refreshStyle.textColor || '#ffffff',
          backgroundColor: refreshStyle.backgroundColor || '#ffffff'
        })
      }

      pageToScroll = ({ path = '', scrollTop = 0 }) => {
        if (getPageStr(path) === getPageStr(pagePath)) {
          this.pageScrollView?.current?.scrollTo({ x: 0, y: scrollTop, animated: true })
        }
      }

      onFocusChange () {
        // 页面切换，当前instance重新赋值
        this.setPageInstance()
        try {
          this.handleHooksEvent('componentDidShow')
          // 实现 useReady hook，遵循小程序事件机制，在useDidShow之后触发
          if(!this.isPageReady){
            this.handleHooksEvent('onReady')
            this.isPageReady = true
          }
          this.screenRef?.current?.componentDidShow?.()
        } catch (err) {
          throw new Error(err)
        }
      }

      onBlurChange () {
        try {
          this.handleHooksEvent('componentDidHide')
          if (this.screenRef?.current?.componentDidHide) { this.screenRef?.current?.componentDidHide() }
        } catch (err) {
          throw new Error(err)
        }
      }

      onPageScroll (e) {
        if(!e?.nativeEvent) return
        const { contentOffset } = e.nativeEvent
        const scrollTop = contentOffset.y
        if (scrollTop < 0) return
        try {
          this.handleHooksEvent('onPageScroll', { scrollTop })
          if (this.screenRef?.current?.onPageScroll) { this.screenRef?.current?.onPageScroll({ scrollTop }) }
        } catch (err) {
          throw new Error(err)
        }
      }

      // 监听的onMomentumScrollEnd
      onReachBottom (e) {
        if(!e?.nativeEvent) return
        const { onReachBottomDistance = 50 } = pageConfig
        const { layoutMeasurement, contentSize, contentOffset } = e.nativeEvent
        if (contentOffset?.y + layoutMeasurement?.height + onReachBottomDistance >= contentSize.height) {
          try {
            this.handleHooksEvent('onReachBottom')
            if (this.screenRef?.current?.onReachBottom) { this.screenRef?.current?.onReachBottom() }
          } catch (err) {
            throw new Error(err)
          }
        }
      }

      // 下拉刷新
      onPullDownRefresh () {
        this.setState({ refreshing: true })
        try {
          this.handleHooksEvent('onPullDownRefresh')
          if (this.screenRef?.current?.onPullDownRefresh) { this.screenRef?.current?.onPullDownRefresh() }
        } catch (e) {
          throw new Error(e)
        } finally {
          this.setState({ refreshing: false })
        }
      }

      onTabItemTap () {
        try {
          const item = this.getTabItem(pagePath)
          this.handleHooksEvent('onTabItemTap', { ...item })
          if (this.screenRef?.current?.onTabItemTap) { this.screenRef?.current?.onTabItemTap(item) }
        } catch (error) {
          throw new Error(error)
        }
      }

      handleHooksEvent (method: HooksMethods, options: Record<string, unknown> = {}) {
        if (!isReactComponent) {
          return safeExecute(this.pageId, method, options)
        }
      }

      getTabItem (itemPath: string) {
        const tabBar = globalAny.__taroAppConfig?.appConfig?.tabBar || {}
        if (!tabBar) return ''
        let result: Record<string, unknown> = {}
        for (let i = 0; i < tabBar.list.length; i++) {
          const item = tabBar.list[i]
          const path = item.pagePath.replace(/^\//, '') || ''
          if (getPageStr(path) === getPageStr(itemPath)) {
            result = {
              index: i,
              pagePath: path,
              text: item.text
            }
          }
        }
        return result
      }

      isEnablePullDown () {
        const windowOptions = globalAny.__taroAppConfig?.appConfig?.window || {}
        const { enablePullDownRefresh = false } = windowOptions
        return pageConfig?.enablePullDownRefresh || enablePullDownRefresh
      }

      refreshPullDown () {
        const { refreshing, textColor, backgroundColor } = this.state
        return createElement(RefreshControl, {
          refreshing: refreshing,
          enabled: true,
          titleColor: textColor,
          tintColor: textColor,
          colors: [backgroundColor],
          onRefresh: () => this.onPullDownRefresh()
        }, null)
      }

      createPage () {
        return h(PageProvider, { currentPath: pagePath, pageConfig, ...this.props },
          h(PageContext.Provider, { value: this.pageId }, h(Screen,
            { ...this.props, ref: this.screenRef })
          )
        )
      }

      createScrollPage () {
        let bgColor = pageConfig.backgroundColor ? pageConfig.backgroundColor : ''
        const windowOptions = globalAny.__taroAppConfig?.appConfig?.window || {}
        const useNativeStack =  globalAny.__taroAppConfig?.appConfig?.rn?.useNativeStack
        if (!bgColor && windowOptions?.backgroundColor) {
          bgColor = windowOptions?.backgroundColor
        }
        const refresh = this.isEnablePullDown() ? { refreshControl: this.refreshPullDown() } : {}
        return h(ScrollView, {
          style: [{ flex: 1 }, (bgColor ? { backgroundColor: bgColor } : {})],
          contentContainerStyle: useNativeStack ? {} : { minHeight: '100%' },
          ref: this.pageScrollView,
          scrollEventThrottle: 8,
          ...refresh,
          onScroll: (e) => this.onPageScroll(e),
          onMomentumScrollEnd: (e) => this.onReachBottom(e)
        }, this.createPage())
      }

      render () {
        const { disableScroll = false } = pageConfig
        return (!disableScroll ? this.createScrollPage() : this.createPage())
      }
    }
  }

  const pageComponet = WrapScreen(ScreenPage)

  return pageComponet
}

export function startPullDownRefresh (options: BaseOption = {}): Promise<CallbackResult> {
  const currentPage = Current.page
  const path = currentPage?.route
  const { success, fail, complete } = options
  let errMsg = 'startPullDownRefresh:ok'
  try {
    eventCenter.trigger('__taroPullDownRefresh', { path, refresh: true })
    success?.({ errMsg })
    complete?.({ errMsg })
    return Promise.resolve({ errMsg })
  } catch (error) {
    errMsg = 'startPullDownRefresh:fail'
    fail?.({ errMsg })
    complete?.({ errMsg })
    return Promise.reject(error)
  }
}

export function stopPullDownRefresh (options: BaseOption = {}): Promise<CallbackResult> {
  const currentPage = Current.page
  const path = currentPage?.route
  const { success, fail, complete } = options
  let errMsg = 'stopPullDownRefresh:ok'
  try {
    eventCenter.trigger('__taroPullDownRefresh', { path, refresh: false })
    success?.({ errMsg })
    complete?.({ errMsg })
    return Promise.resolve({ errMsg })
  } catch (error) {
    errMsg = 'stopPullDownRefresh:fail'
    fail?.({ errMsg })
    complete?.({ errMsg })
    return Promise.reject(error)
  }
}

export function pageScrollTo (options: ScrollOption = {}) {
  const currentPage = Current.page
  const path = currentPage?.route
  const { success, fail, complete, scrollTop = 0 } = options
  let errMsg = 'pageScrollTo:ok'
  try {
    eventCenter.trigger('__taroPageScrollTo', { path, scrollTop })
    success?.({ errMsg })
    complete?.({ errMsg })
    return Promise.resolve({ errMsg })
  } catch (error) {
    errMsg = 'pageScrollTo:fail'
    fail?.({ errMsg })
    complete?.({ errMsg })
    return Promise.reject(error)
  }
}

// 仅支持android
export function setBackgroundColor (options: BackgroundOption) {
  const { backgroundColor, success, fail, complete } = options
  const errMsg = ' setBackgroundColor: ok'
  const refreshStyle = globalAny.__taroRefreshStyle || {}
  try {
    refreshStyle.backgroundColor = backgroundColor
    globalAny.__taroRefreshStyle = refreshStyle
    eventCenter.trigger('__taroSetRefreshStyle')
    return successHandler(success, complete)({ errMsg })
  } catch (error) {
    const errMsg = ' setBackgroundColor: error'
    return errorHandler(fail, complete)({ errMsg })
  }
}

// 仅支持ios
export function setBackgroundTextStyle (options: TextStyleOption) {
  const { textStyle, success, fail, complete } = options
  const textColor = textStyle === 'dark' ? '#000000' : '#ffffff'
  const errMsg = ' setBackgroundTextStyle: ok'
  const refreshStyle = globalAny.__taroRefreshStyle || {}
  try {
    refreshStyle.textColor = textColor
    globalAny.__taroRefreshStyle = refreshStyle
    eventCenter.trigger('__taroSetRefreshStyle')
    return successHandler(success, complete)({ errMsg })
  } catch (error) {
    const errMsg = ' setBackgroundTextStyle: error'
    return errorHandler(fail, complete)({ errMsg })
  }
}

export function getCurrentPages () {
  const pages: PageInstance[] = []
  const routes = getCurrentRoute()
  if (routes && routes.length > 0) {
    routes.forEach(item => {
      const inst = getPageObject(item)
      inst && pages.push(inst)
    })
  } else { // 第一次初始化时，getCurrentRoute会为空
    const inst = Current.page
    inst && pages.push(inst)
  }
  return pages
}
