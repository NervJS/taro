import pasteboard from '@ohos.pasteboard'

import { Current } from '../../index'
import { isString } from '../../utils/is'
import { getParameterError, object2String } from '../utils'

import type { IEtsMethodsOptions } from '../../index'
import type { TaroAny } from '@tarojs/runtime'

export function handleSetClipboardData(option: IEtsMethodsOptions): TaroAny {
  const apiOptions: TaroAny = option?.args?.[0]
  const data: TaroAny = apiOptions.data
  const errorHandler: TaroAny = option.errorHandler
  const successHandler: TaroAny = option.successHandler
  if (!isString(data)) {
    return errorHandler({
      errMsg: getParameterError({
        para: 'data',
        correct: 'String',
        wrong: data
      })
    })
  }

  const systemPasteboard = pasteboard.getSystemPasteboard()
  const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, data)

  try {
    systemPasteboard.setDataSync(pasteData)
    const uiContext: TaroAny = Current?.page?.getUIContext?.()

    if (!uiContext) return

    uiContext.getPromptAction().showToast({
      message: '内容已复制',
      duration: 1500,
      bottom: '50%',
      showMode: 1 // 设置弹窗显示模式，显示在应用之上。
    })
    successHandler({ data })
  } catch (error) {
    if (error) {
      console.error('Failed to set PasteData. Cause: ' + JSON.stringify(error))
      const res: TaroAny = {
        errMsg: 'setClipboardData:fail,error: ' + object2String(error),
        error: error
      }
      errorHandler(res)
    }
  }
}

export function handleGetClipboardData(option: IEtsMethodsOptions): TaroAny {
  const errorHandler: TaroAny = option.errorHandler
  const successHandler: TaroAny = option.successHandler
  const systemPasteboard = pasteboard.getSystemPasteboard()

  systemPasteboard.getData((error, pasteData) => { // callback 形式调用异步接口
    if (error) {
      console.error('Failed to obtain PasteData. Cause: ' + JSON.stringify(error))
      errorHandler({
        errMsg: object2String(error),
      })
    } else {
      successHandler({
        data: pasteData.getPrimaryText(),
      })
    }
  })
}
