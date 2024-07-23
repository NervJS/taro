import vibrator from '@ohos.vibrator'

import { MethodHandler } from '../utils/handler'

import type Taro from '@tarojs/taro/types'

const VIBRATOR_LONG_TIME = 400
const VIBRATOR_SHORT_TIME = 15

function vibrateBaseGenerator (duration: number, name = '') {
  return ({ success, fail, complete }: Taro.vibrateLong.Option = {}) => {
    const handle = new MethodHandler({ name, success, fail, complete })
    return new Promise((resolve, reject) => {
      vibrator.startVibration({
        type: 'time',
        duration,
      }, {
        usage: 'unknown'
      }, (error) => {
        if (error) {
          return handle.fail({
            errMsg: `vibrate fail, error.code: ${error.code}; error.message: ${error.message}`
          }, { resolve, reject })
        }
        return handle.success({}, { resolve, reject })
      })
    })
  }
}

export const vibrateLong = vibrateBaseGenerator(VIBRATOR_LONG_TIME, 'vibrateLong')
export const vibrateShort = vibrateBaseGenerator(VIBRATOR_SHORT_TIME, 'vibrateShort')
