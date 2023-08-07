import { Current } from '@tarojs/runtime'
import { isArray, isFunction, isUndefined } from '@tarojs/shared'

import { ON_HIDE, ON_LOAD, ON_READY, ON_SHOW, ON_UNLOAD } from './contant'
import { incrementId } from './utils'

// TODO TYPE
const instances = new Map<string, any>()
const pageId = incrementId()

// TODO TYPE
export function injectPageInstance (inst: any, id: string) {
  instances.set(id, inst)
}

// TODO TYPE
export function getPageInstance (id: string): any {
  return instances.get(id)
}

export function removePageInstance (id: string) {
  instances.delete(id)
}

export function addLeadingSlash (path?: string): string {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
}

export function safeExecute (path: string, lifecycle: string, ...args: unknown[]) {
  const instance = instances.get(path)

  if (instance == null) {
    return
  }

  const func = instance[lifecycle]

  if (isArray(func)) {
    const res = func.map(fn => fn.apply(instance, args))
    return res[0]
  }

  if (!isFunction(func)) {
    return
  }

  return func.apply(instance, args)
}

export function stringify (obj?: Record<string, unknown>) {
  if (obj == null) {
    return ''
  }
  const path = Object.keys(obj).map((key) => {
    return key + '=' + obj[key]
  }).join('&')
  return path === '' ? path : '?' + path
}

export function getPath (id: string, options?: Record<string, unknown>): string {
  const idx = id.indexOf('?')

  return `${idx > -1 ? id.substring(0, idx) : id}${stringify(options)}`
}

export function getOnReadyEventKey (path: string) {
  return path + '.' + ON_READY
}

export function getOnShowEventKey (path: string) {
  return path + '.' + ON_SHOW
}

export function getOnHideEventKey (path: string) {
  return path + '.' + ON_HIDE
}

export function createPageConfig (component: any, pageName?: string) {
  // 小程序 Page 构造器是一个傲娇小公主，不能把复杂的对象挂载到参数上
  const id = pageName ?? `taro_page_${pageId()}`
  // TODO TYPE
  let pageElement: any = null
  let unmounting = false
  let prepareMountList: (() => void)[] = []

  // TODO TYPE
  function setCurrentRouter (page) {
    const router = page.route || page.__route__ || page.$taroPath

    Current.router = {
      params: page.$taroParams!,
      path: addLeadingSlash(router),
      $taroPath: page.$taroPath,
      onReady: getOnReadyEventKey(id),
      onShow: getOnShowEventKey(id),
      onHide: getOnHideEventKey(id)
    }

    if (!isUndefined(page.exitState)) {
      Current.router.exitState = page.exitState
    }
  }

  let loadResolver: (...args: any[]) => void
  let hasLoaded: Promise<void>
  const page = {
    onLoad (options: Readonly<Record<string, unknown>> = {}, cb?: (...args: any[]) => any) {
      hasLoaded = new Promise(resolve => { loadResolver = resolve })

      Current.page = this as any

      // this.$taroPath 是页面唯一标识
      const uniqueOptions = Object.assign({}, options, { $taroTimestamp: Date.now() })
      const $taroPath = this.$taroPath = getPath(id, uniqueOptions)

      // this.$taroParams 作为暴露给开发者的页面参数对象，可以被随意修改
      if (this.$taroParams == null) {
        this.$taroParams = uniqueOptions
      }

      setCurrentRouter(this)

      // window.trigger(CONTEXT_ACTIONS.INIT, $taroPath)

      const mount = () => {
        Current.app!.mount!(component, $taroPath, () => {
          // TODO TYPE env
          // pageElement = document.getElementById($taroPath)

          // if (!pageElement) {
          //   throw new Error(`没有找到页面实例。`)
          // }

          safeExecute($taroPath, ON_LOAD, this.$taroParams)
          loadResolver()
          cb && cb()
          // pageElement.ctx = this
          // pageElement.performUpdate(true, cb)
        })
      }

      if (unmounting) {
        prepareMountList.push(mount)
      } else {
        mount()
      }
    },
    onUnLoad () {
      const $taroPath = this.$taroPath
      // 销毁当前页面的上下文信息
      // window.trigger(CONTEXT_ACTIONS.DESTORY, $taroPath)

      // 触发onUnload生命周期
      safeExecute($taroPath, ON_UNLOAD)
      unmounting = true
      Current.app!.unmount!($taroPath, () => {
        unmounting = false
        instances.delete($taroPath)
        if (pageElement) {
          pageElement.ctx = null
          pageElement = null
        }
        if (prepareMountList.length) {
          prepareMountList.forEach(fn => fn())
          prepareMountList = []
        }
      })
    },
    onShow (options = {}) {
      hasLoaded.then(() => {
        // 设置 Current 的 page 和 router
        Current.page = this as any
        setCurrentRouter(this)
        // 恢复上下文信息
        // window.trigger(CONTEXT_ACTIONS.RECOVER, this.$taroPath)
        // 触发生命周期
        safeExecute(this.$taroPath, ON_SHOW, options)
        // TODO 通过事件触发子组件的生命周期
        // raf(() => eventCenter.trigger(getOnShowEventKey(id)))
      })
    },
    onHide () {
      // 缓存当前页面上下文信息
      // window.trigger(CONTEXT_ACTIONS.RESTORE, this.$taroPath)

      // 设置 Current 的 page 和 router
      if (Current.page === this) {
        Current.page = null
        Current.router = null
      }
      // 触发生命周期
      safeExecute(this.$taroPath, ON_HIDE)
      // TODO 通过事件触发子组件的生命周期
      // eventCenter.trigger(getOnHideEventKey(id))
    }
  }

  return page
}
