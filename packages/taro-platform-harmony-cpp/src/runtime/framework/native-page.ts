import { addLeadingSlash, CONTEXT_ACTIONS, Current, document, env, eventCenter, getPageById, initStyleSheetConfig, removePageById, requestAnimationFrame, setPageById, window } from '@tarojs/runtime'
import { EMPTY_OBJ, hooks, isUndefined } from '@tarojs/shared'

import { ReactMeta as reactMeta } from './app'
import { setReconciler } from './connect'
import { ON_HIDE, ON_READY, ON_SHOW } from './constant'
import {
  getOnHideEventKey,
  getOnReadyEventKey,
  getOnShowEventKey,
  getPath,
  injectPageInstance,
  removePageInstance,
  safeExecute,
} from './page'
import { incrementId, isClassComponent } from './utils'

import type { TaroElement, TFunc } from '@tarojs/runtime'
import type * as React from 'react'

const getNativeCompId = incrementId(1)
let h: typeof React.createElement
let ReactDOM

interface InitNativeComponentEntryParams {
  R: typeof React
  ReactDOM: typeof ReactDOM
  cb?: TFunc
  isUseReact18?: boolean
}

function initNativeComponentEntry (params: InitNativeComponentEntryParams) {
  const { R, ReactDOM, cb, isUseReact18 = true } = params

  interface IEntryState {
    components: {
      compId: string
      element: React.ReactElement
    }[]
  }

  interface IWrapperProps {
    compId: string
    getCtx: () => any
    renderComponent: (ctx: any) => React.ReactElement
  }

  class NativeComponentWrapper extends R.Component<IWrapperProps, Record<any, any>> {
    root = R.createRef<TaroElement>()
    ctx = this.props.getCtx()

    state = {
      hasError: false,
    }

    componentDidMount () {
      this.ctx.component = this
      if (this.root.current) {
        // @ts-ignore
        this.root.current = this.ctx
      }
    }

    // React 16 uncaught error 会导致整个应用 crash，
    // 目前把错误缩小到页面，否则任何页面的错误都会导致所有页面的白屏
    componentDidCatch (error, info: React.ErrorInfo) {
      if (Current.isDebug) {
        setTimeout(() => {
          throw Error(`[TARO_LOG] ErrorPage(${this.props.compId}) 报错信息：${error}\n${info.componentStack}`)
        }, 20)
      } else {
        console.error(`[TARO_LOG] ErrorPage(${this.props.compId}) 报错信息：${error}\n${info.componentStack}`)
      }
    }

    static getDerivedStateFromError (error) {
      return {
        hasError: !!error
      }
    }

    render () {
      return !this.state.hasError ? h(
        'taro-page',
        {
          ref: this.root,
          id: this.props.compId,
        },
        this.props.renderComponent(this.ctx)
      ) : null
    }
  }

  class Entry extends R.Component<Record<any, any>, IEntryState> {
    state: IEntryState = {
      components: [],
    }

    componentDidMount () {
      if (isUseReact18) {
        if (Current.entryAsync) {
          Current.entryAsync = Object.assign(this, Current.entryAsync)
        } else {
          Current.entryAsync = this
        }
      } else {
        if (Current.app) {
          Current.app = Object.assign(this, Current.app)
        } else {
          Current.app = this
        }
      }

      cb && cb()
    }

    mount (Component, compId, getCtx, cb?) {
      const isReactComponent = isClassComponent(R, Component)
      const inject = (node?: any) => node && injectPageInstance(node, compId)
      const refs = isReactComponent
        ? { ref: inject }
        : {
          forwardedRef: inject,
          reactReduxForwardedRef: inject,
        }
      if (reactMeta.PageContext === EMPTY_OBJ) {
        reactMeta.PageContext = R.createContext('')
      }
      const item = {
        compId,
        element: h(NativeComponentWrapper, {
          key: compId,
          compId,
          getCtx,
          renderComponent (ctx) {
            return h(
              reactMeta.PageContext.Provider,
              { value: compId },
              h(Component, {
                // TODO: 传递 Props
                ...(ctx.props || {}),
                ...refs,
                $scope: ctx,
              })
            )
          },
        }),
      }

      if (isUseReact18) {
        ReactDOM.flushSync(() => {
          this.setState(
            {
              components: [...this.state.components, item],
            },
            () => cb && cb()
          )
        })
      } else {
        this.setState(
          {
            components: [...this.state.components, item],
          },
          () => cb && cb()
        )
      }
    }

    unmount (compId, cb?) {
      const components = this.state.components
      const index = components.findIndex((item) => item.compId === compId)
      // 如果找不到对应compound，说明已经删，不用多余处理
      if (index === -1) return
      const next = [...components.slice(0, index), ...components.slice(index + 1)]

      if (isUseReact18) {
        ReactDOM.flushSync(() => {
          this.setState(
            {
              components: next,
            },
            () => {
              removePageInstance(compId)
              cb && cb()
            }
          )
        })
      } else {
        this.setState(
          {
            components: next,
          },
          () => {
            removePageInstance(compId)
            cb && cb()
          }
        )
      }
    }

    render () {
      const components = this.state.components

      return components.map(({ element }) => element)
    }
  }

  setReconciler(ReactDOM)

  // @ts-ignore
  const app = isUseReact18 ? document.entryAsync : document.app
  // eslint-disable-next-line react/no-deprecated
  if (isUseReact18) {
    const root = ReactDOM.createRoot(app)

    ReactDOM.flushSync(() => {
      root.render?.(h(Entry))
    })
  } else {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(h(Entry, {}), app)
  }
}

