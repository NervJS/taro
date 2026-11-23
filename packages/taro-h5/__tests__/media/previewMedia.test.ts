import { eventCenter } from '@tarojs/runtime'
import * as Taro from '@tarojs/taro-h5'

describe('previewMedia', () => {
  afterEach(() => {
    eventCenter.trigger('__taroRouterChange')
    jest.restoreAllMocks()
    document.body.replaceChildren()
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

  it('restores background focus only after the final preview closes', async () => {
    const trigger = document.createElement('button')
    const inertBackground = document.createElement('div')
    trigger.inert = false
    inertBackground.inert = true
    document.body.append(trigger, inertBackground)
    trigger.focus()

    await Taro.previewMedia({ sources: [{ url: '/first.png' }] })
    const reopen = jest.fn(() => Taro.previewMedia({ sources: [{ url: '/reopened.png' }] }))
    trigger.addEventListener('focus', reopen, { once: true })
    await Taro.previewMedia({ sources: [{ url: '/second.png' }] })

    expect(reopen).not.toHaveBeenCalled()
    expect(document.querySelectorAll('.preview-media')).toHaveLength(1)
    expect(trigger.inert).toBe(true)

    eventCenter.trigger('__taroRouterChange')
    expect(reopen).toHaveBeenCalledTimes(1)
    expect(document.querySelectorAll('.preview-media')).toHaveLength(1)
    expect(document.querySelector('.preview-media img')?.getAttribute('src')).toBe('/reopened.png')

    eventCenter.trigger('__taroRouterChange')
    expect(document.querySelector('.preview-media')).toBeNull()
    expect(document.activeElement).toBe(trigger)
    expect(trigger.inert).toBe(false)
    expect(inertBackground.inert).toBe(true)
  })

  it('switches media with arrow keys and follows touch navigation', async () => {
    await Taro.previewMedia({
      sources: [{ url: '/first.png' }, { url: '/second.png' }, { url: '/third.png' }],
    })

    const preview = document.querySelector<HTMLElement>('.preview-media')!
    const swiper = preview.querySelector('taro-swiper-core') as HTMLElement & { current: number }
    const closeButton = preview.querySelector('button')!
    const arrowRight = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
    closeButton.dispatchEvent(arrowRight)
    expect(arrowRight.defaultPrevented).toBe(true)
    expect(swiper.current).toBe(1)

    closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }))
    expect(swiper.current).toBe(0)

    swiper.dispatchEvent(new CustomEvent('change', { detail: { current: 1 } }))
    closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
    expect(swiper.current).toBe(2)
  })

  it('synchronizes the current property after touch navigation', async () => {
    await Taro.previewMedia({
      sources: [{ url: '/first.png' }, { url: '/second.png' }],
    })

    const preview = document.querySelector<HTMLElement>('.preview-media')!
    const swiper = preview.querySelector('taro-swiper-core') as HTMLElement & { current: number }
    const closeButton = preview.querySelector('button')!
    swiper.dispatchEvent(new CustomEvent('change', { detail: { current: 1 } }))
    expect(swiper.current).toBe(1)

    closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }))
    expect(swiper.current).toBe(0)
  })

  it('uses the mounted media count for keyboard navigation', async () => {
    const sources = [{ url: '/first.png' }, { url: '/second.png' }]
    await Taro.previewMedia({ sources })
    sources.length = 0

    const preview = document.querySelector('.preview-media')!
    const swiper = preview.querySelector('taro-swiper-core') as HTMLElement & { current: number }
    preview.querySelector('button')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

    expect(swiper.current).toBe(1)
  })

  it('leaves arrow keys to the native video controls', async () => {
    await Taro.previewMedia({
      sources: [{ url: '/video.mp4', type: 'video' }, { url: '/second.png' }],
    })

    const preview = document.querySelector<HTMLElement>('.preview-media')!
    const swiper = preview.querySelector('taro-swiper-core') as HTMLElement & { current: number }
    const video = preview.querySelector('video')!
    const arrowRight = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
    video.dispatchEvent(arrowRight)

    expect(arrowRight.defaultPrevented).toBe(false)
    expect(swiper.current).toBe(0)
  })

  it('keeps videos on inactive slides out of the Tab order', async () => {
    await Taro.previewMedia({
      sources: [{ url: '/first.png' }, { url: '/video.mp4', type: 'video' }],
    })

    const preview = document.querySelector<HTMLElement>('.preview-media')!
    const swiper = preview.querySelector('taro-swiper-core') as HTMLElement & { current: number }
    const video = preview.querySelector('video')!
    const closeButton = preview.querySelector('button')!
    expect(video.tabIndex).toBe(-1)

    const imageTab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    closeButton.dispatchEvent(imageTab)
    expect(imageTab.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(closeButton)

    swiper.dispatchEvent(new CustomEvent('change', { detail: { current: 1 } }))
    expect(video.tabIndex).toBe(0)
    const videoTab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    closeButton.dispatchEvent(videoTab)
    expect(videoTab.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(video)
  })

  it('moves focus off an inactive video so arrow navigation can continue', async () => {
    await Taro.previewMedia({
      sources: [{ url: '/first.png' }, { url: '/video.mp4', type: 'video' }],
      current: 1,
    })

    const preview = document.querySelector('.preview-media')!
    const swiper = preview.querySelector('taro-swiper-core') as HTMLElement & { current: number }
    const video = preview.querySelector('video')!
    const closeButton = preview.querySelector('button')!
    video.focus()
    expect(document.activeElement).toBe(video)

    swiper.dispatchEvent(new CustomEvent('change', { detail: { current: 0 } }))
    expect(document.activeElement).toBe(closeButton)

    closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(swiper.current).toBe(1)
  })

  it('makes the background inert and traps Tab focus until close', async () => {
    const background = document.createElement('button')
    background.textContent = 'background'
    background.inert = false
    document.body.appendChild(background)
    background.focus()

    await Taro.previewMedia({ sources: [{ url: '/image.png' }] })
    const closeButton = document.querySelector<HTMLButtonElement>('.preview-media button')!
    expect(document.activeElement).toBe(closeButton)
    expect(background.inert).toBe(true)

    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    closeButton.dispatchEvent(tab)
    expect(tab.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(closeButton)

    const shiftTab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })
    closeButton.dispatchEvent(shiftTab)
    expect(shiftTab.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(closeButton)

    closeButton.click()
    expect(background.inert).toBe(false)
    expect(document.activeElement).toBe(background)
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
