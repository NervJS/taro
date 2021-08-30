import { Vibration } from 'react-native'

function vibrate (DURATION, API, OPTS): Promise<Taro.General.CallbackResult> {
  const res = { errMsg: `${API}:ok` }
  return new Promise((resolve, reject) => {
    const { success, fail, complete } = OPTS
    try {
      Vibration.vibrate(DURATION)
      success?.(res)
      complete?.(res)

      resolve(res)
    } catch (err) {
      res.errMsg = err.message
      fail?.(res)
      complete?.(res)

      reject(res)
    }
  })
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
