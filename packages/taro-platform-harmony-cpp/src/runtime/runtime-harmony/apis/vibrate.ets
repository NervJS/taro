import vibrator from '@ohos.vibrator'

import type { TaroAny } from '@tarojs/runtime'
import type { IEtsMethodsOptions } from '../../index'

const VIBRATOR_LONG_TIME = 400
const VIBRATOR_SHORT_TIME = 15

function vibrateBaseGenerator (duration: number) {
  return (option: IEtsMethodsOptions) => {
    const errorHandler: TaroAny = option.errorHandler
    const successHandler: TaroAny = option.successHandler
    vibrator.startVibration({
      type: 'time',
      duration,
    }, {
      usage: 'unknown'
    }, (error) => {
      if (error) {
        errorHandler({
          errMsg: `vibrate fail, error.code: ${error.code}; error.message: ${error.message}`
        })
      } else {
        successHandler({})
      }
    })
  }
}

export const vibrateLong = vibrateBaseGenerator(VIBRATOR_LONG_TIME)
export const vibrateShort = vibrateBaseGenerator(VIBRATOR_SHORT_TIME)
