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
    expect(x).toBeCloseTo(Math.PI / 2)
    expect(y).toBeCloseTo(-Math.PI / 4)
    expect(z).toBeCloseTo(Math.PI)
  })

  test('reports zero when the rotation rate is unavailable', async () => {
    const callback = jest.fn()
    api.onGyroscopeChange(callback)
    await api.startGyroscope({ interval: 'game' })
    dispatch(null)
    jest.advanceTimersByTime(20)
    dispatch({ alpha: null, beta: null, gamma: null })

    expect(callback).toHaveBeenNthCalledWith(1, { x: 0, y: 0, z: 0 })
    expect(callback).toHaveBeenNthCalledWith(2, { x: 0, y: 0, z: 0 })
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
})
