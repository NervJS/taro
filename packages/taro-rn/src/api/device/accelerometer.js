import { Accelerometer } from 'expo'

const accCase = {}
const intervalMap = {
  game: 29,
  ui: 60,
  normal: 200
}

function onAccelerometerChange (fnc) {
  accCase.callback = fnc
}

function startAccelerometer (object) {
  const { interval, success, fail, complete } = object
  accCase.interval = interval
  try {
    accCase.listener = Accelerometer.addListener(accCase.callback)
    success && success()
    complete && complete()
  } catch (error) {
    fail && fail()
    complete && complete()
  }
  Accelerometer.setUpdateInterval(intervalMap[interval])
}

function stopAccelerometer (object) {
  const { success, fail, complete } = object
  try {
    accCase.listener.remove()
    accCase.listener = null
    success && success()
    complete && complete()
  } catch (error) {
    fail && fail()
    complete && complete()
  }
}

export default {
  onAccelerometerChange,
  startAccelerometer,
  stopAccelerometer
}
