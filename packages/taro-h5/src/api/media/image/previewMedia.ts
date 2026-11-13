import Taro from '@tarojs/api'
import {
  defineCustomElementTaroSwiperCore,
  defineCustomElementTaroSwiperItemCore,
} from '@tarojs/components/dist/components'
import { eventCenter } from '@tarojs/runtime'

import { shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

let closePreview: (() => void) | undefined

export const previewMedia: typeof Taro.previewMedia = async options => {
  const validation = shouldBeObject(options)
  if (!validation.flag) {
    return new MethodHandler({ name: 'previewMedia' }).fail({ errMsg: validation.msg })
  }

  const { sources, current = 0, success, fail, complete } = options
  const handler = new MethodHandler({ name: 'previewMedia', success, fail, complete })
  if (!Array.isArray(sources) || sources.length === 0 || !Array.from(sources).every(source =>
    source && typeof source.url === 'string' && source.url.trim() &&
    (source.type === undefined || source.type === 'image' || source.type === 'video')
  )) {
    return handler.fail({ errMsg: 'sources must contain valid image or video URLs' })
  }
  if (!Number.isInteger(current) || current < 0 || current >= sources.length) {
    return handler.fail({ errMsg: 'current is out of range' })
  }

  defineCustomElementTaroSwiperCore()
  defineCustomElementTaroSwiperItemCore()

  const container = document.createElement('div')
  container.className = 'preview-media'
  container.setAttribute('role', 'dialog')
  container.setAttribute('aria-label', '媒体预览')
  container.setAttribute('aria-modal', 'true')
  container.style.cssText = 'position:fixed;inset:0;z-index:1050;overflow:hidden;background:#111;'

  const swiper = document.createElement('taro-swiper-core') as HTMLElement & {
    current: number
    full: boolean
    zoom: boolean
  }
  swiper.full = true
  swiper.zoom = true
  swiper.current = current

  const videos = new Map<number, HTMLVideoElement>()
  sources.forEach((source, index) => {
    const item = document.createElement('taro-swiper-item-core')
    item.style.cssText = 'display:flex;align-items:center;justify-content:center;'
    if (source.type === 'video') {
      const video = document.createElement('video')
      video.controls = true
      video.playsInline = true
      video.preload = 'metadata'
      if (source.poster) video.poster = source.poster
      video.style.cssText = 'width:100%;max-height:100%;'
      video.src = source.url
      item.appendChild(video)
      videos.set(index, video)
    } else {
      const image = document.createElement('img')
      image.alt = ''
      image.style.cssText = 'display:block;max-width:100%;max-height:100%;object-fit:contain;'
      image.src = source.url
      const zoomContainer = document.createElement('div')
      zoomContainer.className = 'swiper-zoom-container'
      zoomContainer.style.cssText = 'width:100%;height:100%;'
      zoomContainer.appendChild(image)
      item.appendChild(zoomContainer)
    }
    swiper.appendChild(item)
  })
  swiper.addEventListener('change', (event: CustomEvent<{ current: number }>) => {
    videos.forEach((video, index) => {
      if (index !== event.detail.current && !video.paused) video.pause()
    })
  })

  closePreview?.()
  const previousFocus = document.activeElement
  const close = () => {
    eventCenter.off('__taroRouterChange', close)
    videos.forEach(video => {
      if (!video.paused) video.pause()
      video.removeAttribute('src')
      video.load()
    })
    container.remove()
    closePreview = undefined
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
  }
  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.textContent = '×'
  closeButton.setAttribute('aria-label', '关闭预览')
  closeButton.style.cssText = 'position:absolute;z-index:1;top:12px;right:12px;width:44px;height:44px;border:0;border-radius:50%;background:#111;color:#fff;font-size:28px;cursor:pointer;'
  closeButton.addEventListener('click', close)
  container.addEventListener('keydown', event => {
    if (event.key === 'Escape') close()
  })
  container.append(swiper, closeButton)
  document.body.appendChild(container)
  closePreview = close
  eventCenter.on('__taroRouterChange', close)
  closeButton.focus()
  return handler.success()
}
