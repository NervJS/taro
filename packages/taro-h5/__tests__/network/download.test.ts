import { downloadFile } from '../../src/api/network/download'

describe('downloadFile lifecycle', () => {
  let xhr: XMLHttpRequest
  let abort: jest.SpyInstance

  beforeEach(() => {
    jest.useFakeTimers()
    xhr = new XMLHttpRequest()
    jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhr)
    jest.spyOn(xhr, 'open').mockImplementation(() => {})
    jest.spyOn(xhr, 'send').mockImplementation(() => {})
    abort = jest.spyOn(xhr, 'abort').mockImplementation(() => {
      xhr.onabort?.(new ProgressEvent('abort'))
    })
    Object.defineProperty(window.URL, 'createObjectURL', {
      configurable: true,
      value: jest.fn(() => 'blob:download')
    })
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
    delete window.URL.createObjectURL
  })

  test.each(['success', 'error', 'abort', 'timeout'])('%s settles callbacks once and clears the timeout', async outcome => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const task = downloadFile({ url: '/file', timeout: 100, success, fail, complete })
    // Attach the rejection handler before triggering a terminal event.
    const result = task.catch(error => error)

    switch (outcome) {
      case 'success':
        xhr.onload?.(new ProgressEvent('load'))
        break
      case 'error':
        xhr.onerror?.(Object.assign(new ProgressEvent('error'), { message: 'network error' }))
        break
      case 'abort':
        task.abort()
        break
      case 'timeout':
        jest.advanceTimersByTime(100)
        break
    }

    const response = await result
    expect(response.errMsg).toBe(outcome === 'success'
      ? 'downloadFile:ok'
      : `downloadFile:fail ${outcome === 'error' ? 'network error' : outcome}`)
    expect(jest.getTimerCount()).toBe(0)
    jest.advanceTimersByTime(200)
    expect(success).toHaveBeenCalledTimes(outcome === 'success' ? 1 : 0)
    expect(fail).toHaveBeenCalledTimes(outcome === 'success' ? 0 : 1)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(abort).toHaveBeenCalledTimes(['abort', 'timeout'].includes(outcome) ? 1 : 0)
  })
})
