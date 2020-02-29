import { findDOMNode } from 'nervjs'

import { findRef } from '../utils'

/**
 * @typedef {Object} Param
 * @property {Number} [x] 指定的画布区域的左上角横坐标，默认值 0
 * @property {Number} [y] 指定的画布区域的左上角纵坐标，默认值 0
 * @property {Number} [width] 指定的画布区域的宽度，默认值 canvas宽度-x
 * @property {Number} [height] 指定的画布区域的高度，默认值 canvas宽度-y
 * @property {Number} [destWidth] 输出的图片的宽度，默认值 width*屏幕像素密度
 * @property {Number} [destHeight] 输出的图片的高度，默认值 height*屏幕像素密度
 * @property {String} canvasId 画布标识，传入 <canvas> 组件的 canvas-id
 * @property {String} [fileType] 目标文件的类型，默认值 png
 * @property {Number} quality 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
 * @property {Function} [success] 接口调用成功的回调函数
 * @property {Function} [fail] 接口调用失败的回调函数
 * @property {Function} [complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */

/**
 * 把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。
 * @param {Param} object 参数
 * @param {Object} componentInstance 在自定义组件下，当前组件实例的this，以操作组件内 <canvas> 组件
 * @todo 暂未支持尺寸相关功能
 */
const canvasToTempFilePath = ({ canvasId, fileType, quality, success, fail, complete }, componentInstance) => {
  const refId = `__taroref_${canvasId}`
  const component = findRef(refId, componentInstance)
  const canvasDom = findDOMNode(component)

  try {
    /** @type {HTMLCanvasElement} */
    const canvas = canvasDom.querySelector(`[canvasId=${canvasId}]`)

    // /** @type {CanvasRenderingContext2D} */
    const dataURL = canvas.toDataURL(`image/${fileType || 'png'}`, quality)
    const res = {
      tempFilePath: dataURL,
      res: 'canvasToTempFilePath:ok'
    }

    success && success(res)
    complete && complete()
    return Promise.resolve(res)
  } catch (e) {
    const res = {
      errMsg: e.message
    }
    fail && fail(res)
    complete && complete()
    return Promise.reject(res)
  }
}

export default canvasToTempFilePath
