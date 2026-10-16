const sensors = [
  { name: 'accelerometer', event: 'devicemotion', start: 'startAccelerometer', stop: 'stopAccelerometer', on: 'onAccelerometerChange', off: 'offAccelerometerChange' },
  { name: 'motion', event: 'deviceorientation', start: 'startDeviceMotionListening', stop: 'stopDeviceMotionListening', on: 'onDeviceMotionChange', off: 'offDeviceMotionChange' },
  { name: 'compass', event: 'deviceorientation', start: 'startCompass', stop: 'stopCompass', on: 'onCompassChange', off: 'offCompassChange' }
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
      acceleration: { x: 1, y: 2, z: 3 }, alpha: 1, beta: 2, gamma: 3, absolute: true
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
