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

  test.each([0, 34])('settles a scroll superseded by a %sms scroll', async duration => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const settled = jest.fn()
    const first = pageScrollTo({ scrollTop: 200, success, fail, complete }).then(settled)
    jest.advanceTimersByTime(17)
    const second = pageScrollTo({ scrollTop: 300, duration })

    jest.runAllTimers()
    await expect(second).resolves.toEqual({ errMsg: 'pageScrollTo:ok' })
    const failure = { errMsg: 'pageScrollTo:fail interrupted by another scroll' }
    expect(settled).toHaveBeenCalledTimes(1)
    expect(settled).toHaveBeenCalledWith(failure)
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail).toHaveBeenCalledWith(failure)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(failure)
    expect(position).toBe(300)
    expect(jest.getTimerCount()).toBe(0)
    await first
  })

  test('rejects a superseded scroll without failure callbacks', async () => {
    const rejected = jest.fn()
    const first = pageScrollTo({ scrollTop: 200 }).catch(rejected)
    const second = pageScrollTo({ scrollTop: 300 })

    jest.runAllTimers()
    await second
    expect(rejected).toHaveBeenCalledWith({ errMsg: 'pageScrollTo:fail interrupted by another scroll' })
    await first
  })

  test('honors a newer scroll started from a cancellation callback', async () => {
    let latest: ReturnType<typeof pageScrollTo> | undefined
    const onInterrupted = () => {
      latest = pageScrollTo({ scrollTop: 400, duration: 0 })
    }
    const first = pageScrollTo({ scrollTop: 200, fail: onInterrupted })
    const rejected = jest.fn()
    const second = pageScrollTo({ scrollTop: 300 }).catch(rejected)

    jest.runAllTimers()
    await Promise.resolve()
    expect(latest).toBeDefined()
    await latest
    expect(rejected).toHaveBeenCalledWith({ errMsg: 'pageScrollTo:fail interrupted by another scroll' })
    expect(position).toBe(400)
    await first
    await second
  })

  if (!usingWindowScroll) {
    test('keeps animations on independent page containers running', async () => {
      page.id = 'pages/first'
      Current.page = { path: page.id }
      const nextPage = document.createElement('div')
      nextPage.className = 'taro_page'
      nextPage.id = 'pages/second'
      document.body.appendChild(nextPage)
      const firstComplete = jest.fn()
      const first = pageScrollTo({ scrollTop: 200, complete: firstComplete })
      Current.page = { path: nextPage.id }
      const second = pageScrollTo({ scrollTop: 300 })

      jest.runAllTimers()
      await second
      expect(firstComplete).toHaveBeenCalledWith({ errMsg: 'pageScrollTo:ok' })
      expect(position).toBe(200)
      expect(nextPage.scrollTop).toBe(300)
      await first
    })
  }

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
