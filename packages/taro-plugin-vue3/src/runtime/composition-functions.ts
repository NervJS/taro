import {
  AppInstance, Current,
  Func, getPageInstance,
  injectPageInstance,
  PageLifeCycle
} from '@tarojs/runtime'
import { isArray, isFunction, isUndefined } from '@tarojs/shared'
import {
  inject,
  onMounted,
  ref
} from 'vue'

function createTaroHook (lifecycle: keyof PageLifeCycle | keyof AppInstance) {
  return (fn: Func) => {
    const id = inject<string>('id')!
    const fnRef = ref(fn)

    onMounted(() => {
      let inst: any = getPageInstance(id)
      if (inst === undefined) {
        inst = Object.create({
          $options: {}
        })
        injectPageInstance(inst!, id)
      }
      inst = inst.$options

      const callback = (...args: any) => fnRef.value(...args)
      const currentCallback = inst[lifecycle]

      if (isUndefined(currentCallback)) {
        inst[lifecycle] = callback
      } else if (isFunction(currentCallback)) {
        inst[lifecycle] = [inst[lifecycle], callback]
      } else if (isArray(currentCallback)) {
        inst[lifecycle] = [...currentCallback, callback]
      }
    })
  }
}

/** LifeCycle */
export const useDidShow = createTaroHook('onShow')
export const useDidHide = createTaroHook('onHide')

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
export const useRouter = () => {
  // return dynamic ? Current.router : React.useMemo(() => Current.router, [])
  return Current.router
}
export const useTabItemTap = createTaroHook('onTabItemTap')
