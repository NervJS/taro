import { findDOMNode } from 'nervjs'

import { findRef } from '../utils'

/**
 * @typedef {Object} Param
 * @property {String} canvasId 画布标识，传入 <canvas> 组件的 canvas-id 属性。
 * @property {Uint8ClampedArray} data 图像像素点数据，一维数组，每四项表示一个像素点的 rgba
 * @property {Number} x 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）
 * @property {Number} y 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）
 * @property {Number} width 源图像数据矩形区域的宽度
 * @property {Number} height 源图像数据矩形区域的高度
 * @property {Function} [success] 接口调用成功的回调函数
 * @property {Function} [fail] 接口调用失败的回调函数
 * @property {Function} [complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */

/**
 * 将像素数据绘制到画布。在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 <canvas> 组件
 * @param {Param} object 参数
 * @param {Object} componentInstance 在自定义组件下，当前组件实例的this，以操作组件内 <canvas> 组件
 * @todo 暂未支持尺寸相关功能
 */
const canvasPutImageData = ({ canvasId, data, x, y, success, fail, complete }, componentInstance) => {
  const refId = `__taroref_${canvasId}`
  const component = findRef(refId, componentInstance)
  const canvasDom = findDOMNode(component)

  try {
    /** @type {HTMLCanvasElement} */
    const canvas = canvasDom.querySelector(`[canvasId=${canvasId}]`)

    const ctx = canvas.getContext('2d')

    ctx.putImageData(data, x, y)
    const res = {
      errMsg: 'canvasPutImageData:ok'
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

export default canvasPutImageData
