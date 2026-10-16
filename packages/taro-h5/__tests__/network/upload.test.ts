import { uploadFile } from '../../src/api/network/upload'
import * as utils from '../../src/api/network/utils'

describe('uploadFile lifecycle', () => {
  let xhr: XMLHttpRequest
  let send: jest.SpyInstance
  let abort: jest.SpyInstance
  let resolveFile: (file: Blob) => void
  let rejectFile: (error: unknown) => void

  beforeEach(() => {
    jest.useFakeTimers()
    xhr = new XMLHttpRequest()
    jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhr)
    jest.spyOn(xhr, 'open').mockImplementation(() => {})
    send = jest.spyOn(xhr, 'send').mockImplementation(() => {})
    // Aborting an opened XHR before send() does not emit an abort event.
    abort = jest.spyOn(xhr, 'abort').mockImplementation(() => {})
    jest.spyOn(utils, 'convertObjectUrlToBlob').mockImplementation(() => new Promise((resolve, reject) => {
      resolveFile = resolve
      rejectFile = reject
    }))
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  function createTask () {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const task = uploadFile({ url: '/upload', filePath: 'blob:file', name: 'file', timeout: 100, success, fail, complete })
    const result = task.catch(error => error)
    return { task, result, success, fail, complete }
  }

  test.each(['resolve', 'reject'])('abort during file conversion ignores a late %s', async outcome => {
    const { task, result, success, fail, complete } = createTask()
    task.abort()
    task.abort()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(await result).toEqual({ errMsg: 'uploadFile:fail abort' })

    if (outcome === 'resolve') resolveFile(new Blob(['file']))
    else rejectFile({ status: 404 })
    await Promise.resolve()
    await Promise.resolve()

    expect(send).not.toHaveBeenCalled()
    expect(abort).toHaveBeenCalledTimes(1)
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(0)
  })

  test.each([403, 404, 500])('preserves a file conversion failure status of %s', async status => {
    const { result, success, fail, complete } = createTask()
    rejectFile({ status })
    expect(await result).toEqual({ errMsg: `uploadFile:fail ${status}` })
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(send).not.toHaveBeenCalled()
    expect(jest.getTimerCount()).toBe(0)
  })

  test.each(['success', 'error', 'abort', 'timeout', 'conversion error'])('%s settles once and releases handlers and timers', async outcome => {
    const { task, result, success, fail, complete } = createTask()
    if (outcome === 'conversion error') {
      rejectFile(new Error('conversion failed'))
    } else {
      resolveFile(new Blob(['file']))
      await Promise.resolve()
      expect(send).toHaveBeenCalledTimes(1)
      switch (outcome) {
        case 'success': xhr.onload?.(new ProgressEvent('load')); break
        case 'error': xhr.onerror?.(Object.assign(new ProgressEvent('error'), { message: 'network error' })); break
        case 'abort': task.abort(); break
        case 'timeout': jest.advanceTimersByTime(100); break
      }
    }

    const response = await result
    expect(response.errMsg).toBe(outcome === 'success' ? 'uploadFile:ok'
      : `uploadFile:fail ${outcome === 'error' ? 'network error' : outcome === 'conversion error' ? 'conversion failed' : outcome}`)
    task.abort()
    jest.advanceTimersByTime(200)
    expect(success).toHaveBeenCalledTimes(outcome === 'success' ? 1 : 0)
    expect(fail).toHaveBeenCalledTimes(outcome === 'success' ? 0 : 1)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(abort).toHaveBeenCalledTimes(['abort', 'timeout'].includes(outcome) ? 1 : 0)
    expect(jest.getTimerCount()).toBe(0)
    expect(xhr.onload).toBeNull()
    expect(xhr.onabort).toBeNull()
    expect(xhr.onerror).toBeNull()
    expect(xhr.onreadystatechange).toBeNull()
    expect(xhr.upload.onprogress).toBeNull()
  })
})
