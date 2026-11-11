import { getVideoInfo } from '../../src/api/media/video/getVideoInfo'

describe('getVideoInfo', () => {
  let video: HTMLVideoElement
  let fetchMock: jest.SpyInstance

  beforeEach(() => {
    video = document.createElement('video')
    jest.spyOn(document, 'createElement').mockReturnValue(video)
    fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      blob: async () => new Blob(['video'], { type: 'video/mp4' })
    } as Response)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test.each([undefined, '', 'Unsupported video format'])('rejects a media load error with message %s', async message => {
    Object.defineProperty(video, 'error', { value: message === undefined ? null : { message } })
    const result = getVideoInfo({ src: '/broken.mp4' })
    const rejection = expect(result).rejects.toEqual({
      errMsg: `getVideoInfo:fail ${message || 'Failed to load video'}`
    })

    video.dispatchEvent(new Event('error'))

    await rejection
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('calls fail and complete once when media loading fails', async () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const result = getVideoInfo({ src: '/broken.mp4', success, fail, complete })

    video.dispatchEvent(new Event('error'))
    video.dispatchEvent(new Event('error'))
    video.dispatchEvent(new Event('loadedmetadata'))

    const response = await result
    expect(response).toEqual({ errMsg: 'getVideoInfo:fail Failed to load video' })
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail).toHaveBeenCalledWith(response)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(response)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('returns video metadata and invokes success and complete once', async () => {
    Object.defineProperties(video, {
      duration: { value: 2 },
      videoWidth: { value: 640 },
      videoHeight: { value: 360 }
    })
    const success = jest.fn()
    const complete = jest.fn()
    const result = getVideoInfo({ src: '/video.mp4', success, complete })

    video.dispatchEvent(new Event('loadedmetadata'))
    video.dispatchEvent(new Event('loadedmetadata'))
    video.dispatchEvent(new Event('error'))

    const response = await result
    expect(response).toEqual({
      errMsg: 'getVideoInfo:ok',
      orientation: 'up',
      type: 'video/mp4',
      duration: 2,
      size: 5,
      height: 360,
      width: 640,
      fps: 30,
      bitrate: 2.5
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/video.mp4')
    expect(success).toHaveBeenCalledTimes(1)
    expect(success).toHaveBeenCalledWith(response)
    expect(complete).toHaveBeenCalledTimes(1)
  })

  test('still rejects when fetching the video fails after metadata loads', async () => {
    fetchMock.mockRejectedValue(new Error('fetch failed'))
    const result = getVideoInfo({ src: '/video.mp4' })
    const rejection = expect(result).rejects.toEqual({ errMsg: 'getVideoInfo:fail Error: fetch failed' })

    video.dispatchEvent(new Event('loadedmetadata'))

    await rejection
  })
})
