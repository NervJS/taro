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

  test.each([0, 200])('prefers scrollTop=%s over a selector and its offset', async scrollTop => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    Object.defineProperty(document.querySelector('#target'), 'offsetTop', { value: 500 })

    await expect(pageScrollTo({ scrollTop, selector: '#target', offsetTop: 25, duration: 0 }))
      .resolves.toEqual({ errMsg: 'pageScrollTo:ok' })

    expect(position).toBe(scrollTop)
    expect(console.warn).toHaveBeenCalledTimes(1)
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

  test('fails without moving when the selector does not match', async () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    position = 100

    await expect(pageScrollTo({ selector: '#missing', offsetTop: 20, duration: 0, success, fail, complete }))
      .resolves.toEqual({ errMsg: 'pageScrollTo:fail selector not found' })

    expect(position).toBe(100)
    expect(positions).toHaveLength(0)
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail).toHaveBeenCalledWith({ errMsg: 'pageScrollTo:fail selector not found' })
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith({ errMsg: 'pageScrollTo:fail selector not found' })
  })

  test('rejects when no failure callbacks are supplied', async () => {
    await expect(pageScrollTo({ selector: '#missing', duration: 0 }))
      .rejects.toEqual({ errMsg: 'pageScrollTo:fail selector not found' })
    expect(positions).toHaveLength(0)
  })

  test('uses the current page when an earlier page has a matching selector', async () => {
    page.id = 'pages/current'
    Current.page = { path: page.id }
    page.insertAdjacentHTML('beforebegin', '<div class="taro_page"><div id="target"></div></div>')
    const [otherTarget, currentTarget] = document.querySelectorAll('#target')
    Object.defineProperty(otherTarget, 'offsetTop', { value: 400 })
    Object.defineProperty(currentTarget, 'offsetTop', { value: 0 })
    position = 100

    await expect(pageScrollTo({ selector: '#target', offsetTop: 25, duration: 0 }))
      .resolves.toEqual({ errMsg: 'pageScrollTo:ok' })

    expect(position).toBe(25)
  })

  test('fails when a selector only matches outside the current page', async () => {
    page.id = 'pages/current'
    Current.page = { path: page.id }
    page.insertAdjacentHTML('beforebegin', '<div class="taro_page"><div id="previous-target"></div></div>')
    position = 100

    await expect(pageScrollTo({ selector: '#previous-target', duration: 0 }))
      .rejects.toEqual({ errMsg: 'pageScrollTo:fail selector not found' })

    expect(position).toBe(100)
    expect(positions).toHaveLength(0)
  })

  test('reports invalid selectors through the failure path', async () => {
    await expect(pageScrollTo({ selector: '[', duration: 0 }))
      .rejects.toEqual({ errMsg: expect.stringMatching(/^pageScrollTo:fail /) })
    expect(positions).toHaveLength(0)
  })

  test('can still select the current page container itself', async () => {
    page.id = 'current-page'
    Current.page = { path: page.id }
    Object.defineProperty(page, 'offsetTop', { value: 40 })

    await pageScrollTo({ selector: '#current-page', duration: 0 })

    expect(position).toBe(40)
  })

  if (usingWindowScroll) {
    test('does not select an earlier page while the current one is absent', async () => {
      Current.page = { path: 'pages/not-mounted' }

      await expect(pageScrollTo({ selector: '#target', duration: 0 }))
        .rejects.toEqual({ errMsg: 'pageScrollTo:fail selector not found' })
      expect(positions).toHaveLength(0)
    })

    test('can find document targets before a page is registered', async () => {
      page.className = ''
      Object.defineProperty(document.querySelector('#target'), 'offsetTop', { value: 150 })

      await pageScrollTo({ selector: '#target', duration: 0 })

      expect(position).toBe(150)
    })
  }

  test('reaches a selector target including its offset', async () => {
    Object.defineProperty(document.querySelector('#target'), 'offsetTop', { value: 150 })
    const result = pageScrollTo({ selector: '#target', offsetTop: 50, duration: 34 })
    jest.runAllTimers()
    await result
    expect(position).toBe(200)
    expect(positions.every(value => value >= 0 && value <= 200)).toBe(true)
  })
})
