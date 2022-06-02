import {
  Current,
  getPageInstance,
  injectPageInstance
} from '@tarojs/runtime'
import { isArray, isFunction, isUndefined } from '@tarojs/shared'
import {
  inject,
  onMounted,
  ref
} from 'vue'

function createHook (lifecycle) {
  return fn => {
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

export const useDidShow = createHook('onShow')

export const useDidHide = createHook('onHide')

export const useReady = createHook('onReady')

export const useLoad = createHook('onLoad')

export const useUnload = createHook('onUnload')

export const usePullDownRefresh = createHook('onPullDownRefresh')

export const useReachBottom = createHook('onReachBottom')

export const usePageScroll = createHook('onPageScroll')

export const useResize = createHook('onResize')

export const useShareAppMessage = createHook('onShareAppMessage')

export const useTabItemTap = createHook('onTabItemTap')

export const useTitleClick = createHook('onTitleClick')

export const useOptionMenuClick = createHook('onOptionMenuClick')

export const usePullIntercept = createHook('onPullIntercept')

export const useShareTimeline = createHook('onShareTimeline')

export const useAddToFavorites = createHook('onAddToFavorites')

export const useSaveExitState = createHook('onSaveExitState')

export const useRouter = () => {
  // return dynamic ? Current.router : React.useMemo(() => Current.router, [])
  return Current.router
}
