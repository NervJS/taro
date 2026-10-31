import { Current } from '@tarojs/runtime'

import { pageScrollTo } from '../../src/api/ui/scroll'

describe.each([false, true])('pageScrollTo target (window scroll: %s)', usingWindowScroll => {
  let page: HTMLDivElement
  let position: number
  let positions: number[]
  const previousPage = Current.page

  beforeEach(() => {
    jest.useFakeTimers()
    Current.page = null
    document.body.innerHTML = '<div class="taro_page"><div id="target"></div></div>'
    page = document.querySelector('.taro_page')!
    position = 0
    positions = []
    Object.defineProperty(page, 'scrollTop', {
      configurable: true,
      get: () => position,
      set: value => { position = value; positions.push(value) }
    })
    Object.defineProperty(window, 'pageYOffset', { configurable: true, get: () => position })
    jest.spyOn(window, 'scrollTo').mockImplementation((_x, y) => {
      position = y as number
      positions.push(position)
    })
    window.__taroAppConfig = { usingWindowScroll }
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
    Current.page = previousPage
    window.__taroAppConfig = {}
    document.body.innerHTML = ''
  })

  test.each([0, 1, 17, 18, 34, 51, 300])('reaches the exact target without overshooting at %sms', async duration => {
    const success = jest.fn()
    const complete = jest.fn()
    const fail = jest.fn()
    const result = pageScrollTo({ scrollTop: 200, duration, success, complete, fail })
    jest.runAllTimers()
    expect(await result).toEqual({ errMsg: 'pageScrollTo:ok' })
    expect(position).toBe(200)
    expect(positions.every(value => value >= 0 && value <= 200)).toBe(true)
    expect(positions.every((value, index) => index === 0 || value >= positions[index - 1])).toBe(true)
    expect(success).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(fail).not.toHaveBeenCalled()
    expect(jest.getTimerCount()).toBe(0)
  })

  test('scrolls upwards from a nonzero position to exactly zero', async () => {
    position = 400
    const result = pageScrollTo({ scrollTop: 0, duration: 34 })
    jest.runAllTimers()
    await result
    expect(position).toBe(0)
    expect(positions.every(value => value >= 0 && value <= 400)).toBe(true)
  })

  test('preserves the position when already at the target', async () => {
    position = 200
    const result = pageScrollTo({ scrollTop: 200 })
    jest.runAllTimers()
    await result
    expect(positions.every(value => value === 200)).toBe(true)
  })

  test('reaches a selector target including its offset', async () => {
    Object.defineProperty(document.querySelector('#target'), 'offsetTop', { value: 150 })
    const result = pageScrollTo({ selector: '#target', offsetTop: 50, duration: 34 })
    jest.runAllTimers()
    await result
    expect(position).toBe(200)
    expect(positions.every(value => value >= 0 && value <= 200)).toBe(true)
  })
})
