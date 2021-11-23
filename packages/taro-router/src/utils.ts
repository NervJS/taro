import { stripBasename } from './history'
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

export const isTabBar = (config: RouterConfig): boolean => {
  const { customRoutes = {}, basename = '', pathname } = config.router
  const routePath = stripBasename(pathname, basename)
  const pagePath = Object.entries(customRoutes).find(
    ([, target]) => target === routePath
  )?.[0] || routePath

  return !!pagePath && (config.tabBar?.list || []).some(t => t.pagePath === pagePath)
}
