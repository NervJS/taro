import { SwiperProps } from '@tarojs/components'
import {
  defineCustomElementTaroSwiperCore,
  defineCustomElementTaroSwiperItemCore,
} from '@tarojs/components/dist/components'
import { eventCenter } from '@tarojs/runtime'
import { isFunction } from '@tarojs/shared'
import Taro from '@tarojs/taro'

import { shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * previewImage api基于开源的React组件[react-wx-images-viewer](https://github.com/react-ld/react-wx-images-viewer)开发，感谢！
 * 在新页面中全屏预览图片/视频。预览的过程中用户可以进行保存图片/视频、发送给朋友等操作。
 * 
 * @canUse previewMedia
 * @__object [sources, current]
 */
export const previewMedia: typeof Taro.previewMedia = async (options) => {
  // TODO 改为通过 window.__taroAppConfig 获取配置的 Swiper 插件创建节点
  defineCustomElementTaroSwiperCore()
  defineCustomElementTaroSwiperItemCore()

  function loadImageAndVideo (sources: Taro.previewMedia.Sources, loadFail: typeof fail): Promise<Node> {
    return new Promise((resolve) => {
      const item = document.createElement('taro-swiper-item-core')
      item.style.cssText = 'display:flex;align-items:start;justify-content:center;overflow-y:scroll;'
      const image = new Image()
      const video = document.createElement('video')
      if (sources?.type === 'image') {
        image.style.maxWidth = '100%'
        image.src = sources?.url
      } else {
        video.style.maxWidth = '100%'
        video.setAttribute('controls', 'controls')
        const source = document.createElement('source')
        source.src = sources?.url
        video.appendChild(source)
        video.poster = sources?.poster || ''
      }
      const div = document.createElement('div')
      div.classList.add('swiper-zoom-container')
      div.style.cssText = 'display:flex;align-items:center;justify-content:center;max-width:100%;min-height:100%;'
      if (sources?.type === 'image') {
        div.appendChild(image)
      } else {
        div.appendChild(video)
      }
      item.appendChild(div)
      // Note: 等待图片加载完后返回，会导致轮播被卡住
      resolve(item)
      if (sources?.type === 'image' && isFunction(loadFail)) {
        image.addEventListener('error', (err) => {
          loadFail({ errMsg: err.message })
        })
      }
    })
  }

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `previewMedia:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { sources = [], current = 0, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'previewMedia', success, fail, complete })
  const container = document.createElement('div')
  container.classList.add('preview-image')
  container.style.cssText =
    'position:fixed;top:0;left:0;z-index:1050;width:100%;height:100%;overflow:hidden;outline:0;background-color:#111;'

  const removeHandler = () => {
    eventCenter.off('__taroRouterChange', removeHandler)
    container.remove()
    eventCenter.trigger('__taroExitFullScreen', {})
  }
  container.addEventListener('click', removeHandler)

  // 路由改变后应该关闭预览框
  eventCenter.on('__taroRouterChange', removeHandler)

  const swiper: HTMLElement & Omit<SwiperProps, 'style' | 'children'> = document.createElement('taro-swiper-core')
  // @ts-ignore
  swiper.full = true
  // @ts-ignore
  swiper.zoom = true

  let children: Node[] = []
  try {
    children = await Promise.all(sources.map((e) => loadImageAndVideo(e, fail)))
  } catch (error) {
    return handle.fail({
      errMsg: error,
    })
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    swiper.appendChild(child)
  }

  const currentIndex = current
  // @ts-ignore
  swiper.current = currentIndex

  container.appendChild(swiper)
  document.body.appendChild(container)
  eventCenter.trigger('__taroEnterFullScreen', {})

  return handle.success()
}
