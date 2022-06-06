import type { AppInstance, Func, PageLifeCycle } from '@tarojs/runtime'
import {
  Current,
  getPageInstance,
  injectPageInstance
} from '@tarojs/runtime'
import { isArray, isFunction } from '@tarojs/shared'

import { reactMeta } from './react-meta'
import { HOOKS_APP_ID } from './utils'

const taroHooks = (lifecycle: keyof PageLifeCycle | keyof AppInstance) => {
  return (fn: Func) => {
    const { R: React, PageContext } = reactMeta
    const id = React.useContext(PageContext) || HOOKS_APP_ID

    // hold fn ref and keep up to date
    const fnRef = React.useRef(fn)
    if (fnRef.current !== fn) fnRef.current = fn

    React.useLayoutEffect(() => {
      let inst = getPageInstance(id)
      let first = false
      if (inst == null) {
        first = true
        inst = Object.create(null)
      }

      inst = inst!

      // callback is immutable but inner function is up to date
      const callback = (...args: any) => fnRef.current(...args)

      if (isFunction(inst[lifecycle])) {
        (inst[lifecycle] as any) = [inst[lifecycle], callback]
      } else {
        (inst[lifecycle] as any) = [
          ...((inst[lifecycle] as any) || []),
          callback
        ]
      }

      if (first) {
        injectPageInstance(inst!, id)
      }
      return () => {
        const inst = getPageInstance(id)
        const list = inst![lifecycle]
        if (list === callback) {
          (inst![lifecycle] as any) = undefined
        } else if (isArray(list)) {
          (inst![lifecycle] as any) = list.filter(item => item !== callback)
        }
      }
    }, [])
  }
}

export const useDidShow = taroHooks('componentDidShow')

export const useDidHide = taroHooks('componentDidHide')

export const usePullDownRefresh = taroHooks('onPullDownRefresh')

export const useReachBottom = taroHooks('onReachBottom')

export const usePageScroll = taroHooks('onPageScroll')

export const useResize = taroHooks('onResize')

export const useShareAppMessage = taroHooks('onShareAppMessage')

export const useTabItemTap = taroHooks('onTabItemTap')

export const useTitleClick = taroHooks('onTitleClick')

export const useOptionMenuClick = taroHooks('onOptionMenuClick')

export const usePullIntercept = taroHooks('onPullIntercept')

export const useShareTimeline = taroHooks('onShareTimeline')

export const useAddToFavorites = taroHooks('onAddToFavorites')

export const useSaveExitState = taroHooks('onSaveExitState')

export const useReady = taroHooks('onReady')

export const useLaunch = taroHooks('onLaunch')

export const useLoad = taroHooks('onLoad')

export const useUnload = taroHooks('onUnload')

export const useError = taroHooks('onError')

export const usePageNotFound = taroHooks('onPageNotFound')

export const useRouter = (dynamic = false) => {
  const React = reactMeta.R
  return dynamic ? Current.router : React.useMemo(() => Current.router, [])
}

export const useScope = () => undefined
