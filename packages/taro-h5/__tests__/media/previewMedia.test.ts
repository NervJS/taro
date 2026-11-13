import { eventCenter } from '@tarojs/runtime'
import * as Taro from '@tarojs/taro-h5'

describe('previewMedia', () => {
  afterEach(() => {
    eventCenter.trigger('__taroRouterChange')
    jest.restoreAllMocks()
  })

  it('opens mixed sources at the requested index and releases video on close', async () => {
    const pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    jest.spyOn(HTMLMediaElement.prototype, 'paused', 'get').mockReturnValue(false)
    const load = jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    const success = jest.fn()
    const complete = jest.fn()
    await expect(Taro.previewMedia({
      sources: [{ url: '/image.png' }, { url: '/video.mp4', type: 'video', poster: '/poster.png' }],
      current: 1,
      success,
      complete,
    })).resolves.toEqual({ errMsg: 'previewMedia:ok' })

    const preview = document.querySelector<HTMLElement>('.preview-media')!
    const swiper = preview.querySelector('taro-swiper-core') as HTMLElement & { current: number }
    const video = preview.querySelector('video')!
    expect(swiper.current).toBe(1)
    expect(preview.querySelector('img')?.getAttribute('src')).toBe('/image.png')
    expect(video.getAttribute('poster')).toBe('/poster.png')
    expect(video.controls).toBe(true)
    swiper.dispatchEvent(new CustomEvent('change', { detail: { current: 0 } }))
    expect(pause).toHaveBeenCalledTimes(1)
    expect(success).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)

    preview.querySelector('button')!.click()
    expect(preview.isConnected).toBe(false)
    expect(video.hasAttribute('src')).toBe(false)
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('replaces the active preview and closes it on route change', async () => {
    await Taro.previewMedia({ sources: [{ url: '/first.png' }] })
    const first = document.querySelector('.preview-media')
    await Taro.previewMedia({ sources: [{ url: '/second.png' }] })
    expect(first?.isConnected).toBe(false)
    expect(document.querySelectorAll('.preview-media')).toHaveLength(1)
    eventCenter.trigger('__taroRouterChange')
    expect(document.querySelector('.preview-media')).toBeNull()
  })

  it('rejects an empty list or out-of-range index without mounting a dialog', async () => {
    await expect(Taro.previewMedia({ sources: [] })).rejects.toMatchObject({
      errMsg: expect.stringContaining('previewMedia:fail'),
    })
    await expect(Taro.previewMedia({ sources: [{ url: '/image.png' }], current: 1 })).rejects.toMatchObject({
      errMsg: 'previewMedia:fail current is out of range',
    })
    expect(document.querySelector('.preview-media')).toBeNull()
  })
})
