import {
  AppInstance, Current,
  Func, getPageInstance,
  injectPageInstance,
  Instance,
  PageLifeCycle,
  PageProps
} from '@tarojs/runtime'
import { isArray, isFunction } from '@tarojs/shared'

import { reactMeta } from './react-meta'
import { HOOKS_APP_ID } from './utils'

const createTaroHook = (lifecycle: keyof PageLifeCycle | keyof AppInstance) => {
  return (fn: Func) => {
    const { R: React, PageContext } = reactMeta
    const id = React.useContext(PageContext) || HOOKS_APP_ID
    const instRef = React.useRef<Instance<PageProps>>()

    // hold fn ref and keep up to date
    const fnRef = React.useRef(fn)
    if (fnRef.current !== fn) fnRef.current = fn

    React.useLayoutEffect(() => {
      let inst = instRef.current = getPageInstance(id)
      let first = false
      if (!inst) {
        first = true
        instRef.current = Object.create(null)
        inst = instRef.current!
      }

      // callback is immutable but inner function is up to date
      const callback = (...args: any) => fnRef.current(...args)

      if (isFunction(inst[lifecycle])) {
        (inst[lifecycle]) = [inst[lifecycle], callback]
      } else {
        (inst[lifecycle]) = [
          ...((inst[lifecycle]) || []),
          callback
        ]
      }

      if (first) {
        injectPageInstance(inst!, id)
      }
      return () => {
        const inst = instRef.current
        if (!inst) return
        const list = inst![lifecycle]
        if (list === callback) {
          (inst[lifecycle]) = undefined
        } else if (isArray(list)) {
          (inst[lifecycle]) = list.filter(item => item !== callback)
        }
        instRef.current = undefined
      }
    }, [])
  }
}

/** LifeCycle */
export const useDidHide = createTaroHook('componentDidHide')
export const useDidShow = createTaroHook('componentDidShow')

/** App */
export const useError = createTaroHook('onError')
export const useUnhandledRejection = createTaroHook('onUnhandledRejection')
export const useLaunch = createTaroHook('onLaunch')
export const usePageNotFound = createTaroHook('onPageNotFound')

/** Page */
export const useLoad = createTaroHook('onLoad')
export const usePageScroll = createTaroHook('onPageScroll')
export const usePullDownRefresh = createTaroHook('onPullDownRefresh')
export const usePullIntercept = createTaroHook('onPullIntercept')
export const useReachBottom = createTaroHook('onReachBottom')
export const useResize = createTaroHook('onResize')
export const useUnload = createTaroHook('onUnload')

/** Mini-Program */
export const useAddToFavorites = createTaroHook('onAddToFavorites')
export const useOptionMenuClick = createTaroHook('onOptionMenuClick')
export const useSaveExitState = createTaroHook('onSaveExitState')
export const useShareAppMessage = createTaroHook('onShareAppMessage')
export const useShareTimeline = createTaroHook('onShareTimeline')
export const useTitleClick = createTaroHook('onTitleClick')

/** Router */
export const useReady = createTaroHook('onReady')
export const useRouter = (dynamic = false) => {
  const React = reactMeta.R
  return dynamic ? Current.router : React.useMemo(() => Current.router, [])
}
export const useTabItemTap = createTaroHook('onTabItemTap')

export const useScope = () => undefined
