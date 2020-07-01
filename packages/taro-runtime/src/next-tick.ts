import { Current } from './current'
import { getPath } from './dsl/common'
import { TaroRootElement } from './dom/root'
import { document } from './bom/document'
import { isBrowser } from './env'

function removeLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path.slice(1) : path
}

export const nextTick = (cb: Function, ctx?: Record<string, any>) => {
  const router = Current.router
  const timerFunc = () => {
    setTimeout(function () {
      ctx ? cb.call(ctx) : cb()
    }, 1)
  }

  if (router !== null) {
    let pageElement: TaroRootElement | null = null
    const path = getPath(removeLeadingSlash(router.path), router.params)
    pageElement = document.getElementById<TaroRootElement>(path)
    if (pageElement !== null) {
      if (isBrowser) {
        pageElement.firstChild?.['componentOnReady']?.().then(() => {
          timerFunc()
        }) ?? timerFunc()
      } else {
        pageElement.enqueueUpdateCallbak(cb, ctx)
      }
    } else {
      timerFunc()
    }
  } else {
    timerFunc()
  }
}
