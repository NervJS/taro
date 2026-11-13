import { downloadFile } from '../../src/api/network/download'
import { uploadFile } from '../../src/api/network/upload'
import * as networkUtils from '../../src/api/network/utils'

describe.each([
  ['download', () => downloadFile({ url: '/download' })],
  ['upload', () => uploadFile({ url: '/upload', filePath: 'blob:file', name: 'file' })],
] as const)('%s response headers', (kind, start) => {
  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  test.each([
    ['', {}],
    ['__proto__: value\r\n', { ['__proto__']: 'value' }],
    ['content-type: text/plain\r\nx-custom: key: value\r\n', { 'content-type': 'text/plain', 'x-custom': 'key: value' }],
  ])('returns a header object for %j', async (raw, expected) => {
    jest.useFakeTimers()
    const xhr = new XMLHttpRequest()
    jest.spyOn(window, 'XMLHttpRequest').mockReturnValue(xhr)
    jest.spyOn(xhr, 'send').mockImplementation(() => {})
    jest.spyOn(networkUtils, 'convertObjectUrlToBlob').mockResolvedValue(new File(['test'], 'example.txt'))
    const task = start()
    const result = task.catch(error => error)
    const listener = jest.fn()
    task.onHeadersReceived(listener)

    jest.spyOn(xhr, 'readyState', 'get').mockReturnValue(xhr.HEADERS_RECEIVED)
    jest.spyOn(xhr, 'getAllResponseHeaders').mockReturnValue(raw)
    xhr.dispatchEvent(new Event('readystatechange'))
    expect(listener).toHaveBeenCalledWith({ header: expected })
    const { header } = listener.mock.calls[0][0]
    expect(Object.getPrototypeOf(header)).toBe(Object.prototype)
    expect(typeof header.hasOwnProperty).toBe('function')
    expect(Object.prototype.hasOwnProperty.call(header, '__proto__')).toBe(
      Object.prototype.hasOwnProperty.call(expected, '__proto__')
    )

    task.offHeadersReceived(listener)
    xhr.dispatchEvent(new Event('readystatechange'))
    expect(listener).toHaveBeenCalledTimes(1)

    await Promise.resolve()
    if (kind === 'upload') task.abort()
    else xhr.dispatchEvent(new ProgressEvent('abort'))
    await result
  })
})
