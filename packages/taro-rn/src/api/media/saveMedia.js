import { CameraRoll } from 'react-native'
import { Permissions } from 'react-native-unimodules'
import { askAsyncPermissions } from '../utils'

/**
 * 需要手动 Link RTCCameraRoll
 * @param opts
 * @param type
 * @param API
 * @returns {Promise<*>}
 */
async function saveMedia (opts, type, API) {
  const {status} = await askAsyncPermissions(Permissions.CAMERA_ROLL)
  if (status !== 'granted') {
    const res = {errMsg: `Permissions denied!`}
    return Promise.reject(res)
  }
  const {filePath, success, fail, complete} = opts
  const res = {errMsg: `${API}:ok`}

  return CameraRoll.saveToCameraRoll(filePath, type)
    .then((url) => {
      res.path = url
      success && success(res)
      complete && complete(res)
      return Promise.resolve(res)
    }).catch((err) => {
      res.errMsg = err.message
      fail && fail(res)
      complete && complete(res)
      return Promise.reject(res)
    })
}

export { saveMedia }

export default {saveMedia}
