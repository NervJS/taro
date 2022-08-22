import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import { successHandler, errorHandler } from '../../utils'

/**
 * keepScreenOn
 * @param {{}} opts
 * @param {boolean} opts.keepScreenOn - 是否保持屏幕常亮
 */
export async function setKeepScreenOn(opts: Taro.setKeepScreenOn.Option): Promise<Taro.setKeepScreenOn.Promised> {
  const res = { errMsg: 'setKeepScreenOn:ok' } as any
  const { keepScreenOn, success, fail, complete } = opts
  try {
    if (keepScreenOn) {
      activateKeepAwake()
    } else {
      deactivateKeepAwake()
    }
    return successHandler(success, complete)(res)
  } catch (e) {
    res.errMsg = `setKeepScreenOn:fail invalid ${e}`
    return errorHandler(fail, complete)(res)
  }
}
