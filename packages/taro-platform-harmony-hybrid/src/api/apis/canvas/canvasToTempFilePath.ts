import Taro from '@tarojs/api'

import { findDOM, shouldBeObject } from '../utils'
import { MethodHandler } from '../utils/handler'

/**
 * 把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。
 */
const QUALITY = 1.0 // 图片质量，为1.0时和原图片质量一致
const DX = 0 // imageResource的左上角在目标 canvas 上 x 轴的位置
const DY = 0 // imageResource的左上角在目标 canvas 上 y 轴的位置

/**
 * 把当前画布指定区域的内容导出生成指定大小的图片
 *
 * @canUse canvasToTempFilePath
 * @__object [canvas, canvasId, quality, destHeight, destWidth, fileType[jpg, png], height, width, x, y]
 * @__success [tempFilePath]
 */
export const canvasToTempFilePath: typeof Taro.canvasToTempFilePath = (options, inst) => {
  const name = 'canvasToTempFilePath'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    canvas,
    canvasId,
    quality = QUALITY,
    destHeight = 0,
    destWidth = 0,
    fileType = 'png',
    height = 0,
    width = 0,
    x = 0,
    y = 0,
    success,
    fail,
    complete,
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail, complete })

  let inCanvas: HTMLCanvasElement | HTMLImageElement

  // 创建一个新的canvas元素用于绘制导出的图片
  const outCanvas = document.createElement('canvas')
  const ctx = outCanvas.getContext('2d') as CanvasRenderingContext2D
  if (!ctx) {
    const res = { errMsg: `${name}:fail, Can't get 2D rendering context` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  outCanvas.width = destWidth
  outCanvas.height = destHeight

  // 设置背景为白色
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, outCanvas.width, outCanvas.height)

  return new Promise((resolve, reject) => {
    if (canvas) {
      // 如果传入了Canvas实例，则直接使用
      const imgData = canvas.toDataURL('png', QUALITY)
      inCanvas = new Image()
      inCanvas.src = imgData
      // 如果inCanvas是Image元素，需要等待图像加载完成后再绘制
      inCanvas.onload = () => {
        ctx.drawImage(inCanvas, x, y, width, height, DX, DY, destWidth, destHeight)
        const dataURL = outCanvas.toDataURL(`image/${(fileType === 'jpg' ? 'jpeg' : fileType) || 'png'}`, quality)
        handle.success({
          tempFilePath: dataURL,
        }, { resolve, reject })
      }
      inCanvas.onerror = () => {
        const res = { errMsg: `${name}:fail Image failed to load` }
        console.error(res.errMsg)
        handle.fail(res, { resolve, reject })
      }
    } else if (canvasId) {
      // 否则通过canvasId获取canvas元素
      const el = findDOM(inst) as HTMLElement
      inCanvas = el?.querySelector(`canvas[canvas-id="${canvasId}"]`) as HTMLCanvasElement
      if (!inCanvas) {
        const res = { errMsg: `${name}:fail, Can't find canvas with id ${canvasId}` }
        console.error(res.errMsg)
        return Promise.reject(res)
      } else {
        ctx.drawImage(inCanvas, x, y, width, height, DX, DY, destWidth, destHeight)
        const dataURL = outCanvas.toDataURL(`image/${(fileType === 'jpg' ? 'jpeg' : fileType) || 'png'}`, quality)
        handle.success({
          tempFilePath: dataURL,
        }, { resolve, reject })
      }
    } else {
      const res = { errMsg: `${name}:fail, canvasId or canvas is required` }
      console.error(res.errMsg)
      return Promise.reject(res)
    }
  })
}
