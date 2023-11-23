/**
 * 创建离屏 canvas 实例
 * 
 * @canNotUse createOffscreenCanvas
 */
export { createOffscreenCanvas } from '@tarojs/taro-h5'

/** 创建 canvas 的绘图上下文 CanvasContext 对象 */
export * from './createCanvasContext'

/** 把当前画布指定区域的内容导出生成指定大小的图片 */
export * from './canvasToTempFilePath'

/** 将像素数据绘制到画布 */
export * from './canvasPutImageData'

/** 获取 canvas 区域隐含的像素数据 */
export * from './canvasGetImageData'

/**
 * CanvasGradient对象
 * 
 * @canUse CanvasGradient
 * @__class [addColorStop]
 */

/**
 * Color实例
 * 
 * @canNotUse Color
 */

/** 
 * Image实例
 * 
 * @canUse Image
 * @__class [src, height, width, referrerPolicy, onerror, onload]
 */

/**
 * ImageData对象
 * 
 * @canUse ImageData
 * @__class [width, height, data]
 */

/**
 * 离屏 canvas 实例，可通过 Taro.createOffscreenCanvas 创建
 * 
 * @canNotUse OffscreenCanvas
 */

/**
 * Path2D
 * 
 * @canUse Path2D
 */

/**
 * RenderingContext
 * 
 * @canUse RenderingContext
 */

/**
 * Canvas 实例
 * 
 * @canUse Canvas
 * @__class [cancelAnimationFrame, createImageData, createImage, createPath2D, getContext, requestAnimationFrame, toDataURL]
 */