import { AppConfig, PageConfig } from '@tarojs/taro'
import { IH5RouterConfig } from '@tarojs/taro/types/compile'

import { addLeadingSlash } from '../utils'

export interface Route extends PageConfig {
  path?: string
  load?: () => Promise<any>
}

export interface Router {
  mode: IH5RouterConfig['mode']
  basename: string
  customRoutes?: Record<string, string | string[]>
  pathname: string
  forcePath?: string
}

export interface SpaRouterConfig extends AppConfig {
  routes: Route[]
  router: Router
  // 下拉刷新组件
  PullDownRefresh?: any
}

export interface MpaRouterConfig extends AppConfig {
  route: Route,
  pageName: string
  router: Router
  // 下拉刷新组件
  PullDownRefresh?: any
}

export class RouterConfig {
  private static __config: SpaRouterConfig | MpaRouterConfig

  static set config (e: SpaRouterConfig | MpaRouterConfig) {
    this.__config = e
  }

  static get config () {
    return this.__config
  }

  static get pages () {
    return this.config.pages || []
  }

  static get router () {
    return this.config.router || {}
  }

  static get mode () {
    return this.router.mode || 'hash'
  }

  static get customRoutes () { return this.router.customRoutes || {} }

  static isPage (url = '') {
    return this.pages.findIndex(e => addLeadingSlash(e) === url) !== -1
  }
}
