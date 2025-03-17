import { document } from '@tarojs/runtime'

import { MethodHandler, temporarilyNotSupport } from '../utils'

// @ts-ignore
import type { TaroCanvasElement } from '@tarojs/runtime'
import type Taro from '@tarojs/taro/types'
// 画布

/** 创建离屏 canvas 实例 */
export const createOffscreenCanvas = /* @__PURE__ */ temporarilyNotSupport('createOffscreenCanvas')

/** 创建 canvas 的绘图上下文 CanvasContext 对象 */
export const createCanvasContext = (canvasId: string) => {
  // FIXME 直接根据 canvasId 获取 canvas 实例
  const canvas = document.querySelector(`canvas[canvasId=${canvasId}]`) as TaroCanvasElement
  if (canvas) {
    return canvas.getContext('2d')
  } else {
    console.error(`createCanvasContext: canvasId ${canvasId} not found`)
  }
}

/** 把当前画布指定区域的内容导出生成指定大小的图片 */
export const canvasToTempFilePath = (
  { canvasId, fileType, quality, success, fail, complete, x, y, width, height, destWidth, destHeight }: Taro.canvasToTempFilePath.Option,
  component?: TaroGeneral.IAnyObject
): Promise<Taro.canvasToTempFilePath.SuccessCallbackResult> => {
  const handle = new MethodHandler<Taro.canvasToTempFilePath.SuccessCallbackResult>({ name: 'canvasToTempFilePath', success, fail, complete })
  const canvas = component || document.querySelector(`canvas[canvasId=${canvasId}]`) as TaroCanvasElement
  if (canvas) {
    try {
      const dataURL = canvas?.exportDataUrl({
        fileType: 'image/' + (fileType === 'jpg' ? 'jpeg' : fileType) || 'png',
        quality,
        x,
        y,
        width,
        height,
        destWidth,
        destHeight
      })
      return handle.success({
        tempFilePath: dataURL
      })
    } catch (e) {
      return handle.fail({
        errMsg: e.message
      })
    }
  }
  return handle.fail({
    errMsg: `canvasToTempFilePath: canvasId ${canvasId} not found`
  })
}

/** 将像素数据绘制到画布 */
export const canvasPutImageData = /* @__PURE__ */ temporarilyNotSupport('createOffscreenCanvas')

/** 获取 canvas 区域隐含的像素数据 */
export const canvasGetImageData = /* @__PURE__ */ temporarilyNotSupport('createOffscreenCanvas')
