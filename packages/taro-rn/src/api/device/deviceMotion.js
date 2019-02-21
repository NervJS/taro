import { DangerZone } from 'expo'

const devMotionCase = {}
const intervalMap = {
  game: 20,
  ui: 60,
  normal: 200
}

function onDeviceMotionChange (fnc) {
  devMotionCase.callback = fnc
}

function startDeviceMotionListening (object = {}) {
  const { interval = 'normal', success, fail, complete } = object
  devMotionCase.interval = interval
  try {
    devMotionCase.listener = DangerZone.DeviceMotion.addListener((res) => {
      const { rotation } = res
      devMotionCase.callback && devMotionCase.callback(rotation)
    })
    success && success()
    complete && complete()
  } catch (error) {
    fail && fail()
    complete && complete()
  }
  DangerZone.DeviceMotion.setUpdateInterval(intervalMap[interval] || intervalMap.normal)
}

function stopDeviceMotionListening (object = {}) {
  const { success, fail, complete } = object
  try {
    devMotionCase.listener.remove()
    devMotionCase.listener = null
    success && success()
    complete && complete()
  } catch (error) {
    fail && fail()
    complete && complete()
  }
}

export default {
  onDeviceMotionChange,
  startDeviceMotionListening,
  stopDeviceMotionListening
}
