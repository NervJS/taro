import { Current } from '@tarojs/runtime'

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

  getConfig = (url = '') => {
    const customRoute = this.conf.filter((arr) => {
      return arr.includes(url)
    })
    return customRoute[0]
  }

  getOrigin = (url = '') => {
    return this.getConfig(url)?.[0] || url
  }

  getAlias = (url = '') => {
    return this.getConfig(url)?.[1] || url
  }

  getAll = (url = '') => {
    return this.conf.filter((arr) => {
      return arr.includes(url)
    }).reduceRight((p, a) => {
      p.unshift(a[1])
      return p
    }, [url])
  }
}

export const routesAlias = new RoutesAlias()

export function getPageContainer (): HTMLElement {
  const id = Current.page?.path
  const el: HTMLDivElement | null = (id
    ? document.getElementById(id)
    : document.querySelector('.taro_page') ||
  document.querySelector('.taro_router')) as HTMLDivElement
  return el || window
}
