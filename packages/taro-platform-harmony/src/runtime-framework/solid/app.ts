import { Current, document } from '@tarojs/runtime'
import { hooks, isWebPlatform } from '@tarojs/shared'
import { batch, createContext, createRoot, createSignal, For } from 'solid-js'

import { setReconciler } from './connect'
import { getPageInstance, injectPageInstance } from './page'
import { createComponent, h, render } from './reconciler'
import { EMPTY_OBJ, HOOKS_APP_ID, setDefaultDescriptor, setRouterParams } from './utils'

import type { AppInstance, Instance, PageLifeCycle, PageProps, ReactAppInstance } from '@tarojs/runtime'
import type { AppConfig } from '@tarojs/taro'
import type { Component } from './connect'

const isWeb = isWebPlatform()

export const ReactMeta = {
  R: EMPTY_OBJ,
  Container: EMPTY_OBJ,
  PageContext: EMPTY_OBJ
}

export function createSolidApp(App: Component, config: AppConfig) {
  setReconciler()

  if (ReactMeta.PageContext === EMPTY_OBJ) {
    ReactMeta.PageContext = createContext<string>()
  }

  let appRef: ReactAppInstance
  function getAppInstance(): any {
    return appRef
  }

  function renderReactRoot() {
    let appId = 'app'
    if (isWeb) {
      appId = config?.appId || appId
    }

    if (ReactMeta.Container === EMPTY_OBJ) {
      const Container = document.createElement('view')

      Container.id = appId
      ReactMeta.Container = Container
    }

    const root = createRoot(() => ReactMeta.Container)
    render(AppWrapper, root)
  }
  const [pages, setPages] = createSignal<any[]>([])

  function AppWrapper () {
    appRef = {} as unknown as ReactAppInstance
    return createComponent(App, {
      children: createComponent(For as unknown as Component, {
        get each() {
          return pages()
        },
        children: ({ id, component }) => {
          const children = () =>
            createComponent(ReactMeta.PageContext.Provider as unknown as Component, {
              value: id,
              children: () => {
                injectPageInstance(
                  { id: id, type: 'page' } as unknown as Instance<PageProps>,
                  id
                )
                return createComponent(component, {
                  tid: id,
                })
              },
            })

          if (isWeb) {
            return h('div', { id, className: 'taro_page' }, children)
          } else {
            return h('root', { id }, children)
          }
        },
      }),
    })
  }

  if (!isWeb) {
    renderReactRoot()
  }

  const [ONLAUNCH, ONSHOW, ONHIDE] = hooks.call('getMiniLifecycleImpl')!.app

  const appObj: AppInstance = Object.create(
    {
      mount(component: Component, id: string, cb: () => void) {
        setPages((old) => [
          ...old,
          { id, component },
        ])
        batch(cb)
      },

      unmount(id: string, cb: () => void) {
        setPages(
          pages().filter((item) => {
            return item.id !== id
          })
        )
        batch(cb)
      },
    },
    {
      config: setDefaultDescriptor({
        configurable: true,
        value: config,
      }),

      [ONLAUNCH]: setDefaultDescriptor({
        value(options) {
          setRouterParams(options)

          if (isWeb) {
            // 由于 H5 路由初始化的时候会清除 app 下的 dom 元素，所以需要在路由初始化后执行 render
            renderReactRoot()
          }

          const onLaunch = () => {
            const app = getAppInstance()

            if (app) {
              // 把 App Class 上挂载的额外属性同步到全局 app 对象中
              if (app.taroGlobalData) {
                const globalData = app.taroGlobalData
                const keys = Object.keys(globalData)
                const descriptors = Object.getOwnPropertyDescriptors(globalData)
                keys.forEach(key => {
                  Object.defineProperty(this, key, {
                    configurable: true,
                    enumerable: true,
                    get () {
                      return globalData[key]
                    },
                    set (value) {
                      globalData[key] = value
                    }
                  })
                })
                Object.defineProperties(this, descriptors)
              }

              app.onCreate?.()
            }
          }

          onLaunch()
          triggerAppHook('onLaunch', options)
        },
      }),

      [ONSHOW]: setDefaultDescriptor({
        value(options) {
          setRouterParams(options)
          triggerAppHook('onShow', options)
        },
      }),

      [ONHIDE]: setDefaultDescriptor({
        value() {
          triggerAppHook('onHide')
        },
      }),

      onError: setDefaultDescriptor({
        value(error: string) {
          triggerAppHook('onError', error)
        },
      }),

      onPageNotFound: setDefaultDescriptor({
        value(res: unknown) {
          triggerAppHook('onPageNotFound', res)
        },
      }),
    }
  )

  function triggerAppHook(
    lifecycle: keyof PageLifeCycle | keyof AppInstance,
    ...option
  ) {
    const instance = getPageInstance(HOOKS_APP_ID)
    if (instance) {
      const app = getAppInstance()
      const func = hooks.call('getLifecycle', instance, lifecycle)
      if (Array.isArray(func)) {
        func.forEach((cb) => cb.apply(app, option))
      }
    }
  }

  Current.app = appObj
  return appObj
}
