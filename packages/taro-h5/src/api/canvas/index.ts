import { temporarilyNotSupport } from '../../utils'

// 画布

/** 创建离屏 canvas 实例 */
export const createOffscreenCanvas = /* @__PURE__ */ temporarilyNotSupport('createOffscreenCanvas')

/** 创建 canvas 的绘图上下文 CanvasContext 对象 */
export * from './createCanvasContext'

/** 把当前画布指定区域的内容导出生成指定大小的图片 */
export * from './canvasToTempFilePath'

/** 将像素数据绘制到画布 */
export * from './canvasPutImageData'

/** 获取 canvas 区域隐含的像素数据 */
export * from './canvasGetImageData'
