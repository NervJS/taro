import { Vibration } from 'react-native'

function vibrate (DURATION, API) {
  const res = { errMsg: `${API}:ok` }
  return new Promise((resolve, reject) => {
    try {
      Vibration.vibrate(DURATION)
      resolve(res)
    } catch (err) {
      console.log(err)
      res.errMsg = err.message
      reject(res)
    }
  })
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
