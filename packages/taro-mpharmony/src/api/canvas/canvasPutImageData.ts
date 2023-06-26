import Taro from '@tarojs/api'

import { findDOM } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/**
 * 将像素数据绘制到画布。在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 <canvas> 组件
 * @todo 暂未支持尺寸相关功能
 */
export const canvasPutImageData: typeof Taro.canvasPutImageData = ({ canvasId, data, x, y, success, fail, complete }, inst) => {
  const handle = new MethodHandler({ name: 'canvasPutImageData', success, fail, complete })
  const el = findDOM(inst) as HTMLElement
  const canvas = el?.querySelector(`canvas[canvas-id="${canvasId}"]`) as HTMLCanvasElement

  try {
    const ctx = canvas.getContext('2d')
    // TODO Uint8ClampedArray => ImageData
    ctx?.putImageData(data as unknown as ImageData, x, y)
    return handle.success()
  } catch (e) {
    return handle.fail({
      errMsg: e.message
    })
  }
}
