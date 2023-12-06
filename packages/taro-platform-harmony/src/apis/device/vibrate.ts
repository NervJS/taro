import vibrator from '@ohos.vibrator'

import { callAsyncFail, callAsyncSuccess } from '../utils'
import { IAsyncParams } from '../utils/types'

const VIBRATOR_LONG_TIME = 400
const VIBRATOR_SHORT_TIME = 15

function vibrateBaseGenerator (time: number) {
  return (options: IAsyncParams) => {
    return new Promise((resolve, reject) => {
      vibrator.vibrate(time).then(() => {
        const res = { errMsg: 'vibrateShort:ok' }
        callAsyncSuccess(resolve, res, options)
      }, (error) => {
        const res = { errMsg: 'vibrateShort:fail' + error }
        callAsyncFail(reject, res, options)
      })
    })
  }
}

export const vibrateLong = vibrateBaseGenerator(VIBRATOR_LONG_TIME)
export const vibrateShort = vibrateBaseGenerator(VIBRATOR_SHORT_TIME)
