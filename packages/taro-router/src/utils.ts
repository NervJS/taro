import { RouterConfig } from './router'
export let routesAlias = {}

export function setRoutesAlias (alias) {
  routesAlias = alias
}

export function addLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
}

// 解决navigateBack调用delta>1时,路由栈异常问题
// 比如:A->B->C,navigateBack({delta: 2}),此时路由栈中还存在B页面
// 原因:主要是由于一次性退出多层级页面时,此action只会执行一次,此处进行手动处理
export let historyBackDelta = 1
export function setHistoryBackDelta (delta: number) {
  historyBackDelta = delta
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const throttle = (fn: Function, threshold: number) => {
  let lastTime = 0
  return function () {
    const now = Date.now()
    if (now - lastTime > threshold) {
      fn.apply(this, arguments)
      lastTime = now
    }
  }
}

export const stripBasename = (path, basename = '') => path.startsWith(basename) ? path.replace(basename, '') : path

export const isTabBar = (config: RouterConfig): boolean => {
  const { customRoutes = {}, basename = '', pathname } = config.router
  const routePath = stripBasename(pathname, basename)
  const pagePath = Object.entries(customRoutes).find(
    ([, target]) => target === routePath
  )?.[0] || routePath

  return !!pagePath && (config.tabBar?.list || []).some(t => t.pagePath === pagePath)
}
