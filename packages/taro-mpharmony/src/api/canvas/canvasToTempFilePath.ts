import Taro from '@tarojs/api'

import { findDOM, shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'

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
    quality = 1.0,
    destHeight = 0,
    destWidth = 0,
    fileType = 'png',
    height = 0,
    width = 0,
    x = 0,
    y = 0,
    success, 
    fail, 
    complete 
  } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name, success, fail, complete })

  const el = findDOM(inst) as HTMLElement
  // 如果传入了Canvas实例，则直接使用，未传入canvas实例则通过canvasId获取
  const imgData = canvas?.toDataURL('png', QUALITY)
  const img = new Image()
  img.src = imgData ?? ''
  const inCanvas = imgData ? img : (el?.querySelector(`canvas[canvas-id="${canvasId}"]`) as HTMLCanvasElement)
  // 创建一个新的canvas元素
  const outCanvas = document.createElement('canvas')
  const ctx = outCanvas.getContext('2d') as CanvasRenderingContext2D
  outCanvas.width = destWidth
  outCanvas.height = destHeight
  // 设置背景为白色
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, outCanvas.width, outCanvas.height)
  ctx.drawImage(inCanvas, x, y, width, height, DX, DY, destWidth, destHeight)

  try {
    const dataURL = outCanvas?.toDataURL(`image/${(fileType === 'jpg' ? 'jpeg' : fileType) || 'png'}`, quality)
    return handle.success({
      tempFilePath: dataURL,
    })
  } catch (e) {
    return handle.fail({
      errMsg: e.message,
    })
  }
}
