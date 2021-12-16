import { stripBasename } from './history'
import { RouterConfig } from './router'

export function addLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
}

class RoutesAlias {
  conf: Array<string[]> = []

  set (customRoutes: Record<string, string | string[]> = {}) {
    for (let key in customRoutes) {
      const path = customRoutes[key]
      key = addLeadingSlash(key)
      if (typeof path === 'string') {
        this.conf.push([key, addLeadingSlash(path)])
      } else if (path?.length > 0) {
        this.conf.push(...path.map(p => [key, addLeadingSlash(p)]))
      }
    }
  }

  getConfig = (url: string) => {
    const customRoute = this.conf.filter((arr) => {
      return arr.includes(url)
    })
    return customRoute[0]
  }

  getOrigin = (url: string) => {
    return this.getConfig(url)?.[0] || url
  }

  getAlias = (url: string) => {
    return this.getConfig(url)?.[1] || url
  }

  getAll = (url: string) => {
    return this.conf.filter((arr) => {
      return arr.includes(url)
    }).reduce((p, a) => {
      p.push(a[1])
      return p
    }, [url])
  }
}

export const routesAlias = new RoutesAlias()

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
    ([, target]) => {
      if (typeof target === 'string') {
        return target === routePath
      } else if (target?.length > 0) {
        return target.includes(routePath)
      }
      return false
    }
  )?.[0] || routePath

  return !!pagePath && (config.tabBar?.list || []).some(t => t.pagePath === pagePath)
}
