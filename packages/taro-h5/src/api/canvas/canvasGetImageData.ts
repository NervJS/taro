import Taro from '@tarojs/api'
import { MethodHandler } from '../utils/handler'
import { findDOM } from '../utils'

/**
 * 获取 canvas 区域隐含的像素数据。
 */
export const canvasGetImageData: typeof Taro.canvasGetImageData = ({ canvasId, success, fail, complete, x, y, width, height }, inst) => {
  const handle = new MethodHandler({ name: 'canvasGetImageData', success, fail, complete })
  const el = findDOM(inst) as HTMLElement
  const canvas = el?.querySelector(`canvas[canvas-id="${canvasId}"]`) as HTMLCanvasElement

  try {
    const ctx = canvas?.getContext('2d')
    // TODO ImageData => Uint8ClampedArray
    const data = ctx?.getImageData(x, y, width, height) as unknown as Uint8ClampedArray
    return handle.success({
      width,
      height,
      data
    })
  } catch (e) {
    return handle.fail({
      errMsg: e.message
    })
  }
}
