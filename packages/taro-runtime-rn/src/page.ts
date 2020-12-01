import * as React from 'react'
import { ScrollView, RefreshControl, AppState, View, Dimensions } from 'react-native'
import { camelCase } from 'lodash'
import { PageProvider } from '@tarojs/router-rn'
import { isFunction, EMPTY_OBJ, isArray, incrementId } from './utils'
import { isClassComponent } from './app'
import { Current } from './current'
import { Instance, PageInstance } from './instance'
import { PageConfig, HooksMethods } from './types/index'

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
      return h(View, { ...newProps }, h(Page, { ...props }, null))
    })
  }

  const pageRef = React.createRef<Instance>()

  // 和小程序的page实例保持一致
  const inst: PageInstance = {
    config: pageConfig,
    route: pagePath,
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
      if (page != null && isFunction(page.onReachBottom)) {
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
    }
  }

  // 存储对应小程序的实例
  setPageObject(inst, pageId)

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

      constructor (props: any) {
        super(props)
        this.state = {
          refreshing: false, // 刷新指示器
          appState: AppState.currentState
        }
        const { params = {} } = this.props.route
        Current.router = {
          params: params,
          path: pagePath
        }
        //
        this.screenRef = pageRef
        this.pageScrollView = React.createRef()
      }

      componentDidMount () {
        const { navigation } = this.props
        // 退到后台的触发对应的生命周期函数
        AppState.addEventListener('change', (nextAppState) => this.onAppStateChange(nextAppState))
        // 屏幕宽高发送变化
        Dimensions.addEventListener('change', ({ window }) => this.onResize({ window }))

        this.unSubscribleTabPress = navigation.addListener('tabPress', () => this.onTabItemTap())
        this.unSubscribleFocus = navigation.addListener('focus', () => this.onFocusChange())
        this.unSubscribleBlur = navigation.addListener('blur', () => this.onBlurChange())
      }

      componentWillUnmount () {
        AppState.removeEventListener('change', () => this.onAppStateChange)
        Dimensions.removeEventListener('change', ({ window }) => this.onResize({ window }))
        this.unSubscribleTabPress()
        this.unSubscribleBlur()
        this.unSubscribleFocus()
      }

      onFocusChange () {
        Current.page = getPageObject(pageId)
        const { params = {} } = this.props.route
        Current.router = {
          params: params,
          path: pagePath
        }
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

      onAppStateChange (nextAppState) {
        const { appState } = this.state
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
          this.handleHooksEvent('componentDidShow')
          if (this.screenRef?.current?.componentDidShow) { this.screenRef?.current?.componentDidShow() }
        } else {
          this.handleHooksEvent('componentDidHide')
          if (this.screenRef?.current?.componentDidHide) { this.screenRef?.current?.componentDidHide() }
        }
        this.setState({ appState: nextAppState })
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

      onResize ({ window }) {
        try {
          this.handleHooksEvent('onResize', { size: window })
          if (this.screenRef?.current?.onResize) { this.screenRef?.current?.onResize({ size: window }) }
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

      refreshPullDown () {
        const { refreshing } = this.state
        return React.createElement(RefreshControl, {
          refreshing: refreshing,
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
        const { enablePullDownRefresh = false } = pageConfig
        const refresh = enablePullDownRefresh ? { refreshControl: this.refreshPullDown() } : {}
        return h(ScrollView, {
          style: { flex: 1 },
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

  Current.page = inst

  return pageComponet
}
