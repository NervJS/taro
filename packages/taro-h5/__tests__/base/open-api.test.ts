import * as Taro from '@tarojs/taro-h5'

interface Invocation {
  hasFail: boolean
  hasSuccess: boolean
  hasComplete: boolean
  options: Record<string, any>
}

/**
 * 微信 JSSDK 的桩实现。
 * 必须在「被调用的瞬间」快照回调的注册情况：processOpenApi 复用同一个 opts 对象，
 * 调用结束后再读取就无法区分「注册完再调用」和「边注册边调用」。
 */
function createSdkStub (behavior: 'success' | 'fail' | 'silent', result: Record<string, any> = {}) {
  const invocations: Invocation[] = []
  const fn = jest.fn((options: Record<string, any>) => {
    invocations.push({
      hasFail: typeof options.fail === 'function',
      hasSuccess: typeof options.success === 'function',
      hasComplete: typeof options.complete === 'function',
      options: { ...options }
    })
    if (behavior === 'success') {
      options.success?.(result)
      options.complete?.(result)
    } else if (behavior === 'fail') {
      options.fail?.(result)
      options.complete?.(result)
    }
  })
  return { fn, invocations }
}

describe('processOpenApi', () => {
  afterEach(() => {
    // @ts-ignore
    delete window.wx
    jest.clearAllMocks()
  })

  describe('微信 JSSDK 可用时', () => {
    test('scanCode 只调用 wx.scanQRCode 一次，并回传格式化结果', async () => {
      const scanQRCode = createSdkStub('success', { errMsg: 'scanQRCode:ok', resultStr: 'CODE-123' })
      // @ts-ignore
      window.wx = { scanQRCode: scanQRCode.fn }

      const success = jest.fn()
      const complete = jest.fn()
      const res = await Taro.scanCode({ success, complete })

      expect(scanQRCode.fn).toHaveBeenCalledTimes(1)
      expect(success).toHaveBeenCalledTimes(1)
      expect(complete).toHaveBeenCalledTimes(1)
      expect(res).toMatchObject({ errMsg: 'scanCode:ok', result: 'CODE-123' })
    })

    test('首次调用 SDK 时 fail/success/complete 三个回调都已注册', async () => {
      const scanQRCode = createSdkStub('success', { errMsg: 'scanQRCode:ok', resultStr: 'CODE-123' })
      // @ts-ignore
      window.wx = { scanQRCode: scanQRCode.fn }

      await Taro.scanCode()

      expect(scanQRCode.invocations).toHaveLength(1)
      expect(scanQRCode.invocations[0]).toMatchObject({
        hasFail: true,
        hasSuccess: true,
        hasComplete: true
      })
    })

    test('openLocation 只调用一次，且合并了 defaultOptions', async () => {
      const openLocation = createSdkStub('success', { errMsg: 'openLocation:ok' })
      // @ts-ignore
      window.wx = { openLocation: openLocation.fn }

      await Taro.openLocation({ latitude: 1, longitude: 2 })

      expect(openLocation.fn).toHaveBeenCalledTimes(1)
      expect(openLocation.invocations[0].options).toMatchObject({
        scale: 18,
        latitude: 1,
        longitude: 2
      })
    })

    test('getLocation 只调用一次（存在 standardMethod 时仍优先走 SDK）', async () => {
      const getLocation = createSdkStub('success', { errMsg: 'getLocation:ok', latitude: 4, longitude: 5 })
      // @ts-ignore
      window.wx = { getLocation: getLocation.fn }

      const success = jest.fn()
      const complete = jest.fn()
      await Taro.getLocation({ type: 'WGS84', success, complete })

      expect(getLocation.fn).toHaveBeenCalledTimes(1)
      expect(success).toHaveBeenCalledTimes(1)
      expect(complete).toHaveBeenCalledTimes(1)
    })

    test('startLocationUpdate / stopLocationUpdate 各只调用一次', async () => {
      const startLocationUpdate = createSdkStub('success', { errMsg: 'startLocationUpdate:ok' })
      const stopLocationUpdate = createSdkStub('success', { errMsg: 'stopLocationUpdate:ok' })
      // @ts-ignore
      window.wx = {
        startLocationUpdate: startLocationUpdate.fn,
        stopLocationUpdate: stopLocationUpdate.fn
      }

      await Taro.startLocationUpdate()
      await Taro.stopLocationUpdate()

      expect(startLocationUpdate.fn).toHaveBeenCalledTimes(1)
      expect(stopLocationUpdate.fn).toHaveBeenCalledTimes(1)
    })

    test('失败路径下 SDK 与 fail/complete 回调各只触发一次', async () => {
      const scanQRCode = createSdkStub('fail', { errMsg: 'scanQRCode:fail cancel' })
      // @ts-ignore
      window.wx = { scanQRCode: scanQRCode.fn }

      const fail = jest.fn()
      const complete = jest.fn()

      await expect(Taro.scanCode({ fail, complete })).rejects.toMatchObject({
        errMsg: 'scanQRCode:fail cancel'
      })

      expect(scanQRCode.fn).toHaveBeenCalledTimes(1)
      expect(fail).toHaveBeenCalledTimes(1)
      expect(complete).toHaveBeenCalledTimes(1)
    })

    test('SDK 不触发任何回调时也只调用一次', () => {
      const scanQRCode = createSdkStub('silent')
      // @ts-ignore
      window.wx = { scanQRCode: scanQRCode.fn }

      Taro.scanCode().catch(() => { /* 永不 settle，忽略 */ })

      expect(scanQRCode.fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('微信 JSSDK 不可用时', () => {
    test('getLocation 降级到 standardMethod，底层 API 只调用一次', async () => {
      const getCurrentPosition = jest.fn((onSuccess: PositionCallback) => {
        onSuccess({
          coords: {
            accuracy: 1,
            altitude: 2,
            altitudeAccuracy: 3,
            heading: null,
            latitude: 4,
            longitude: 5,
            speed: 6
          },
          timestamp: Date.now()
        } as GeolocationPosition)
      })
      // @ts-ignore
      navigator.geolocation = { getCurrentPosition }

      const success = jest.fn()
      const res = await Taro.getLocation({ type: 'WGS84', success })

      expect(getCurrentPosition).toHaveBeenCalledTimes(1)
      expect(success).toHaveBeenCalledTimes(1)
      expect(res).toMatchObject({ latitude: 4, longitude: 5 })
    })
  })
})
