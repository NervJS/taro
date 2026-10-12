import { uploadFile } from '../src/lib/file'

describe('uploadFile', () => {
  const realFetch = global.fetch

  afterEach(() => {
    global.fetch = realFetch
    jest.restoreAllMocks()
  })

  const mockFetchOk = () => {
    global.fetch = jest.fn().mockResolvedValue(new Response('ok', { status: 200 }))
  }

  test('uses the real file name derived from filePath', async () => {
    mockFetchOk()
    const appendSpy = jest.spyOn(FormData.prototype, 'append')
    const success = jest.fn()
    const fail = jest.fn()

    await uploadFile({
      url: 'https://example.com/upload',
      filePath: '/data/user/0/com.example/cache/xxxx.jpg',
      name: 'file',
      success,
      fail
    })

    const fileCall = appendSpy.mock.calls.find(([key]) => key === 'file')
    expect(fileCall).toBeDefined()
    expect(fileCall![1]).toMatchObject({ name: 'xxxx.jpg', type: 'application/octet-stream' })
    expect(success).toHaveBeenCalledTimes(1)
    expect(fail).not.toHaveBeenCalled()
  })

  test('honors an explicit fileName option over the filePath basename', async () => {
    mockFetchOk()
    const appendSpy = jest.spyOn(FormData.prototype, 'append')

    await uploadFile({
      url: 'https://example.com/upload',
      filePath: '/data/user/0/com.example/cache/xxxx.jpg',
      name: 'file',
      fileName: 'custom-name.png'
    })

    const fileCall = appendSpy.mock.calls.find(([key]) => key === 'file')
    expect(fileCall).toBeDefined()
    expect(fileCall![1]).toMatchObject({ name: 'custom-name.png' })
  })

  test('keeps the historical "file" fallback when no name can be derived', async () => {
    mockFetchOk()
    const appendSpy = jest.spyOn(FormData.prototype, 'append')

    await uploadFile({
      url: 'https://example.com/upload',
      filePath: '/data/user/0/com.example/cache/',
      name: 'file'
    })

    const fileCall = appendSpy.mock.calls.find(([key]) => key === 'file')
    expect(fileCall).toBeDefined()
    expect(fileCall![1]).toMatchObject({ name: 'file' })
  })
})
