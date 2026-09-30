import Taro from '@tarojs/api'

import { findDOM } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/**
 * 将像素数据绘制到画布。在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 <canvas> 组件。
 */
export const canvasPutImageData: typeof Taro.canvasPutImageData = ({ canvasId, data, x, y, width, height, success, fail, complete }, inst) => {
  const handle = new MethodHandler({ name: 'canvasPutImageData', success, fail, complete })

  try {
    const el = findDOM(inst) as HTMLElement
    const canvas = el?.querySelector(`canvas[canvas-id="${canvasId}"]`) as HTMLCanvasElement
    const ctx = canvas?.getContext('2d')
    if (!ctx) throw new Error(`canvas ${canvasId} is not available`)
    if (data.length !== width * height * 4) throw new Error('pixel data length does not match width and height')

    const imageData = ctx.createImageData(width, height)
    imageData.data.set(data)
    ctx.putImageData(imageData, x, y)
    return handle.success()
  } catch (e) {
    return handle.fail({
      errMsg: e.message
    })
  }
}
