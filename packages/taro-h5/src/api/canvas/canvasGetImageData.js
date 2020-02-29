import { findDOMNode } from 'nervjs'

import { findRef } from '../utils'

/**
 * @typedef {Object} Param
 * @property {String} canvasId 画布标识，传入 <canvas> 组件的 canvas-id 属性。
 * @property {Number} x 将要被提取的图像数据矩形区域的左上角横坐标
 * @property {Number} y 将要被提取的图像数据矩形区域的左上角纵坐标
 * @property {Number} width 将要被提取的图像数据矩形区域的宽度
 * @property {Number} height 将要被提取的图像数据矩形区域的高度
 * @property {Function} [success] 接口调用成功的回调函数
 * @property {Function} [fail] 接口调用失败的回调函数
 * @property {Function} [complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */

/**
 * 获取 canvas 区域隐含的像素数据。
 * @param {Param} object 参数
 * @param {Object} componentInstance 在自定义组件下，当前组件实例的this，以操作组件内 <canvas> 组件
 */
const canvasGetImageData = ({ canvasId, success, fail, complete, x, y, width, height }, componentInstance) => {
  const refId = `__taroref_${canvasId}`
  const component = findRef(refId, componentInstance)
  const canvasDom = findDOMNode(component)

  try {
    /** @type {HTMLCanvasElement} */
    const canvas = canvasDom.querySelector(`[canvasId=${canvasId}]`)

    const ctx = canvas.getContext('2d')
    const data = ctx.getImageData(x, y, width, height)
    const res = {
      width,
      height,
      data
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

export default canvasGetImageData
