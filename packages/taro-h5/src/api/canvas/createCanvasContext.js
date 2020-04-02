import { findDOMNode } from 'nervjs'

import { findRef } from '../utils'

/**
* 创建 canvas 的绘图上下文 CanvasContext 对象
* @param {string} canvasId 要获取上下文的 <canvas> 组件 canvas-id 属性
* @param {Object} componentInstance 在自定义组件下，当前组件实例的this，表示在这个自定义组件下查找拥有 canvas-id 的 <canvas> ，如果省略则不在任何自定义组件内查找
*/
const createCanvasContext = (canvasId, componentInstance) => {
  const refId = `__taroref_${canvasId}`
  const component = findRef(refId, componentInstance)
  const canvasDom = findDOMNode(component)

  /** @type {HTMLCanvasElement} */
  const canvas = canvasDom.querySelector(`[canvasId=${canvasId}]`)

  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext('2d')

  /**
   * @typedef {Object} Action
   * @property {Function} func
   * @property {any[]} args
   */

  /**
   * 操作队列
   * @type {Action[]}
   */
  const actions = []
  const enqueueActions = func => {
    return (...args) => {
      actions.push({
        func,
        args
      })
    }
  }
  const emptyActions = () => {
    actions.length = 0
  }

  /**
   * 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
   * @param {Boolean} [reserve=false] 本次绘制是否接着上一次绘制。
   * 即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；
   * 若 reserve 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面，
   * 默认 false。
   * @param {Function} [callback] 绘制完成后执行的回调函数
   * @todo 每次draw都会读取width和height
   */
  const draw = (reserve = false, callback) => {
    try {
      if (!reserve) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      actions.forEach(({func, args}) => {
        func.apply(ctx, args)
      })
      emptyActions()
      callback && callback()
      return Promise.resolve()
    } catch (e) {
      /* eslint-disable prefer-promise-reject-errors */
      return Promise.reject({
        errMsg: e.message
      })
    }
  }

  const customProperties = [
    /**
     * 设置填充色。
     * @param {String} color 填充的颜色，默认颜色为 black。
     */
    ['setFillStyle', (color) => {
      ctx.fillStyle = color
    }],
    /**
    * 设置字体的字号。
    * @param {Number} fontSize 字体的字号
    */
    ['setFontSize', (fontSize) => {
      ctx.font = fontSize
    }],
    /**
    * 设置全局画笔透明度。
    * @param {Number} alpha 透明度。范围 0-1，0 表示完全透明，1 表示完全不透明。
    */
    ['setGlobalAlpha', (alpha) => {
      ctx.globalAlpha = alpha
    }],
    /**
    * 设置虚线样式。
    * @param {Number[]} pattern 一组描述交替绘制线段和间距（坐标空间单位）长度的数字
    * @param {Number} offset 虚线偏移量
    */
    ['setLineDash', (pattern, offset) => {
      ctx.setLineDash(pattern)
      ctx.lineDashOffset = offset
    }],
    /**
    * 设置线条的端点样式ind
    * @param {String} lineCap 线条的结束端点样式
    */
    ['setLineCap', (lineCap) => {
      ctx.lineCap = lineCap
    }],
    /**
    * 设置线条的交点样式
    * @param {String} lineJoin 线条的结束交点样式
    */
    ['setLineJoin', (lineJoin) => {
      ctx.lineJoin = lineJoin
    }],
    /**
    * 设置线条的宽度
    * @param {number} lineWidth 线条的宽度，单位px
    */
    ['setLineWidth', (lineWidth) => {
      ctx.lineWidth = lineWidth
    }],
    /**
    * 设置最大斜接长度。斜接长度指的是在两条线交汇处内角和外角之间的距离。当 CanvasContext.setLineJoin() 为 miter 时才有效。超过最大倾斜长度的，连接处将以 lineJoin 为 bevel 来显示。
    * @param {number} miterLimit 最大斜接长度
    */
    ['setMiterLimit', (miterLimit) => {
      ctx.miterLimit = miterLimit
    }],
    /**
    * 设定阴影样式。
    * @param {number} offsetX 阴影相对于形状在水平方向的偏移，默认值为 0。
    * @param {number} offsetY 阴影相对于形状在竖直方向的偏移，默认值为 0。
    * @param {number} blur 阴影的模糊级别，数值越大越模糊。范围 0- 100。，默认值为 0。
    * @param {string} color 阴影的颜色。默认值为 black。
    */
    ['setShadow', (offsetX, offsetY, blur, color) => {
      ctx.shadowOffsetX = offsetX
      ctx.shadowOffsetY = offsetY
      ctx.shadowColor = blur
      ctx.shadowBlur = color
    }],
    /**
    * 设置描边颜色。
    * @param {String} color 描边的颜色，默认颜色为 black。
    */
    ['setStrokeStyle', (color) => {
      ctx.strokeStyle = color
    }],
    /**
    * 设置文字的对齐
    * @param {String} align 文字的对齐方式
    */
    ['setTextAlign', (align) => {
      ctx.textAlign = align
    }],
    /**
    * 设置文字的竖直对齐
    * @param {string} textBaseline 文字的竖直对齐方式
    */
    ['setTextBaseline', (textBaseline) => {
      ctx.textBaseline = textBaseline
    }]
  ]

  const functionProperties = [
    ['arc'],
    ['arcTo'],
    ['beginPath'],
    ['bezierCurveTo'],
    ['clearRect'],
    ['clip'],
    ['closePath'],
    ['createCircularGradient'],
    ['createLinearGradient'],
    ['createPattern'],
    ['drawImage'],
    ['fill'],
    ['fillRect'],
    ['fillText'],
    ['lineTo'],
    ['measureText', true],
    ['moveTo'],
    ['quadraticCurveTo'],
    ['rect'],
    ['restore'],
    ['rotate'],
    ['save'],
    ['scale'],
    ['setTransform'],
    ['stroke'],
    ['strokeRect'],
    ['strokeText'],
    ['transform'],
    ['translate']
  ]

  const valueProperties = [
    'fillStyle',
    'font',
    'globalAlpha',
    'lineCap',
    'lineDashOffset',
    'lineJoin',
    'lineWidth',
    'miterLimit',
    'shadowOffsetX',
    'shadowOffsetY',
    'shadowColor',
    'shadowBlur',
    'strokeStyle',
    'textAlign',
    'textBaseline',
    'direction',
    'globalCompositeOperation',
    'imageSmoothingEnabled ',
    'imageSmoothingQuality',
    'filter'
  ]

  const CanvasContext = {}

  customProperties.forEach(([funcName, func]) => {
    Object.defineProperty(CanvasContext, funcName, {
      get () {
        return enqueueActions(func)
      },
      enumerable: true
    })
  })

  functionProperties.forEach(([funcName, isSync]) => {
    Object.defineProperty(CanvasContext, funcName, {
      get: isSync
        ? () => ctx[funcName].bind(ctx)
        : () => enqueueActions(ctx[funcName]),
      enumerable: true
    })
  })

  valueProperties.forEach(propertyName => {
    Object.defineProperty(CanvasContext, propertyName, {
      get () {
        return ctx[propertyName]
      },
      set (value) {
        enqueueActions(() => {
          ctx[propertyName] = value
        })()
        return true
      }
    })
  })

  Object.defineProperty(CanvasContext, 'draw', {
    value: draw
  })

  return CanvasContext
}

export default createCanvasContext
