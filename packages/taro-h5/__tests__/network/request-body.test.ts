import * as Taro from '@tarojs/taro-h5'

function mockPendingBody () {
  let resolveBody!: (value: unknown) => void
  let rejectBody!: (reason: Error) => void
  let startReading!: () => void
  let signal!: AbortSignal
  const body = new Promise((resolve, reject) => {
    resolveBody = resolve
    rejectBody = reject
  })
  const reading = new Promise<void>(resolve => { startReading = resolve })
  const read = jest.fn(() => {
    startReading()
    return body
  })
  jest.spyOn(global, 'fetch').mockImplementationOnce((_url, options) => {
    signal = options!.signal!
    signal.addEventListener('abort', () => {
      rejectBody(new DOMException('The operation was aborted.', 'AbortError'))
    }, { once: true })
    return Promise.resolve({
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => read().then(text => JSON.parse(text as string)),
      text: read,
      arrayBuffer: read,
    } as unknown as Response)
  })
  return { reading, resolveBody, rejectBody, getSignal: () => signal }
}

const responseTypes = [
  { name: 'default JSON', options: {}, body: '{"ok":true}', data: { ok: true } },
  { name: 'JSON', options: { dataType: 'json' as const }, body: '{"ok":true}', data: { ok: true } },
  { name: 'text', options: { dataType: 'text' as const }, body: 'body', data: 'body' },
  { name: 'arraybuffer', options: { responseType: 'arraybuffer' as const }, body: new ArrayBuffer(2), data: new ArrayBuffer(2) },
]

describe('request response body lifecycle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  describe.each(responseTypes)('$name', ({ options, body, data }) => {
    test.each(['abort', 'timeout', 'signal'])('should reject on %s while reading the body', async cause => {
      const pending = mockPendingBody()
      const controller = new AbortController()
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()
      const task = Taro.request({
        url: '/slow-body',
        ...options,
        timeout: 100,
        ...(cause === 'signal' ? { signal: controller.signal } : {}),
        success,
        fail,
        complete,
      })
      const result = task.catch(error => error)
      await pending.reading

      if (cause === 'abort') task.abort()
      if (cause === 'timeout') jest.advanceTimersByTime(100)
      if (cause === 'signal') controller.abort()

      expect(pending.getSignal().aborted).toBe(true)
      const error = await result
      expect(error).toMatchObject({ name: 'AbortError', statusCode: 200 })
      expect(success).not.toHaveBeenCalled()
      expect(fail).toHaveBeenCalledTimes(1)
      expect(fail).toHaveBeenCalledWith(error)
      expect(complete).toHaveBeenCalledTimes(1)
      expect(jest.getTimerCount()).toBe(0)
    })

    test('should clear the timeout and disable abort before success callbacks', async () => {
      const pending = mockPendingBody()
      const fail = jest.fn()
      const complete = jest.fn()
      const success = jest.fn()
      const task = Taro.request({ url: '/slow-body', ...options, timeout: 100, success, fail, complete })
      success.mockImplementation(() => {
        expect(jest.getTimerCount()).toBe(0)
        task.abort()
      })
      await pending.reading
      jest.advanceTimersByTime(50)
      pending.resolveBody(body)

      await expect(task).resolves.toMatchObject({ statusCode: 200, data })
      task.abort()
      jest.advanceTimersByTime(100)
      expect(pending.getSignal().aborted).toBe(false)
      expect(success).toHaveBeenCalledTimes(1)
      expect(fail).not.toHaveBeenCalled()
      expect(complete).toHaveBeenCalledTimes(1)
    })
  })

  test.each([new TypeError('Failed to fetch'), new Error('Body stream failed'), new SyntaxError('Custom abort reason')])(
    'should propagate JSON body read errors: %s', async error => {
      const pending = mockPendingBody()
      const success = jest.fn()
      const complete = jest.fn()
      const fail = jest.fn()
      const task = Taro.request({ url: '/broken-body', timeout: 100, success, fail, complete })
      fail.mockImplementation(() => {
        expect(jest.getTimerCount()).toBe(0)
        task.abort()
      })
      await pending.reading
      pending.rejectBody(error)

      await expect(task).rejects.toBe(error)
      expect(error).toMatchObject({ statusCode: 200, errMsg: error.message })
      task.abort()
      jest.advanceTimersByTime(100)
      expect(pending.getSignal().aborted).toBe(false)
      expect(success).not.toHaveBeenCalled()
      expect(fail).toHaveBeenCalledTimes(1)
      expect(complete).toHaveBeenCalledTimes(1)
    }
  )

  test.each(['{', ''])('should preserve null data for invalid JSON: %j', async body => {
    const pending = mockPendingBody()
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const task = Taro.request({ url: '/invalid-json', success, fail, complete })
    await pending.reading
    pending.resolveBody(body)

    await expect(task).resolves.toMatchObject({ statusCode: 200, data: null })
    expect(success).toHaveBeenCalledTimes(1)
    expect(fail).not.toHaveBeenCalled()
    expect(complete).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(0)
  })

  test.each(['abort', 'timeout'])('should still reject on %s before headers arrive', async cause => {
    jest.spyOn(global, 'fetch').mockImplementationOnce((_url, options) => new Promise((_resolve, reject) => {
      options!.signal!.addEventListener('abort', () => {
        reject(new DOMException('The operation was aborted.', 'AbortError'))
      }, { once: true })
    }))
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const task = Taro.request({ url: '/slow-headers', timeout: 100, success, fail, complete })
    if (cause === 'abort') task.abort()
    if (cause === 'timeout') jest.advanceTimersByTime(100)

    await expect(task).rejects.toMatchObject({ name: 'AbortError' })
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(0)
  })

  test('should preserve null data for a 204 response without reading the body', async () => {
    const read = jest.fn()
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204,
      headers: new Headers(),
      json: read,
      text: read,
    } as unknown as Response)

    await expect(Taro.request({ url: '/no-content' })).resolves.toMatchObject({ statusCode: 204, data: null })
    expect(read).not.toHaveBeenCalled()
    expect(jest.getTimerCount()).toBe(0)
  })
})