export { getPageById, removePageById, setPageById }

export function createNativePageConfig (
  Component,
  pageName: string,
  react: typeof React,
  reactDOM: typeof ReactDOM,
  pageConfig: any = {}
) {
  reactMeta.R = react
  h = react.createElement
  ReactDOM = reactDOM
  setReconciler(ReactDOM)
  const [ONLOAD, ONUNLOAD, ONREADY, ONSHOW, ONHIDE, LIFECYCLES, SIDE_EFFECT_LIFECYCLES] =
    hooks.call('getMiniLifecycleImpl')!.page
  let unmounting = false
  let prepareMountList: (() => void)[] = []
  let pageElement: TaroElement | null = null
  let loadResolver: (...args: unknown[]) => void
  let hasLoaded: Promise<void>
  const id = pageName ?? `taro_page_${getNativeCompId()}`
  const { isUseReact18 = true } = pageConfig

  function setCurrentRouter (page) {
    const router = page.route || page.__route__ || page.$taroPath
    Current.router = {
      params: page.$taroParams!,
      path: addLeadingSlash(router),
      $taroPath: page.$taroPath,
      onReady: getOnReadyEventKey(page.$taroPath),
      onShow: getOnShowEventKey(page.$taroPath),
      onHide: getOnHideEventKey(page.$taroPath),
      getEventName (eventName: string) {
        return `${page.$taroPath}.${eventName}`
      }
    }
    if (!isUndefined(page.exitState)) {
      Current.router.exitState = page.exitState
    }
  }

  const pageObj: Record<string, any> = {
    options: pageConfig,
    [ONLOAD] (options: Readonly<Record<string, unknown>> = {}, cb?: TFunc) {
      hasLoaded = new Promise((resolve) => {
        loadResolver = resolve
      })
      Current.page = this as any
      this.config = pageConfig || {}
      // this.$taroPath 是页面唯一标识
      const uniqueOptions = Object.assign({}, options, { $taroTimestamp: Date.now() })
      const $taroPath = (this.$taroPath = getPath(id, uniqueOptions))

      this.$isUseReact18 = isUseReact18

      setPageById(this, $taroPath)

      // this.$taroParams 作为暴露给开发者的页面参数对象，可以被随意修改
      if (this.$taroParams == null) {
        this.$taroParams = uniqueOptions
      }

      setCurrentRouter(this)
      window.trigger(CONTEXT_ACTIONS.INIT, $taroPath)

      const mountCallback = () => {
        pageElement = document.getElementById($taroPath)

        if (!pageElement) {
          console.error(`[TARO_LOG] Page Error: ${$taroPath}, 该页面执行时出现了报错，导致没有找到页面实例。`)
          return
        }

        safeExecute($taroPath, ONLOAD, this.$taroParams)
        loadResolver()
        cb && cb(pageElement)
        pageElement.ctx = this
      }

      let app = isUseReact18 ? Current.entryAsync : Current.app
      const mount = () => {
        if (!app) {
          initNativeComponentEntry({
            R: react,
            ReactDOM,
            isUseReact18,
            cb: () => {
              app = isUseReact18 ? Current.entryAsync : Current.app
              app!.mount!(Component, $taroPath, () => this, mountCallback)
            },
          })
        } else {
          app!.mount!(Component, $taroPath, () => this, mountCallback)
        }
      }

      if (unmounting) {
        prepareMountList.push(mount)
      } else {
        mount()
      }
    },
    [ONUNLOAD] () {
      const $taroPath = this.$taroPath
      // 销毁当前页面的上下文信息
      window.trigger(CONTEXT_ACTIONS.DESTORY, $taroPath)
      // 触发onUnload生命周期
      safeExecute($taroPath, ONUNLOAD)

      removePageById($taroPath)

      resetCurrent.call(this)
      unmounting = true

      const app = isUseReact18 ? Current.entryAsync : Current.app
      app!.unmount!($taroPath, () => {
        unmounting = false
        removePageInstance($taroPath)
        if (pageElement) {
          pageElement.ctx = null
          pageElement = null
        }
        if (prepareMountList.length) {
          prepareMountList.forEach((fn) => fn())
          prepareMountList = []
        }
      })
    },
    [ONREADY] () {
      hasLoaded.then(() => {
        // 触发生命周期
        safeExecute(this.$taroPath, ON_READY)
        // 通过事件触发子组件的生命周期
        requestAnimationFrame(() => eventCenter.trigger(getOnReadyEventKey(this.$taroPath)))
        this.onReady = {}
        this.onReady.called = true
      })
    },
    [ONSHOW] (options = {}) {
      hasLoaded.then(() => {
        // 设置 Current 的 page 和 router
        Current.page = this as any
        setCurrentRouter(this)

        if (this.__layoutSize && this.getNavHeight) {
          Current.nativeModule.updateDimensionContext(initStyleSheetConfig(this.__layoutSize, this.getNavHeight()))
        }
        // 恢复上下文信息
        window.trigger(CONTEXT_ACTIONS.RECOVER, this.$taroPath)
        // 触发生命周期
        safeExecute(this.$taroPath, ON_SHOW, options)
        // 通过事件触发子组件的生命周期
        requestAnimationFrame(() => eventCenter.trigger(getOnShowEventKey(this.$taroPath)))
      })
    },
    [ONHIDE] () {
      // 缓存当前页面上下文信息
      window.trigger(CONTEXT_ACTIONS.RESTORE, this.$taroPath)
      // 设置 Current 的 page 和 router
      if (Current.page === this) {
        Current.page = null
        Current.router = null
      }
      // 触发生命周期
      safeExecute(this.$taroPath, ON_HIDE)
      // 通过事件触发子组件的生命周期
      eventCenter.trigger(getOnHideEventKey(this.$taroPath))
    },
  }

  function resetCurrent () {
    if (Current.page === this) {
      // 小程序插件页面卸载之后返回到宿主页面时，需重置Current页面和路由。否则引发插件组件二次加载异常 fix:#11991
      Current.page = null
      Current.router = null
    }
  }

  LIFECYCLES.forEach((lifecycle) => {
    let isDefer = false
    lifecycle = lifecycle.replace(/^defer:/, () => {
      isDefer = true
      return ''
    })
    pageObj[lifecycle] = function () {
      const exec = () => {
        eventCenter.trigger(`${this.$taroPath}.${lifecycle}`, ...arguments)
        return safeExecute(this.$taroPath, lifecycle, ...arguments)
      }
      if (isDefer) {
        hasLoaded.then(exec)
      } else {
        return exec()
      }
    }
  })

  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  SIDE_EFFECT_LIFECYCLES.forEach((lifecycle) => {
    if (Component[lifecycle] || Component.prototype?.[lifecycle] || Component[lifecycle.replace(/^on/, 'enable')]) {
      pageObj[lifecycle] = function (...args) {
        const target = args[0]?.target
        if (target?.id) {
          const id = target.id
          const element = env.document.getElementById(id)
          if (element) {
            target.dataset = element.dataset
          }
        }
        eventCenter.trigger(`${this.$taroPath}.${lifecycle}`, ...arguments)
        return safeExecute(this.$taroPath, lifecycle, ...args)
      }
    }
  })

  hooks.call('modifyPageObject', pageObj)

  return pageObj
}

