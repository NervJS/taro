import { Current } from './current'
import { getPath } from './dsl/common'
import { TaroRootElement } from './dom/root'
import { document } from './bom/document'
import { ensure } from '@tarojs/shared'

function removeLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path.slice(1) : path
}

export const nextTick = (cb: Function, ctx?: Record<string, any>) => {
  const hasSetDataCallbacks = ['weapp', 'swan', 'qq', 'alipay', 'tt']
  if (~hasSetDataCallbacks.indexOf(process.env.TARO_ENV || '')) {
    let pageElement: TaroRootElement | null = null
    const router = Current.router
    if (router) {
      const path = getPath(removeLeadingSlash(router.path), router.params)
      pageElement = document.getElementById<TaroRootElement>(path)
      ensure(pageElement !== null, '没有找到页面实例。')
      if (pageElement) {
        pageElement.enqueueUpdateCallbak(cb, ctx)
      }
    }
  } else {
    setTimeout(function () {
      ctx ? cb.call(ctx) : cb()
    }, 1)
  }
}
