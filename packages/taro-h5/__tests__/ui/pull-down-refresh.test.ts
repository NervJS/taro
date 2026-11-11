import Taro from '@tarojs/api'
import { Current } from '@tarojs/runtime'

import { startPullDownRefresh, stopPullDownRefresh } from '../../src/api/ui/pull-down-refresh'

describe.each([
  ['startPullDownRefresh', '__taroStartPullDownRefresh', startPullDownRefresh],
  ['stopPullDownRefresh', '__taroStopPullDownRefresh', stopPullDownRefresh],
] as const)('%s', (name, event, call) => {
  const originalPage = Current.page

  afterEach(() => {
    Taro.eventCenter.off(event)
    Current.page = originalPage
    document.body.innerHTML = ''
    jest.useRealTimers()
  })

  test('rejects when no refresh component is mounted', async () => {
    await expect(call()).rejects.toEqual({ errMsg: `${name}:fail no active pull-down refresh component` })
  })

  test('ignores a listener from another page and reports failure once', async () => {
    Current.page = { path: 'current-page' }
    document.body.innerHTML = '<div id="previous" class="taro_page"><div id="other-refresh"></div></div><div id="current-page" class="taro_page"></div>'
    const other = jest.fn()
    Taro.eventCenter.on(event, ({ claim, successHandler }) => {
      if (!claim(document.getElementById('other-refresh'))) return
      other()
      successHandler()
    })
    const fail = jest.fn()
    const complete = jest.fn()
    const failure = { errMsg: `${name}:fail no active pull-down refresh component` }

    await expect(call({ fail, complete })).resolves.toEqual(failure)
    expect(other).not.toHaveBeenCalled()
    expect(fail.mock.calls).toEqual([[failure]])
    expect(complete.mock.calls).toEqual([[failure]])
  })

  test('allows the current component to claim a request and finish asynchronously once', async () => {
    jest.useFakeTimers()
    Current.page = { path: 'current-page' }
    document.body.innerHTML = '<div id="current-page" class="taro_page"><div id="refresh"></div></div>'
    const handleRequest = jest.fn(({ claim, successHandler }) => {
      if (!claim(document.getElementById('refresh'))) return
      setTimeout(() => successHandler(), 0)
    })
    Taro.eventCenter.on(event, handleRequest)
    Taro.eventCenter.on(event, handleRequest)
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const result = call({ success, fail, complete })

    expect(jest.getTimerCount()).toBe(1)
    jest.runAllTimers()
    const response = { errMsg: `${name}:ok` }
    await expect(result).resolves.toEqual(response)
    expect(success.mock.calls).toEqual([[response]])
    expect(complete.mock.calls).toEqual([[response]])
    expect(fail).not.toHaveBeenCalled()
  })
})
