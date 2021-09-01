import { Vibration } from 'react-native'
import { errorHandler, successHandler } from '../utils'

function vibrate (DURATION, API, OPTS): Promise<Taro.General.CallbackResult> {
  const res = { errMsg: `${API}:ok` }
    const { success, fail, complete } = OPTS
    try {
      Vibration.vibrate(DURATION)
      return successHandler(success, complete)(res)
    } catch (err) {
      res.errMsg = err.message
      return errorHandler(fail, complete)(res)
    }
}

function vibrateShort (opts: Taro.vibrateShort.Option = {}): Promise<Taro.General.CallbackResult> {
  return vibrate(15, 'vibrateShort', opts)
}

function vibrateLong (opts: Taro.vibrateLong.Option = {}): Promise<Taro.General.CallbackResult> {
  return vibrate(400, 'vibrateLong', opts)
}

export {
  vibrateShort,
  vibrateLong
}
