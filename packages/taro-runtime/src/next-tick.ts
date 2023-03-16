import { isWebPlatform } from '@tarojs/shared'

import { Current } from './current'
import { TaroRootElement } from './dom/root'
import env from './env'

import type { Func } from './interface'

export const nextTick = (cb: Func, ctx?: Record<string, any>) => {
  const router = Current.router
  const timerFunc = () => {
    setTimeout(function () {
      ctx ? cb.call(ctx) : cb()
    }, 1)
  }

  if (router !== null) {
    let pageElement: TaroRootElement | null = null
    const path = router.$taroPath
    pageElement = env.document.getElementById<TaroRootElement>(path)
    if (pageElement?.pendingUpdate) {
      if (isWebPlatform()) {
        // eslint-disable-next-line dot-notation
        pageElement.firstChild?.['componentOnReady']?.().then(() => {
          timerFunc()
        }) ?? timerFunc()
      } else {
        pageElement.enqueueUpdateCallback(cb, ctx)
      }
    } else {
      timerFunc()
    }
  } else {
    timerFunc()
  }
}
