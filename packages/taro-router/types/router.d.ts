import type { AppConfig, PageConfig } from '@tarojs/taro'
import type { IH5RouterConfig } from '@tarojs/taro/types/compile'

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
