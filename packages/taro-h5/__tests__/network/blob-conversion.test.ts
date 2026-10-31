import { uploadFile } from '../../src/api/network/upload'
import { convertObjectUrlToBlob, NETWORK_TIMEOUT } from '../../src/api/network/utils'

function observe (promise: Promise<unknown>) {
  const state: { status: string, value?: unknown } = { status: 'pending' }
  promise.then(value => { state.status = 'resolved'; state.value = value }, error => {
    state.status = 'rejected'
    state.value = error
  })
  return state
}

async function flushPromises () {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}

describe('blob conversion lifecycle', () => {
  let requests: XMLHttpRequest[]
  const NativeXHR = window.XMLHttpRequest

  beforeEach(() => {
    jest.useFakeTimers()
    requests = []
    jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => {
      const xhr = new NativeXHR()
      jest.spyOn(xhr, 'open').mockImplementation(() => {})
      jest.spyOn(xhr, 'send').mockImplementation(() => {})
      jest.spyOn(xhr, 'abort').mockImplementation(() => {})
      requests.push(xhr)
      return xhr
    })
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  function response (xhr: XMLHttpRequest, status: number, value: unknown) {
    Object.defineProperty(xhr, 'status', { configurable: true, value: status })
    Object.defineProperty(xhr, 'response', { configurable: true, value })
  }

  function expectCleanup (xhr: XMLHttpRequest) {
    expect(xhr.onload).toBeNull()
    expect(xhr.onerror).toBeNull()
    expect(xhr.onabort).toBeNull()
    expect(xhr.ontimeout).toBeNull()
  }

  test.each(['error', 'abort', 'timeout'])('rejects on a conversion %s event', async event => {
    const state = observe(convertObjectUrlToBlob('blob:file'))
    const xhr = requests[0]
    xhr.dispatchEvent(new ProgressEvent(event))
    await flushPromises()
    expect(state).toEqual({
      status: 'rejected',
      value: { status: 0, message: event === 'error' ? 'file conversion failed' : event }
    })
    expectCleanup(xhr)
    expect(jest.getTimerCount()).toBe(0)
  })

  test('sets a finite default timeout before reading the blob URL', () => {
    observe(convertObjectUrlToBlob('blob:file'))
    const xhr = requests[0]
    expect(xhr.timeout).toBe(NETWORK_TIMEOUT)
    expect(xhr.open).toHaveBeenCalledWith('GET', 'blob:file', true)
    expect(xhr.responseType).toBe('blob')
    expect(xhr.withCredentials).toBe(true)
    expect(xhr.send).toHaveBeenCalledTimes(1)
  })

  test('returns the blob and releases handlers on success', async () => {
    const state = observe(convertObjectUrlToBlob('blob:file'))
    const xhr = requests[0]
    const blob = new Blob(['file'])
    response(xhr, 200, blob)
    xhr.dispatchEvent(new ProgressEvent('load'))
    await flushPromises()
    expect(state).toEqual({ status: 'resolved', value: blob })
    expectCleanup(xhr)
  })

  test.each([403, 404, 500])('preserves HTTP failure status %s', async status => {
    const state = observe(convertObjectUrlToBlob('blob:file'))
    const xhr = requests[0]
    response(xhr, status, null)
    xhr.dispatchEvent(new ProgressEvent('load'))
    await flushPromises()
    expect(state).toEqual({ status: 'rejected', value: { status } })
    expectCleanup(xhr)
  })

  test.each(['open', 'send'] as const)('preserves a synchronous %s error and releases handlers', async method => {
    const error = new Error(`${method} failed`)
    jest.spyOn(window, 'XMLHttpRequest').mockImplementationOnce(() => {
      const xhr = new NativeXHR()
      jest.spyOn(xhr, 'open').mockImplementation(() => {})
      jest.spyOn(xhr, 'send').mockImplementation(() => {})
      jest.spyOn(xhr, method).mockImplementation(() => { throw error })
      requests.push(xhr)
      return xhr
    })
    const state = observe(convertObjectUrlToBlob('blob:file'))
    await flushPromises()
    expect(state).toEqual({ status: 'rejected', value: error })
    expectCleanup(requests[0])
  })

  test.each(['load', 'error'] as const)('ignores late terminal handlers after %s', async first => {
    const resolved = jest.fn()
    const rejected = jest.fn()
    convertObjectUrlToBlob('blob:file').then(resolved, rejected)
    const xhr = requests[0]
    const load = xhr.onload
    const error = xhr.onerror
    response(xhr, 200, new Blob(['file']))
    xhr.dispatchEvent(new ProgressEvent(first))
    load?.call(xhr, new ProgressEvent('load'))
    error?.call(xhr, new ProgressEvent('error'))
    await flushPromises()
    expect(resolved).toHaveBeenCalledTimes(first === 'load' ? 1 : 0)
    expect(rejected).toHaveBeenCalledTimes(first === 'error' ? 1 : 0)
    expectCleanup(xhr)
  })

  test.each(['error', 'abort', 'timeout'])('uploadFile reports a conversion %s exactly once', async event => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const task = uploadFile({ url: '/upload', filePath: 'blob:file', name: 'file', timeout: 123, success, fail, complete })
    const state = observe(task)
    const [upload, conversion] = requests
    conversion.dispatchEvent(new ProgressEvent(event))
    await flushPromises()
    const failure = { errMsg: `uploadFile:fail ${event === 'error' ? 'file conversion failed' : event}` }
    expect(state).toEqual({ status: 'rejected', value: failure })
    expect(conversion.timeout).toBe(123)
    expect(upload.send).not.toHaveBeenCalled()
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail).toHaveBeenCalledWith(failure)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(failure)
    expectCleanup(conversion)
    task.abort()
    jest.runAllTimers()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(0)
  })

  test('uploadFile still sends the converted blob and resolves a successful upload', async () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const task = uploadFile({ url: '/upload', filePath: 'blob:file', name: 'file', success, fail, complete })
    const state = observe(task)
    const [upload, conversion] = requests
    response(conversion, 200, new Blob(['file']))
    conversion.dispatchEvent(new ProgressEvent('load'))
    await flushPromises()
    expect(upload.send).toHaveBeenCalledTimes(1)
    expect(conversion.timeout).toBe(NETWORK_TIMEOUT)
    const form = (upload.send as jest.Mock).mock.calls[0][0] as FormData
    expect(form.get('file')).toBeInstanceOf(Blob)
    response(upload, 201, 'uploaded')
    upload.dispatchEvent(new ProgressEvent('load'))
    await flushPromises()
    expect(state).toEqual({ status: 'resolved', value: { errMsg: 'uploadFile:ok', statusCode: 201, data: 'uploaded' } })
    expect(success).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(fail).not.toHaveBeenCalled()
    expect(jest.getTimerCount()).toBe(0)
    expectCleanup(conversion)
  })
})
