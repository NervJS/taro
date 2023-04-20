import Taro from '@tarojs/api'
import { SwiperProps } from '@tarojs/components'
import { defineCustomElementTaroSwiperCore, defineCustomElementTaroSwiperItemCore } from '@tarojs/components/dist/components'
import { isFunction } from '@tarojs/shared'

import { shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * previewImage api基于开源的React组件[react-wx-images-viewer](https://github.com/react-ld/react-wx-images-viewer)开发，感谢！
 */

/**
 * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
 */
export const previewImage: typeof Taro.previewImage = async (options) => {
  // TODO 改为通过 window.__taroAppConfig 获取配置的 Swiper 插件创建节点
  defineCustomElementTaroSwiperCore()
  defineCustomElementTaroSwiperItemCore()

  function loadImage (url: string, loadFail: typeof fail): Promise<Node> {
    return new Promise((resolve) => {
      const item = document.createElement('taro-swiper-item-core')
      item.style.cssText = 'display:flex;align-items:start;justify-content:center;overflow-y:scroll;'
      const image = new Image()
      image.style.maxWidth = '100%'
      image.src = url
      const div = document.createElement('div')
      div.classList.add('swiper-zoom-container')
      div.style.cssText = 'display:flex;align-items:center;justify-content:center;max-width:100%;min-height:100%;'
      div.appendChild(image)
      item.appendChild(div)
      // Note: 等待图片加载完后返回，会导致轮播被卡住
      resolve(item)
      if (isFunction(loadFail)) {
        image.addEventListener('error', (err) => {
          loadFail({ errMsg: err.message })
        })
      }
    })
  }

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `previewImage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { urls = [], current = '', success, fail, complete } = options
  const handle = new MethodHandler({ name: 'previewImage', success, fail, complete })
  const container = document.createElement('div')
  container.classList.add('preview-image')
  container.style.cssText = 'position:fixed;top:0;left:0;z-index:1050;width:100%;height:100%;overflow:hidden;outline:0;background-color:#111;'
  container.addEventListener('click', () => {
    container.remove()
  })

  const swiper: HTMLElement & Omit<SwiperProps, 'style' | 'children'> = document.createElement('taro-swiper-core')
  // @ts-ignore
  swiper.full = true
  // @ts-ignore
  swiper.zoom = true

  let children: Node[] = []
  try {
    children = await Promise.all(
      urls.map(e => loadImage(e, fail))
    )
  } catch (error) {
    return handle.fail({
      errMsg: error
    })
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    swiper.appendChild(child)
  }

  const currentIndex = urls.indexOf(current)
  // @ts-ignore
  swiper.current = currentIndex

  container.appendChild(swiper)
  document.body.appendChild(container)

  return handle.success()
}
