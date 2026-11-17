const sensors = [
  { name: 'accelerometer', event: 'devicemotion', start: 'startAccelerometer', stop: 'stopAccelerometer', on: 'onAccelerometerChange', off: 'offAccelerometerChange' },
  { name: 'motion', event: 'deviceorientation', start: 'startDeviceMotionListening', stop: 'stopDeviceMotionListening', on: 'onDeviceMotionChange', off: 'offDeviceMotionChange' },
  { name: 'compass', event: 'deviceorientation', start: 'startCompass', stop: 'stopCompass', on: 'onCompassChange', off: 'offCompassChange' },
  { name: 'gyroscope', event: 'devicemotion', start: 'startGyroscope', stop: 'stopGyroscope', on: 'onGyroscopeChange', off: 'offGyroscopeChange' }
]

jest.mock('../../src/api/base/system', () => ({ getDeviceInfo: () => ({ system: 'AndroidOS' }) }))

describe.each(sensors)('$name listener lifecycle', sensor => {
  let api: Record<string, (...args: any[]) => any>
  let callback: jest.Mock
  const properties = ['DeviceMotionEvent', 'DeviceOrientationEvent', 'ondeviceorientation']
  let descriptors: (PropertyDescriptor | undefined)[]

  beforeEach(() => {
    jest.useFakeTimers()
    descriptors = properties.map(property => Object.getOwnPropertyDescriptor(window, property))
    properties.forEach(property => Object.defineProperty(window, property, { configurable: true, value: property === 'ondeviceorientation' ? null : Event }))
    api = require(`../../src/api/device/${sensor.name}`)
    callback = jest.fn()
    api[sensor.on](callback)
  })

  afterEach(async () => {
    await api[sensor.stop]()
    api[sensor.off]()
    properties.forEach((property, index) => {
      const descriptor = descriptors[index]
      if (descriptor) Object.defineProperty(window, property, descriptor)
      else delete window[property]
    })
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  function dispatch () {
    window.dispatchEvent(Object.assign(new Event(sensor.event), {
      acceleration: { x: 1, y: 2, z: 3 }, rotationRate: { alpha: 1, beta: 2, gamma: 3 }, alpha: 1, beta: 2, gamma: 3, absolute: true
    }))
  }

  test('stop cancels a queued trailing callback', async () => {
    await api[sensor.start]({ interval: 'ui' })
    dispatch()
    dispatch()
    expect(callback).toHaveBeenCalledTimes(1)

    await api[sensor.stop]()
    jest.advanceTimersByTime(6000)
    dispatch()
    expect(callback).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(0)
  })

  test('restart discards queued callbacks from the previous listener', async () => {
    await api[sensor.start]({ interval: 'ui' })
    dispatch()
    dispatch()
    jest.advanceTimersByTime(10)

    await api[sensor.start]({ interval: 'ui' })
    dispatch()
    expect(callback).toHaveBeenCalledTimes(2)
    jest.advanceTimersByTime(6000)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('stop is safe before start and subscribers survive a stop/start cycle', async () => {
    await api[sensor.stop]()
    await api[sensor.stop]()
    await api[sensor.start]({ interval: 'ui' })
    dispatch()
    await api[sensor.stop]()
    await api[sensor.start]({ interval: 'ui' })
    dispatch()
    expect(callback).toHaveBeenCalledTimes(2)
  })
})

describe('gyroscope', () => {
  let api: typeof import('../../src/api/device/gyroscope')
  let descriptor: PropertyDescriptor | undefined

  beforeEach(() => {
    jest.useFakeTimers()
    descriptor = Object.getOwnPropertyDescriptor(window, 'DeviceMotionEvent')
    Object.defineProperty(window, 'DeviceMotionEvent', { configurable: true, value: Event })
    api = require('../../src/api/device/gyroscope')
  })

  afterEach(async () => {
    await api.stopGyroscope()
    api.offGyroscopeChange()
    if (descriptor) Object.defineProperty(window, 'DeviceMotionEvent', descriptor)
    else delete (window as any).DeviceMotionEvent
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  function dispatch (rotationRate: Partial<DeviceMotionEventRotationRate> | null) {
    window.dispatchEvent(Object.assign(new Event('devicemotion'), { rotationRate }))
  }

  test('reports the rotation rate around each axis in rad/s', async () => {
    const callback = jest.fn()
    api.onGyroscopeChange(callback)
    await api.startGyroscope({ interval: 'game' })
    dispatch({ alpha: 180, beta: 90, gamma: -45 })

    expect(callback).toHaveBeenCalledTimes(1)
    const { x, y, z } = callback.mock.calls[0][0]
    expect(x).toBeCloseTo(Math.PI)
    expect(y).toBeCloseTo(Math.PI / 2)
    expect(z).toBeCloseTo(-Math.PI / 4)
  })

  test('ignores events without rotation rate and zero-fills missing fields', async () => {
    const callback = jest.fn()
    api.onGyroscopeChange(callback)
    await api.startGyroscope({ interval: 'game' })
    dispatch(null)
    expect(callback).not.toHaveBeenCalled()

    jest.advanceTimersByTime(20)
    dispatch({ alpha: null, beta: null, gamma: null })
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith({ x: 0, y: 0, z: 0 })
  })

  test('keeps a pending reading when an empty one follows within the throttle window', async () => {
    const callback = jest.fn()
    api.onGyroscopeChange(callback)
    await api.startGyroscope()
    dispatch({ alpha: 1, beta: 1, gamma: 1 })
    dispatch({ alpha: 2, beta: 0, gamma: 0 })
    dispatch(null)
    expect(callback).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(200)
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback.mock.calls[1][0].x).toBeCloseTo(2 * Math.PI / 180)
  })

  test('fails on an unsupported interval without requesting permission', async () => {
    const requestPermission = jest.fn()
    Object.defineProperty(window, 'DeviceMotionEvent', {
      configurable: true,
      value: Object.assign(function () {}, { requestPermission })
    })
    await expect(api.startGyroscope({ interval: 'fast' as any })).rejects.toEqual({ errMsg: 'startGyroscope:fail invalid interval' })
    expect(requestPermission).not.toHaveBeenCalled()
  })

  test('throttles callbacks according to the interval option', async () => {
    const callback = jest.fn()
    api.onGyroscopeChange(callback)
    await api.startGyroscope()
    dispatch({ alpha: 1, beta: 1, gamma: 1 })
    jest.advanceTimersByTime(100)
    dispatch({ alpha: 2, beta: 2, gamma: 2 })
    expect(callback).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('offGyroscopeChange removes the given callback or all callbacks', async () => {
    const first = jest.fn()
    const second = jest.fn()
    api.onGyroscopeChange(first)
    api.onGyroscopeChange(second)
    await api.startGyroscope({ interval: 'game' })

    api.offGyroscopeChange(first)
    dispatch({ alpha: 1, beta: 1, gamma: 1 })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)

    api.offGyroscopeChange()
    jest.advanceTimersByTime(20)
    dispatch({ alpha: 1, beta: 1, gamma: 1 })
    expect(second).toHaveBeenCalledTimes(1)
  })

  test('fails when devicemotion is not supported', async () => {
    delete (window as any).DeviceMotionEvent
    const fail = jest.fn()

    await expect(api.startGyroscope({ fail })).resolves.toEqual({ errMsg: 'startGyroscope:fail gyroscope is not supported' })
    expect(fail).toHaveBeenCalledWith({ errMsg: 'startGyroscope:fail gyroscope is not supported' })
  })

  describe('motion permission', () => {
    function mockPermission () {
      const resolvers: ((state: string) => void)[] = []
      const rejecters: ((e: Error) => void)[] = []
      const requestPermission = jest.fn(() => new Promise<string>((resolve, reject) => {
        resolvers.push(resolve)
        rejecters.push(reject)
      }))
      delete (window as any).DeviceMotionEvent
      Object.defineProperty(window, 'DeviceMotionEvent', {
        configurable: true,
        value: Object.assign(function () {}, { requestPermission })
      })
      return { requestPermission, resolvers, rejecters }
    }

    test('starts listening only after the permission is granted', async () => {
      const { requestPermission, resolvers } = mockPermission()
      const callback = jest.fn()
      api.onGyroscopeChange(callback)

      const result = api.startGyroscope({ interval: 'game' })
      expect(requestPermission).toHaveBeenCalledTimes(1)
      dispatch({ alpha: 1, beta: 1, gamma: 1 })
      expect(callback).not.toHaveBeenCalled()

      resolvers[0]('granted')
      await expect(result).resolves.toEqual({ errMsg: 'startGyroscope:ok' })
      dispatch({ alpha: 1, beta: 1, gamma: 1 })
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('fails when the permission is denied or the request throws', async () => {
      const { resolvers, rejecters } = mockPermission()
      const callback = jest.fn()
      api.onGyroscopeChange(callback)

      const denied = api.startGyroscope()
      resolvers[0]('denied')
      await expect(denied).rejects.toEqual({ errMsg: 'startGyroscope:fail permission denied' })

      const errored = api.startGyroscope()
      rejecters[1](new Error('not allowed'))
      await expect(errored).rejects.toEqual({ errMsg: 'startGyroscope:fail not allowed' })

      dispatch({ alpha: 1, beta: 1, gamma: 1 })
      expect(callback).not.toHaveBeenCalled()
    })

    test('does not attach a listener when stop or another start happens while waiting', async () => {
      const { resolvers } = mockPermission()
      const callback = jest.fn()
      api.onGyroscopeChange(callback)

      const stopped = api.startGyroscope()
      await api.stopGyroscope()
      resolvers[0]('granted')
      await expect(stopped).rejects.toMatchObject({ errMsg: expect.stringContaining('startGyroscope:fail') })
      dispatch({ alpha: 1, beta: 1, gamma: 1 })
      expect(callback).not.toHaveBeenCalled()

      const first = api.startGyroscope()
      const second = api.startGyroscope()
      resolvers[2]('granted')
      resolvers[1]('granted')
      await expect(first).rejects.toMatchObject({ errMsg: expect.stringContaining('startGyroscope:fail') })
      await expect(second).resolves.toEqual({ errMsg: 'startGyroscope:ok' })
      dispatch({ alpha: 1, beta: 1, gamma: 1 })
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})
