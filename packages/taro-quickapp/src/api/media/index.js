import audio from '@system.audio'
import device from '@system.device'
import record from '@system.record'

export function createInnerAudioContext () {
  return audio
}

export function getPlayState (opts = {}) {
  const { success, fail, complete } = opts
  const res = { errMsg: 'getPlayState:ok' }
  return new Promise((resolve, reject) => {
    device.getCpuInfo({
      success (data) {
        res.result = data
        success && success(data)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function startRecord (opts = {}) {
  const {
    duration,
    sampleRate,
    numberOfChannels,
    encodeBitRate,
    format,
    success,
    fail,
    complete
  } = opts
  const res = { errMsg: 'startRecord:ok' }
  return new Promise((resolve, reject) => {
    record.start({
      duration,
      sampleRate,
      numberOfChannels,
      encodeBitRate,
      format,
      success (data) {
        res.result = data
        success && success(data)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function stopRecord () {
  return record.stop()
}

export default {
  createInnerAudioContext,
  createAudioContext: createInnerAudioContext,
  getPlayState,
  startRecord,
  stopRecord
}
