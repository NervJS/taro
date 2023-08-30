import window from '@ohos.window'
import { Current } from '@tarojs/runtime'

import { callAsyncFail, callAsyncSuccess } from '../utils'
import { IAsyncParams } from '../utils/types'

interface ISetBackgroundColor extends IAsyncParams {
  backgroundColor?: string
  backgroundColorTop?: string
  backgroundColorBottom?: string
}

const windowClassPromise = (Current as any).contextPromise
  .then(context => {
    return window.getTopWindow(context)
  })

export function setBackgroundColor(options: ISetBackgroundColor) {
  return new Promise((resolve, reject) => {
    const color = options.backgroundColor || options.backgroundColorTop || options.backgroundColorBottom

    windowClassPromise.then(windowClass => {
      windowClass.setBackgroundColor(color).then(() => {
        const res = { errMsg: 'setBackgroundColor:ok' }
        callAsyncSuccess(resolve, res, options)
      }, (error) => {
        const res = { errMsg: 'setBackgroundColor:fail' + error }
        callAsyncFail(reject, res, options)
      })
    })
  })
}