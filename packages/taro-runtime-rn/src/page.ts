import * as React from 'react'
import { ScrollView, RefreshControl, AppState, View, Dimensions, EmitterSubscription, NativeEventSubscription } from 'react-native'
import { camelCase } from 'lodash'
import { PageProvider, getCurrentRoute } from '@tarojs/router-rn'
import { isFunction, EMPTY_OBJ, isArray, incrementId, successHandler, errorHandler } from './utils'
import { isClassComponent } from './app'
import { Current } from './current'
import { Instance, PageInstance } from './instance'
import { eventCenter } from './emmiter'
import EventChannel from './EventChannel'
import { PageConfig, HooksMethods, ScrollOption, BaseOption, BackgroundOption, TextStyleOption, CallbackResult } from './types/index'

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
export let PageContext: React.Context<string> = EMPTY_OBJ

// APP 前后台状态发生变化时调用对应的生命周期函数
let appState = AppState.currentState

AppState.addEventListener('change', (nextAppState) => {
  const { page } = Current
  if (!page) return
  if (appState.match(/inactive|background/) && nextAppState === 'active') {
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
  const h = React.createElement
  const pagePath = pageConfig.pagePath || ''

  const pageId = camelCase(pagePath) ?? `taro_page_${compId}`

  const isReactComponent = isClassComponent(Page)
  if (PageContext === EMPTY_OBJ) {
    PageContext = React.createContext('')
  }

  let ScreenPage = Page
  if (!isReactComponent) {
    // eslint-disable-next-line react/display-name
    ScreenPage = React.forwardRef((props, ref) => {
      const newProps: React.Props<any> = { ...props }
      newProps.ref = ref
      return h(View, {
        style: {
          minHeight: '100%'
        },
        ...newProps
      }, h(Page, { ...props }, null))
    })
  }

  // 注入的页面实例
  injectPageInstance(Page, pageId)

  const WrapScreen = (Screen: any) => {
    return class PageScreen extends React.Component<any, any> {
      // eslint-disable-next-line react/sort-comp
      screenRef: React.RefObject<any>
      pageScrollView: React.RefObject<any>
      unSubscribleBlur: any
      unSubscribleFocus: any
      unSubscribleTabPress: any
      appStateSubscription: NativeEventSubscription | undefined
      dimensionsSubscription: EmitterSubscription | undefined

      constructor (props: any) {
        super(props)
        const refreshStyle = globalAny?.__taroRefreshStyle ?? {}
        this.state = {
          refreshing: false, // 刷新指示器
          appState: AppState.currentState,
          textColor: refreshStyle.textColor || '#ffffff',
          backgroundColor: refreshStyle.backgroundColor || '#ffffff'
        }
        this.screenRef = React.createRef<Instance>()
        this.pageScrollView = React.createRef()
        this.setPageInstance()
      }

      componentDidMount () {
        const { navigation } = this.props

        if (navigation) {
          this.unSubscribleTabPress = navigation.addListener('tabPress', () => this.onTabItemTap())
          this.unSubscribleFocus = navigation.addListener('focus', () => this.onFocusChange())
          this.unSubscribleBlur = navigation.addListener('blur', () => this.onBlurChange())
        }
        eventCenter.on('__taroPullDownRefresh', this.pullDownRefresh, this)
        eventCenter.on('__taroPageScrollTo', this.pageToScroll, this)
        eventCenter.on('__taroSetRefreshStyle', this.setRefreshStyle, this)
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
      }

      setPageInstance () {
        const pageRef = this.screenRef
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
          path: pagePath
        }
        Current.page = inst
      }

      pullDownRefresh = (path, refresh) => {
        if (path === pagePath) {
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
        if (path === pagePath) {
          this.pageScrollView?.current?.scrollTo({ x: 0, y: scrollTop, animated: true })
        }
      }

      onFocusChange () {
        // 页面切换，当前instance重新赋值
        this.setPageInstance()
        try {
          this.handleHooksEvent('componentDidShow')
          if (this.screenRef?.current?.componentDidShow) {
            this.screenRef?.current?.componentDidShow()
          }
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
          return safeExecute(pageId, method, options)
        }
      }

      getTabItem (itemPath: string) {
        const tabBar = globalAny.__taroAppConfig?.appConfig?.tabBar || {}
        if (!tabBar) return ''
        let result: Record<string, unknown> = {}
        for (let i = 0; i < tabBar.list.length; i++) {
          const item = tabBar.list[i]
          const path = item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`
          if (path === itemPath) {
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
        return React.createElement(RefreshControl, {
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
          h(PageContext.Provider, { value: pageId }, h(Screen,
            { ...this.props, ref: this.screenRef })
          )
        )
      }

      createScrollPage () {
        let bgColor = pageConfig.backgroundColor ? pageConfig.backgroundColor : ''
        const windowOptions = globalAny.__taroAppConfig?.appConfig?.window || {}
        if (!bgColor && windowOptions?.backgroundColor) {
          bgColor = windowOptions?.backgroundColor
        }
        const refresh = this.isEnablePullDown() ? { refreshControl: this.refreshPullDown() } : {}
        return h(ScrollView, {
          style: [{ flex: 1 }, (bgColor ? { backgroundColor: bgColor } : {})],
          contentContainerStyle: { minHeight: '100%' },
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
