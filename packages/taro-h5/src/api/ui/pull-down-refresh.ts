import Taro from '@tarojs/api'
import { Current } from '@tarojs/runtime'

import { MethodHandler } from '../../utils/handler'

type RefreshOptions = Parameters<typeof Taro.startPullDownRefresh>[0]

function requestPullDownRefresh (
  name: 'startPullDownRefresh' | 'stopPullDownRefresh',
  event: string,
  { success, fail, complete }: RefreshOptions = {}
) {
  const handle = new MethodHandler({ name, success, fail, complete })
  const path = Current.page?.path
  const page = path ? document.getElementById(path) : null
  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    let claimed = false
    Taro.eventCenter.trigger(event, {
      claim: (element: HTMLElement | null) => {
        if (claimed || !page || !element?.isConnected || element.closest('.taro_page') !== page) return false
        claimed = true
        return true
      },
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })

    if (!claimed) {
      handle.fail({ errMsg: 'no active pull-down refresh component' }, { resolve, reject })
    }
  })
}

/**
 * 开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
 */
export const startPullDownRefresh: typeof Taro.startPullDownRefresh = options =>
  requestPullDownRefresh('startPullDownRefresh', '__taroStartPullDownRefresh', options)

/**
 * 停止当前页面下拉刷新。
 */
export const stopPullDownRefresh: typeof Taro.stopPullDownRefresh = options =>
  requestPullDownRefresh('stopPullDownRefresh', '__taroStopPullDownRefresh', options)
