class MockWakeLockSentinel extends EventTarget {
  readonly type = 'screen'
  released = false

  release = jest.fn(async () => {
    if (this.released) return
    this.released = true
    this.dispatchEvent(new Event('release'))
  })
}

function flushPromises () {
  return new Promise(resolve => setTimeout(resolve, 0))
}

describe('setKeepScreenOn', () => {
  let setKeepScreenOn: typeof import('../../src/api/device/screen').setKeepScreenOn
  let request: jest.Mock
  let sentinels: MockWakeLockSentinel[]
  let visibilityState: DocumentVisibilityState

  function setVisibility (state: DocumentVisibilityState) {
    visibilityState = state
    document.dispatchEvent(new Event('visibilitychange'))
  }

  beforeEach(() => {
    jest.resetModules()
    sentinels = []
    visibilityState = 'visible'
    request = jest.fn(async () => {
      const sentinel = new MockWakeLockSentinel()
      sentinels.push(sentinel)
      return sentinel
    })
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request } })
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => visibilityState })
    setKeepScreenOn = require('../../src/api/device/screen').setKeepScreenOn
  })

  afterEach(async () => {
    if ('wakeLock' in navigator) {
      await setKeepScreenOn({ keepScreenOn: false })
    }
    delete (navigator as any).wakeLock
    delete (document as any).visibilityState
  })

  test('requests a screen wake lock to keep the screen on', async () => {
    const success = jest.fn()
    const complete = jest.fn()

    await expect(setKeepScreenOn({ keepScreenOn: true, success, complete })).resolves.toEqual({ errMsg: 'setKeepScreenOn:ok' })
    expect(request).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith('screen')
    expect(success).toHaveBeenCalledWith({ errMsg: 'setKeepScreenOn:ok' })
    expect(complete).toHaveBeenCalledWith({ errMsg: 'setKeepScreenOn:ok' })
  })

  test('releases the wake lock when keepScreenOn is false', async () => {
    await setKeepScreenOn({ keepScreenOn: true })
    await expect(setKeepScreenOn({ keepScreenOn: false })).resolves.toEqual({ errMsg: 'setKeepScreenOn:ok' })

    expect(sentinels[0].release).toHaveBeenCalledTimes(1)
    expect(sentinels[0].released).toBe(true)
  })

  test('keeps a single wake lock across repeated calls', async () => {
    await setKeepScreenOn({ keepScreenOn: true })
    await setKeepScreenOn({ keepScreenOn: true })
    expect(request).toHaveBeenCalledTimes(1)

    await Promise.all([
      setKeepScreenOn({ keepScreenOn: false }),
      setKeepScreenOn({ keepScreenOn: true }),
      setKeepScreenOn({ keepScreenOn: true })
    ])
    expect(sentinels.filter(sentinel => !sentinel.released)).toHaveLength(1)
  })

  test('reacquires the wake lock when the page becomes visible again', async () => {
    await setKeepScreenOn({ keepScreenOn: true })

    // Note: 浏览器在页面隐藏时会自动释放 wake lock
    setVisibility('hidden')
    await sentinels[0].release()
    expect(request).toHaveBeenCalledTimes(1)

    setVisibility('visible')
    await flushPromises()
    expect(request).toHaveBeenCalledTimes(2)
    expect(sentinels[1].released).toBe(false)

    await setKeepScreenOn({ keepScreenOn: false })
    expect(sentinels[1].released).toBe(true)
  })

  test('does not reacquire the wake lock after keepScreenOn is turned off', async () => {
    await setKeepScreenOn({ keepScreenOn: true })
    await setKeepScreenOn({ keepScreenOn: false })

    setVisibility('hidden')
    setVisibility('visible')
    await flushPromises()
    expect(request).toHaveBeenCalledTimes(1)
  })

  test('releases a wake lock granted after keepScreenOn was turned off', async () => {
    let grant: () => void = () => {}
    request.mockImplementationOnce(() => new Promise(resolve => {
      grant = () => {
        const sentinel = new MockWakeLockSentinel()
        sentinels.push(sentinel)
        resolve(sentinel)
      }
    }))

    const enabling = setKeepScreenOn({ keepScreenOn: true })
    await setKeepScreenOn({ keepScreenOn: false })
    grant()
    await enabling

    expect(sentinels[0].released).toBe(true)
  })

  test('reuses the in-flight request when the page becomes visible again', async () => {
    let grant: (sentinel: MockWakeLockSentinel) => void = () => {}
    request.mockImplementationOnce(() => new Promise(resolve => {
      grant = resolve as typeof grant
    }))

    const enabling = setKeepScreenOn({ keepScreenOn: true })
    setVisibility('hidden')
    setVisibility('visible')
    await flushPromises()
    expect(request).toHaveBeenCalledTimes(1)

    const sentinel = new MockWakeLockSentinel()
    sentinels.push(sentinel)
    grant(sentinel)
    await enabling
    expect(sentinel.released).toBe(false)
  })

  test('fails and stays off when the wake lock request is rejected', async () => {
    request.mockRejectedValueOnce(new Error('Wake Lock permission request denied'))
    const fail = jest.fn()

    await expect(setKeepScreenOn({ keepScreenOn: true, fail })).resolves.toEqual({
      errMsg: 'setKeepScreenOn:fail Wake Lock permission request denied'
    })
    expect(fail).toHaveBeenCalledWith({ errMsg: 'setKeepScreenOn:fail Wake Lock permission request denied' })

    setVisibility('hidden')
    setVisibility('visible')
    await flushPromises()
    expect(request).toHaveBeenCalledTimes(1)
  })

  test('fails when the Screen Wake Lock API is not supported', async () => {
    delete (navigator as any).wakeLock

    await expect(setKeepScreenOn({ keepScreenOn: true })).rejects.toEqual({
      errMsg: 'setKeepScreenOn:fail wakeLock is not supported'
    })
  })

  test('validates the keepScreenOn parameter', async () => {
    await expect(setKeepScreenOn({ keepScreenOn: 'true' as unknown as boolean })).rejects.toEqual({
      errMsg: 'setKeepScreenOn:fail parameter error: parameter.keepScreenOn should be Boolean instead of String'
    })
    await expect(setKeepScreenOn(undefined as unknown as Parameters<typeof setKeepScreenOn>[0])).rejects.toEqual({
      errMsg: 'setKeepScreenOn:fail parameter error: parameter should be Object instead of Undefined'
    })
    expect(request).not.toHaveBeenCalled()
  })

  test('shares one request between concurrent calls and keeps the lock', async () => {
    await Promise.all([
      setKeepScreenOn({ keepScreenOn: true }),
      setKeepScreenOn({ keepScreenOn: true })
    ])
    expect(request).toHaveBeenCalledTimes(1)
    expect(sentinels[0].released).toBe(false)
  })

  test('fails every caller sharing a rejected request', async () => {
    let rejectRequest: (reason: Error) => void = () => {}
    request.mockImplementationOnce(() => new Promise((_resolve, reject) => {
      rejectRequest = reject
    }))
    const fail = jest.fn()

    const first = setKeepScreenOn({ keepScreenOn: true, fail })
    const second = setKeepScreenOn({ keepScreenOn: true, fail })
    await flushPromises()
    expect(request).toHaveBeenCalledTimes(1)

    rejectRequest(new Error('Wake Lock permission request denied'))
    await Promise.all([first, second])
    expect(fail).toHaveBeenCalledTimes(2)
  })
})