export function createNativeComponentConfig (
  Component,
  compName: string,
  react: typeof React,
  reactDOM,
  componentConfig: any = {}
) {
  reactMeta.R = react
  h = react.createElement
  ReactDOM = reactDOM
  setReconciler(ReactDOM)
  const { isUseReact18 = true } = componentConfig

  const componentObj: Record<string, any> = {
    options: componentConfig,
    onLoad (
      options: Readonly<Record<string, unknown>> = {}, // eslint-disable-line @typescript-eslint/no-unused-vars
      cb?: TFunc
    ) {
      let app = isUseReact18 ? Current.entryAsync : Current.app

      const mountComponent = () => {
        compName ??= `taro_comp_${getNativeCompId()}`
        const compId = (this.compId = getPath(compName, { $taroTimestamp: Date.now() }))

        this.config = componentConfig
        app = isUseReact18 ? Current.entryAsync : Current.app

        app!.mount!(
          Component,
          compId,
          () => this,
          () => {
            const el = document.getElementById(compId)

            if (!el) {
              throw new Error(`没有找到组件实例。`)
            } else {
              el.ctx = this
              cb && cb(el)
              safeExecute(compId, 'onLoad', options)
            }
          }
        )
      }

      if (!app) {
        initNativeComponentEntry({
          R: react,
          ReactDOM,
          isUseReact18,
          cb: mountComponent,
        })
      } else {
        mountComponent()
      }
    },

    onUnload () {
      const app = isUseReact18 ? Current.entryAsync : Current.app
      app!.unmount!(this.compId)
      safeExecute(this.compId, 'onUnload')
    },
  }

  return componentObj
}
