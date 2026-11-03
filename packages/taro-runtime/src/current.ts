import { AppInstance, PageInstance } from './dsl/instance'

declare const getCurrentPage: any

export interface Router {
  params: Record<string, unknown>
  path: string
  $taroPath: string
  onReady: string
  onHide: string
  onShow: string
  exitState?: any
}

interface Current {
  app: AppInstance | null
  router: Router | null
  page: PageInstance | null
  preloadData?: any
}

export const Current: Current = {
  app: null,
  router: null,
  page: null
}

export const getCurrentInstance = (): Current => {
  const currentPage = getCurrentPageSafe()
  // _isFramesetEnabled为鸿蒙ASCF小程序分栏模式开启的标识，_isFramesetEnabled为true时，适配getCurrentInstance接口支持分栏模式
  if (currentPage?._isFramesetEnabled !== true) {
    return Current
  }
  return getFramesetInstance(currentPage)
}

/**
 * getCurrentPage为鸿蒙ASCF小程序支持的全局接口，支持分栏模式下返回对应分栏的page
 */
function getCurrentPageSafe (): any {
  try {
    return typeof getCurrentPage === 'function' ? getCurrentPage() : undefined
  } catch {
    return undefined
  }
}

/**
 * 取分栏页内快照（_taroInstance），在onLoad首次访问时基于 Current 创建并缓存
 * app/router/page 固化于创建时刻，隔离子页面切换污染
 * preloadData 全局共享，通过 getter/setter 代理回 Current.preloadData
 */
function getFramesetInstance (page: any): Current {
  if (!page._taroInstance) {
    page._taroInstance = {
      app: Current.app,
      router: Current.router,
      page: Current.page,
      get preloadData () { return Current.preloadData },
      set preloadData (v) { Current.preloadData = v }
    }
  }
  return page._taroInstance
}
