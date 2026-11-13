import { downloadFile } from '../../src/api/network/download'

afterEach(() => {
  jest.restoreAllMocks()
  jest.useRealTimers()
})

test.each([
  [false, 128, 0, 0],
  [false, 0, 0, 0],
  [true, 128, 0, 0],
  [true, 128, 512, 25],
])('reports finite progress (computable: %s, loaded: %s, total: %s)', async (lengthComputable, loaded, total, progress) => {
  jest.useFakeTimers()
  const xhr = new XMLHttpRequest()
  jest.spyOn(window, 'XMLHttpRequest').mockReturnValue(xhr)
  jest.spyOn(xhr, 'send').mockImplementation(() => {})
  const task = downloadFile({ url: '/file' })
  const result = task.catch(error => error)
  const onProgress = jest.fn()
  task.onProgressUpdate(onProgress)
  xhr.dispatchEvent(new ProgressEvent('progress', { lengthComputable, loaded, total }))

  expect(onProgress.mock.calls).toEqual([[{
    progress,
    totalBytesWritten: loaded,
    totalBytesExpectedToWrite: total
  }]])

  xhr.dispatchEvent(new ProgressEvent('abort'))
  await result
})
