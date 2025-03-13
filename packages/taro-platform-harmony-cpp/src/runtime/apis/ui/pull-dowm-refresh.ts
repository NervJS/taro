import { eventCenter } from '@tarojs/runtime'

import { MethodHandler } from '../utils'

import type Taro from '@tarojs/taro/types'

enum RefreshStatus {
  Inactive,
  Drag,
  OverDrag,
  Refresh,
  Done
}

export const startPullDownRefresh: typeof Taro.startPullDownRefresh = function (options) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'startPullDownRefresh', success, fail, complete })

  return new Promise((resolve, reject) => {
    eventCenter.trigger('__taroPullDownRefresh', RefreshStatus.Refresh)

    handle.success({
      errMsg: 'startPullDownRefresh:ok'
    }, { resolve, reject })
  })
}

export const stopPullDownRefresh: typeof Taro.stopPullDownRefresh = function (options) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'stopPullDownRefresh', success, fail, complete })

  return new Promise((resolve, reject) => {
    eventCenter.trigger('__taroPullDownRefresh', RefreshStatus.Done)

    handle.success({
      errMsg: 'stopPullDownRefresh:ok'
    }, { resolve, reject })
  })
}
