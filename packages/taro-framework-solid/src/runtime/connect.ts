/** @TODO createElement setProp 在solid-js/web中导出不报错 */
import { createComponent, createElement, insert, render, setProp } from '@tarojs/plugin-framework-solid/dist/reconciler'
import {
  Current,
  document,
  getPageInstance,
  HOOKS_APP_ID,
  injectPageInstance,
  Instance,
  PAGE_INIT,
  perf
} from '@tarojs/runtime'
import { hooks } from '@tarojs/shared'
import { batch, createSignal, For } from 'solid-js'

import { PageContext } from './context'
import { ensureIsArray, setDefaultDescriptor, setRouterParams } from './utils'

import type { AppInstance, PageLifeCycle, PageProps, TaroNode } from '@tarojs/runtime'

type SolidComponent = (props?: any) => TaroNode;

export function setReconciler () {
  hooks.tap('getLifecycle', function (instance, lifecycle: string) {
    return instance[lifecycle]
  })

  hooks.tap('modifyMpEvent', function (event) {
    // Note: ohos 上事件没有设置 type 类型 setter 方法导致报错
    Object.defineProperty(event, 'type', {
      value: event.type.replace(/-/g, '')
    })
  })

  hooks.tap('batchedEventUpdates', function (cb) {
    batch(cb)
  })

  hooks.tap('mergePageInstance', function (prev, next) {
    if (!prev || !next) return

    // 子组件使用 lifecycle hooks 注册了生命周期后，会存在 prev，里面是注册的生命周期回调。

    // prev 使用 Object.create(null) 创建，H5 的 fast-refresh 可能也会导致存在 prev，要排除这些意外产生的 prev
    if ('constructor' in prev) return

    Object.keys(prev).forEach(item => {
      const prevList = prev[item]
      const nextList = ensureIsArray<() => any>(next[item])
      next[item] = nextList.concat(prevList)
    })
  })

  // TODO 使用 solid 时，暂不支持以下事件 createPullDownComponent
}

/**
 * 桥接小程序 App 构造器和 React 渲染流程
 * @param App 用户编写的入口组件
 * @param react 框架
 * @param dom 框架渲染器
 * @param config 入口组件配置 app.config.js 的内容
 * @returns 传递给 App 构造器的对象 obj ：App(obj)
 */
export function createSolidApp (App: SolidComponent, config) {
  setReconciler()

  const appRef: AppInstance = {
    mount: () => { },
    unmount: () => { }
  }
  function getAppInstance (): any {
    return appRef
  }

  const AppWrapper = () => {
    const [pages, setPages] = createSignal<any[]>([])

    appRef.mount = (component: SolidComponent, id: string) => {
      setPages((old) => {
        return [...old, { id, component }]
      })
    }

    appRef.unmount = (id) => {
      setPages(
        pages().filter((item) => {
          return item.id !== id
        })
      )
    }

    return createComponent(App, {
      ref: appRef,
      children: createComponent(For as unknown as SolidComponent, {
        get each () {
          return pages()
        },
        children: ({ id, component }) => {
          const children = () => {
            return createComponent(PageContext.Provider as unknown as SolidComponent, {
              value: id,
              children: () => {
                injectPageInstance({ id: id, type: 'page' } as unknown as Instance<PageProps>, id)
                return createComponent(component, {
                  tid: id,
                })
              },
            })
          }
          const root = process.env.TARO_PLATFORM === 'web' ? document.createElement('div') : createElement('root')
          if (process.env.TARO_PLATFORM === 'web') {
            root.setAttribute('id', id)
            root.classList.add('taro_page')
          } else {
            setProp(root, 'id', id)
          }
          insert(root, children)
          return root
        },
      }),
    })
  }

  function renderSolidRoot () {
    let appId = 'app'
    if (process.env.TARO_PLATFORM === 'web') {
      appId = config?.appId || appId
    }
    const container = document.getElementById(appId)
    render(AppWrapper, container)
  }

  if (process.env.TARO_PLATFORM !== 'web') {
    renderSolidRoot()
  }

  const [ONLAUNCH, ONSHOW, ONHIDE] = hooks.call('getMiniLifecycleImpl')!.app

  const appObj: AppInstance = Object.create(
    {
      mount (component: SolidComponent, id: string, cb: () => void) {
        const appInstance = getAppInstance()
        appInstance?.mount(component, id)
        batch((...args) => {
          perf.stop(PAGE_INIT)
          return cb(...args)
        })
      },
      unmount (id: string, cb: () => void) {
        const appInstance = getAppInstance()
        appInstance?.unmount(id)
        batch(cb)
      },
    },
    {
      config: setDefaultDescriptor({
        configurable: true,
        value: config,
      }),

      [ONLAUNCH]: setDefaultDescriptor({
        value (options) {
          setRouterParams(options)

          if (process.env.TARO_PLATFORM === 'web') {
            renderSolidRoot()
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
        value (options) {
          setRouterParams(options)
          triggerAppHook('onShow', options)
        },
      }),
      [ONHIDE]: setDefaultDescriptor({
        value () {
          triggerAppHook('onHide')
        },
      }),
      onError: setDefaultDescriptor({
        value (error: string) {
          triggerAppHook('onError', error)
        },
      }),
      onPageNotFound: setDefaultDescriptor({
        value (res: unknown) {
          triggerAppHook('onPageNotFound', res)
        },
      }),
    }
  )

  function triggerAppHook (lifecycle: keyof PageLifeCycle | keyof AppInstance, ...option) {
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
