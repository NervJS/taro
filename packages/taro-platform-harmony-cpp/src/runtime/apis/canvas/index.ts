import { eventSource } from '@tarojs/runtime'

import { temporarilyNotSupport } from '../utils'

// @ts-ignore
import type { TaroCanvasElement } from '@tarojs/runtime'
// 画布

/** 创建离屏 canvas 实例 */
export const createOffscreenCanvas = /* @__PURE__ */ temporarilyNotSupport('createOffscreenCanvas')

/** 创建 canvas 的绘图上下文 CanvasContext 对象 */
// export const createCanvasContext = /* @__PURE__ */ temporarilyNotSupport('createOffscreenCanvas')
export const createCanvasContext = (canvasId: string) => {
  const dom = eventSource.get(`canvasId-${canvasId}`)
  // return dom as TaroCanvasElement
  if (dom) return (dom as unknown as TaroCanvasElement).context
}

/** 把当前画布指定区域的内容导出生成指定大小的图片 */
export const canvasToTempFilePath = /* @__PURE__ */ temporarilyNotSupport('createOffscreenCanvas')

/** 将像素数据绘制到画布 */
export const canvasPutImageData = /* @__PURE__ */ temporarilyNotSupport('createOffscreenCanvas')

/** 获取 canvas 区域隐含的像素数据 */
export const canvasGetImageData = /* @__PURE__ */ temporarilyNotSupport('createOffscreenCanvas')
