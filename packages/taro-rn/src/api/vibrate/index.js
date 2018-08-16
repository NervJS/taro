import { Vibration } from 'react-native'

function vibrate (DURATION, API) {
  const res = { errMsg: `${API}:ok` }
  try {
    Vibration.vibrate(DURATION)
    return Promise.resolve(res)
  } catch (err) {
    console.log(err)
    res.errMsg = err.message
    return Promise.reject(res)
  }
}

export function vibrateShort () {
  return vibrate(15, 'vibrateShort')
}

export function vibrateLong () {
  return vibrate(400, 'vibrateLong')
}

export default {
  vibrateLong,
  vibrateShort
}
