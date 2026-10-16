import Taro from '@tarojs/api'

import { findDOM } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/**
 * 获取 canvas 区域隐含的像素数据。
 */
export const canvasGetImageData: typeof Taro.canvasGetImageData = ({ canvasId, success, fail, complete, x, y, width, height }, inst) => {
  const handle = new MethodHandler({ name: 'canvasGetImageData', success, fail, complete })

  try {
    const el = findDOM(inst) as HTMLElement
    const canvas = el?.querySelector(`canvas[canvas-id="${canvasId}"]`) as HTMLCanvasElement
    const ctx = canvas?.getContext('2d')
    if (!ctx) throw new Error(`canvas ${canvasId} is not available`)

    const imageData = ctx.getImageData(x, y, width, height)
    return handle.success({
      width: imageData.width,
      height: imageData.height,
      data: imageData.data
    })
  } catch (e) {
    return handle.fail({
      errMsg: e.message
    })
  }
}
