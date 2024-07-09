// 从 API Version 6 开始支持
import pasteboard from '@ohos.pasteboard'
// @ts-ignore
import { Current } from '@tarojs/runtime'
import { isString } from '@tarojs/shared'

import {} from '../'
import { callAsyncFail, getParameterError, object2String } from '../utils'
import { MethodHandler } from '../utils/handler'

import type Taro from '@tarojs/taro/types'

/**
 * 设置系统剪贴板的内容
 */
export const setClipboardData: typeof Taro.setClipboardData = function (options) {
  const { data, success, fail, complete } = options
  const handle = new MethodHandler<{ data: string }>({ name: 'setClipboardData', success, fail, complete })
  let res = {}

  if (!isString(data)) {
    return handle.fail({
      errMsg: getParameterError({
        para: 'data',
        correct: 'String',
        wrong: data
      })
    })
  }

  return new Promise((resolve, reject) => {
    const systemPasteboard = pasteboard.getSystemPasteboard()
    const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, data)

    try {
      systemPasteboard.setDataSync(pasteData)
      // @ts-ignore
      const uiContext = Current?.page?.getUIContext?.()

      if (!uiContext) return

      uiContext.getPromptAction().showToast({
        message: '内容已复制',
        duration: 1500,
        bottom: '50%',
        showMode: 1 // 设置弹窗显示模式，显示在应用之上。
      })
      return handle.success({
        data,
      }, { resolve, reject })
    } catch (error) {
      if (error) {
        console.error('Failed to set PasteData. Cause: ' + JSON.stringify(error))
        res = {
          errMsg: 'setClipboardData:fail,error: ' + object2String(error),
          error: error
        }
        callAsyncFail(reject, res, options)
      }
    }
  })
}

/**
 * 获取系统剪贴板的内容
 */
export const getClipboardData: typeof Taro.getClipboardData = function (options) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'getClipboardData', success, fail, complete })
  return new Promise((resolve, reject) => {
    const systemPasteboard = pasteboard.getSystemPasteboard()
    systemPasteboard.getData((error, pasteData) => { // callback 形式调用异步接口
      if (error) {
        console.error('Failed to obtain PasteData. Cause: ' + JSON.stringify(error))
        return handle.fail({
          errMsg: object2String(error),
        }, { resolve, reject })
      } else {
        return handle.success({
          data: pasteData.getPrimaryText(),
        }, { resolve, reject })
      }
    })
  })
}
