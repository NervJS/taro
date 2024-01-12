import { SwiperProps } from '@tarojs/components'
import {
  defineCustomElementTaroSwiperCore,
  defineCustomElementTaroSwiperItemCore,
} from '@tarojs/components/dist/components'
import { eventCenter } from '@tarojs/runtime'
import { isFunction } from '@tarojs/shared'
import Taro from '@tarojs/taro'
import { showActionSheet, showToast } from '@tarojs/taro-h5'

import { downloadFile } from '../../network/download'
import { shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'
import { saveImageToPhotosAlbum } from './saveImageToPhotosAlbum'

/**
 * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
 *
 * @canUse previewImage
 * @__object [urls, current, showmenu]
 */
export const previewImage: typeof Taro.previewImage = async (options) => {
  // TODO 改为通过 window.__taroAppConfig 获取配置的 Swiper 插件创建节点
  defineCustomElementTaroSwiperCore()
  defineCustomElementTaroSwiperItemCore()
  const PRESS_TIME = 1000
  const SHOW_TIME = 2000
  const SAVE_IMAGE_BUTTON = 1

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `previewImage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { urls = [], current = '', success, fail, complete, showmenu } = options
  const handle = new MethodHandler({ name: 'previewImage', success, fail, complete })
  const container = document.createElement('div')
  const removeHandler = () => {
    eventCenter.off('__taroRouterChange', removeHandler)
    container.remove()
  }
  // 路由改变后应该关闭预览框
  eventCenter.on('__taroRouterChange', removeHandler)

  container.classList.add('preview-image')
  container.style.cssText =
    'position:fixed;top:0;left:0;z-index:999;width:100%;height:100%;overflow:hidden;outline:0;background-color:#111;'
  container.addEventListener('click', removeHandler)

  const swiper: HTMLElement & Omit<SwiperProps, 'style' | 'children'> = document.createElement('taro-swiper-core')
  // @ts-ignore
  swiper.full = true
  // @ts-ignore
  swiper.zoom = true

  let children: Node[] = []

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
      div.style.zIndex = '900'

      let pressTimer
      function startPress () {
        pressTimer = setTimeout(async function () {
          if (!showmenu) {
            return
          }
          try {
            const { tapIndex } = await showActionSheet({
              itemList: ['转发给朋友', '保存图片', '收藏', '翻译图片中的文字', '提取文字'],
            })
            if (tapIndex !== SAVE_IMAGE_BUTTON) {
              return
            }
            downloadFile({
              url: url, // 仅为示例，并非真实的资源
              success: function (res: any) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (res: any) {
                    showToast({
                      title: '保存成功',
                      icon: 'success',
                      duration: SHOW_TIME
                    })
                    handle.success(res)
                  },
                  fail: function (err: any) {
                    handle.fail(err)
                  }
                })
              },
              fail: function (err: any) {
                handle.fail(err)
              }
            })
          } catch (e) {
            return handle.fail({
              errMsg: e.errMsg?.replace('^.*:fail ', '')
            })
          }
        }, PRESS_TIME) // 这里的1000表示长按的时间，以毫秒为单位，您可以根据需要调整
      }

      function cancelPress () {
        clearTimeout(pressTimer)
      }

      // 添加触摸事件监听器
      div.addEventListener('touchstart', startPress)
      div.addEventListener('touchend', cancelPress)
      div.addEventListener('touchmove', cancelPress)

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

  try {
    children = await Promise.all(urls.map((e) => loadImage(e, fail)))
  } catch (error) {
    return handle.fail({
      errMsg: error,
    })
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    swiper.appendChild(child)
  }

  const currentIndex = typeof current === 'number' ? current : urls.indexOf(current)

  swiper.current = currentIndex

  container.appendChild(swiper)
  document.body.appendChild(container)

  return handle.success()
}
