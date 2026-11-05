import { chooseLocation } from '../../src/api/location/chooseLocation'

describe('chooseLocation coordinates', () => {
  let apiKey: PropertyDescriptor | undefined

  beforeEach(() => {
    jest.useFakeTimers()
    apiKey = Object.getOwnPropertyDescriptor(globalThis, 'LOCATION_APIKEY')
    Object.defineProperty(globalThis, 'LOCATION_APIKEY', { configurable: true, value: 'test-key' })
  })

  afterEach(() => {
    document.querySelector<HTMLElement>('.taro_choose_location_back')?.click()
    jest.runOnlyPendingTimers()
    document.body.innerHTML = ''
    if (apiKey) Object.defineProperty(globalThis, 'LOCATION_APIKEY', apiKey)
    else delete globalThis.LOCATION_APIKEY
    jest.useRealTimers()
  })

  function openChooser (mapOpts = {}) {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const result = chooseLocation({ mapOpts, success, fail, complete }).catch(error => error)
    return { result, success, fail, complete }
  }

  function confirm (latitude?: number, longitude?: number) {
    window.dispatchEvent(new MessageEvent('message', {
      data: {
        module: 'locationPicker', poiname: 'place', poiaddress: 'address', latlng: { lat: latitude, lng: longitude }
      }
    }))
    document.querySelector<HTMLElement>('.taro_choose_location_submit')!.click()
  }

  test.each([[-33.86, 151.21], [37.77, -122.42], [-33.45, -70.66], [0, 0], [90, 180], [-90, -180]])('passes initial coordinates %s,%s to the map iframe', (latitude, longitude) => {
    openChooser({ latitude, longitude })
    const iframe = document.querySelector<HTMLIFrameElement>('.taro_choose_location_frame')!
    expect(new URL(iframe.src).searchParams.get('coord')).toBe(`${latitude},${longitude}`)
  })

  test.each([
    {}, { latitude: 1 }, { longitude: 1 }, { latitude: NaN, longitude: 1 },
    { latitude: 91, longitude: 1 }, { latitude: 1, longitude: 181 }
  ])('omits invalid or incomplete initial coordinates: %j', mapOpts => {
    openChooser(mapOpts)
    const iframe = document.querySelector<HTMLIFrameElement>('.taro_choose_location_frame')!
    expect(new URL(iframe.src).searchParams.has('coord')).toBe(false)
  })

  test('preserves an explicit coord override', () => {
    openChooser({ latitude: 1, longitude: 2, coord: '-33.86,151.21' })
    const iframe = document.querySelector<HTMLIFrameElement>('.taro_choose_location_frame')!
    expect(new URL(iframe.src).searchParams.get('coord')).toBe('-33.86,151.21')
  })

  test.each([[0, 120], [45, 0], [0, 0], [-33.45, -70.66], [90, 180], [-90, -180]])('confirms a selected point at %s,%s', async (latitude, longitude) => {
    const { result, success, fail, complete } = openChooser()
    confirm(latitude, longitude)
    const response = await result
    expect(response).toEqual({ errMsg: 'chooseLocation:ok', latitude, longitude, name: 'place', address: 'address' })
    expect(success).toHaveBeenCalledTimes(1)
    expect(fail).not.toHaveBeenCalled()
    expect(complete).toHaveBeenCalledTimes(1)
  })

  test.each([[undefined, 1], [1, undefined], [NaN, 1], [Infinity, 1], [91, 1], [1, -181]])('rejects invalid selected coordinates %s,%s', async (latitude, longitude) => {
    const { result, success, fail, complete } = openChooser()
    confirm(latitude, longitude)
    expect(await result).toEqual({ errMsg: 'chooseLocation:fail' })
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
  })

  test('still fails when no point has been selected', async () => {
    const { result, success, fail } = openChooser()
    document.querySelector<HTMLElement>('.taro_choose_location_submit')!.click()
    expect(await result).toEqual({ errMsg: 'chooseLocation:fail' })
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
  })

  test('preserves cancellation', async () => {
    const { result, success, fail } = openChooser()
    document.querySelector<HTMLElement>('.taro_choose_location_back')!.click()
    expect(await result).toEqual({ errMsg: 'chooseLocation:fail cancel' })
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
  })

  test('ignores a popstate that arrives after the point has been confirmed', async () => {
    const { result, success, fail, complete } = openChooser()
    confirm(1, 2)
    expect(await result).toEqual(expect.objectContaining({ errMsg: 'chooseLocation:ok' }))

    // 选择器要到 300ms 后才会被移除，这期间用户仍可能按下浏览器返回
    window.dispatchEvent(new PopStateEvent('popstate'))
    jest.runOnlyPendingTimers()

    expect(success).toHaveBeenCalledTimes(1)
    expect(fail).not.toHaveBeenCalled()
    expect(complete).toHaveBeenCalledTimes(1)
  })

  test('ignores a second click on 返回 after cancellation', async () => {
    const { result, fail, complete } = openChooser()
    const back = document.querySelector<HTMLElement>('.taro_choose_location_back')!
    back.click()
    expect(await result).toEqual({ errMsg: 'chooseLocation:fail cancel' })

    back.click()
    jest.runOnlyPendingTimers()

    expect(fail).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
  })

  test('a chooser opened while the previous one is being torn down still works', async () => {
    const first = openChooser()
    confirm(1, 2)
    expect(await first.result).toEqual(expect.objectContaining({ errMsg: 'chooseLocation:ok' }))

    // 上一个选择器的移除定时器（300ms）还没到点就再次打开
    jest.advanceTimersByTime(100)
    const second = openChooser()
    expect(document.querySelector('.taro_choose_location_submit')).not.toBeNull()

    // 上一个选择器的移除定时器到点，不应影响这一个
    jest.advanceTimersByTime(400)
    expect(document.querySelector('.taro_choose_location_submit')).not.toBeNull()

    confirm(3, 4)
    expect(await second.result).toEqual({
      errMsg: 'chooseLocation:ok', latitude: 3, longitude: 4, name: 'place', address: 'address'
    })
    expect(second.success).toHaveBeenCalledTimes(1)
    expect(second.complete).toHaveBeenCalledTimes(1)
    // 第一次调用的回调不应被第二次的交互再次触发
    expect(first.success).toHaveBeenCalledTimes(1)
    expect(first.complete).toHaveBeenCalledTimes(1)
  })

  test('detaches its window listeners once a choice has been made', async () => {
    const addSpy = jest.spyOn(window, 'addEventListener')
    const removeSpy = jest.spyOn(window, 'removeEventListener')
    try {
      const { result } = openChooser()
      confirm(1, 2)
      await result
      jest.runOnlyPendingTimers()

      const count = (spy: jest.SpyInstance, type: string) =>
        spy.mock.calls.filter(call => call[0] === type).length
      expect(count(removeSpy, 'message')).toBe(count(addSpy, 'message'))
      expect(count(removeSpy, 'popstate')).toBe(count(addSpy, 'popstate'))
    } finally {
      addSpy.mockRestore()
      removeSpy.mockRestore()
    }
  })
})
