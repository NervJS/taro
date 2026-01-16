import { createComponent, h, render } from '@tarojs/plugin-framework-solid/dist/reconciler'
import { Current, document, eventCenter } from '@tarojs/runtime'
import { hooks } from '@tarojs/shared'
import { batch, createContext, createRoot, createSignal, For } from 'solid-js'

import { setReconciler } from './connect'
import { getPageInstance, injectPageInstance } from './page'
import { EMPTY_OBJ, HOOKS_APP_ID, setDefaultDescriptor, setRouterParams } from './utils'

import type { AppInstance, Instance, PageLifeCycle, PageProps, ReactAppInstance } from '@tarojs/runtime'
import type { AppConfig } from '@tarojs/taro'
import type { SolidComponent } from './connect'

export const ReactMeta = {
  R: EMPTY_OBJ,
  Container: EMPTY_OBJ,
  PageContext: EMPTY_OBJ
}

export function createSolidApp(App: SolidComponent, config: AppConfig) {
  setReconciler()

  if (ReactMeta.PageContext === EMPTY_OBJ) {
    ReactMeta.PageContext = createContext<string>()
  }

  let appRef: ReactAppInstance
  function getAppInstance(): any {
    return appRef
  }

  function renderReactRoot() {
    const appId = config?.appId || 'app'

    if (ReactMeta.Container === EMPTY_OBJ) {
      const Container = document.getElementById(appId)

      Container.id = appId
      ReactMeta.Container = Container
    }

    const root = createRoot(() => ReactMeta.Container)
    render(AppWrapper, root)
  }
  const [pages, setPages] = createSignal<any[]>([])
  const [elements, setElements] = createSignal<any[]>([])

  function AppWrapper () {
    appRef = {} as unknown as ReactAppInstance
    return createComponent(App, {
      children: createComponent(For as unknown as SolidComponent, {
        get each() {
          return pages()
        },
        children: ({ id, component }) => {
          const children = () =>
            createComponent(ReactMeta.PageContext.Provider as unknown as SolidComponent, {
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

          return h(
            'taro-page',
            { id, className: 'taro_page' },
            children
          )
        },
      }),
    })
  }

  renderReactRoot()

  const app: AppInstance = Object.create(
    {
      mount(component: SolidComponent, id: string, cb: () => void) {
        setPages((old) => [
          ...old,
          { id, component },
        ])
        batch(cb)
      },
      unmount(id: string, cb: () => void) {
        const idx = elements().findIndex((item) => item.id === id)
        setElements((old) => {
          old.splice(idx, 1)
          return old
        })
        batch(cb)
      },
    },
    {
      config: setDefaultDescriptor({
        configurable: true,
        value: config,
      }),

      onLaunch: setDefaultDescriptor({
        value(options) {
          setRouterParams(options)

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
          eventCenter.trigger('__taroRouterLaunch', options)
        },
      }),
      onShow: setDefaultDescriptor({
        value(options) {
          setRouterParams(options)
          triggerAppHook('onShow', options)
        },
      }),
      onHide: setDefaultDescriptor({
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

  Current.app = app
  return app
}
