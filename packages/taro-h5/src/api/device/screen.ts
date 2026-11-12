import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject, temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

// 屏幕
export const setVisualEffectOnCapture = /* @__PURE__ */ temporarilyNotSupport('setVisualEffectOnCapture')
export const setScreenBrightness = /* @__PURE__ */ temporarilyNotSupport('setScreenBrightness')

let keepScreenOnEnabled = false
let keepScreenOnCallId = 0
let wakeLock: WakeLockSentinel | null = null
let pendingRequest: Promise<void> | null = null

function requestWakeLock () {
  // Note: 复用尚未完成的申请，避免并发调用各自申请后，一方失败时误释放另一方已获取的 wake lock
  if (!pendingRequest) {
    const request = acquireWakeLock().finally(() => {
      if (pendingRequest === request) {
        pendingRequest = null
      }
    })
    pendingRequest = request
  }
  return pendingRequest
}

async function acquireWakeLock () {
  const sentinel = await navigator.wakeLock.request('screen')
  // Note: 申请期间可能已经取消了常亮，或者已经由其他调用持有了 wake lock
  if (!keepScreenOnEnabled || wakeLock) {
    await sentinel.release()
    return
  }
  wakeLock = sentinel
  sentinel.addEventListener('release', () => {
    if (wakeLock === sentinel) {
      wakeLock = null
    }
  })
}

/**
 * Note: 页面不可见时浏览器会自动释放 wake lock，需要在页面重新可见时重新申请
 * @see https://w3c.github.io/screen-wake-lock/#handling-document-loss-of-visibility
 */
function handleVisibilityChange () {
  if (keepScreenOnEnabled && !wakeLock && document.visibilityState === 'visible') {
    // Note: 视为一次新的请求，避免更早发起的请求失败后关闭这次已获取的 wake lock
    keepScreenOnCallId++
    requestWakeLock().catch(e => {
      console.warn(`setKeepScreenOn: failed to reacquire the screen wake lock, ${e.message}`)
    })
  }
}

function disableKeepScreenOn () {
  keepScreenOnEnabled = false
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  const sentinel = wakeLock
  wakeLock = null
  return sentinel?.release()
}

/**
 * 设置是否保持常亮状态。基于 Screen Wake Lock API 实现，需要在安全上下文（如 HTTPS 或 localhost）中使用。
 */
export const setKeepScreenOn: typeof Taro.setKeepScreenOn = async (options) => {
  const name = 'setKeepScreenOn'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { keepScreenOn, success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })

  if (typeof keepScreenOn !== 'boolean') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'keepScreenOn',
        correct: 'Boolean',
        wrong: keepScreenOn
      })
    })
  }

  if (!('wakeLock' in navigator)) {
    return handle.fail({ errMsg: 'wakeLock is not supported' })
  }

  const callId = ++keepScreenOnCallId
  try {
    if (keepScreenOn) {
      keepScreenOnEnabled = true
      document.addEventListener('visibilitychange', handleVisibilityChange)
      if (!wakeLock) {
        await requestWakeLock()
      }
    } else {
      await disableKeepScreenOn()
    }
    return handle.success()
  } catch (e) {
    // Note: 申请失败时不保留常亮状态，除非期间已有新的调用修改了该状态
    if (keepScreenOn && callId === keepScreenOnCallId) {
      disableKeepScreenOn()
    }
    return handle.fail({ errMsg: e.message })
  }
}

export const onUserCaptureScreen = /* @__PURE__ */ temporarilyNotSupport('onUserCaptureScreen')
export const offUserCaptureScreen = /* @__PURE__ */ temporarilyNotSupport('offUserCaptureScreen')
export const getScreenBrightness = /* @__PURE__ */ temporarilyNotSupport('getScreenBrightness')
export const onScreenRecordingStateChanged = /* @__PURE__ */ temporarilyNotSupport('onScreenRecordingStateChanged')
export const offScreenRecordingStateChanged = /* @__PURE__ */ temporarilyNotSupport('offScreenRecordingStateChanged')
export const getScreenRecordingState = /* @__PURE__ */ temporarilyNotSupport('getScreenRecordingState')
