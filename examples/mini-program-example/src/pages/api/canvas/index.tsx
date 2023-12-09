import React from 'react'
import Taro from '@tarojs/taro'
import { View, Canvas, Image } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'
import { hooks } from '@tarojs/runtime'
import canvasPng from '@/assets/api/canvas.png'

/**
 * 画布
 * @returns
 */
let context
export default class Index extends React.Component {
  state = {
    canvasId: 'canvas',
    src: '',
    list: [
      {
        id: 'createCanvasContext',
        func: (apiIndex) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setStrokeStyle('#00ff00')
            context.setLineWidth(5)
            context.rect(0, 0, 200, 200)
            context.stroke()
            context.beginPath()
            context.setStrokeStyle('#ff0000')
            context.setLineWidth(2)
            context.moveTo(160, 100)
            context.arc(100, 100, 60, 0, 2 * Math.PI, true)
            context.moveTo(140, 100)
            context.arc(100, 100, 40, 0, Math.PI, false)
            context.moveTo(85, 80)
            context.arc(80, 80, 5, 0, 2 * Math.PI, true)
            context.moveTo(125, 80)
            context.arc(120, 80, 5, 0, 2 * Math.PI, true)
            context.stroke()
            await context.draw()
            TestConsole.consoleResult.call(this, context, apiIndex)
          })
        },
      },
      {
        id: 'canvasToTempFilePath',
        inputData: {
          canvas: false,
          canvasId: true,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          destWidth: 200,
          destHeight: 200,
          quality: 1,
          fileType: 'png',
        },
        func: (apiIndex, data) => {
          let _this = this
          const { canvas, canvasId, ...mydata } = data
          let args = { ...mydata }
          TestConsole.consoleTest('canvasToTempFilePath')
          if (canvas) {
            const el = hooks.call('getDOMNode', _this)
            const mycanvas = el.querySelector(`canvas[canvas-id="${_this.state.canvasId}"]`) as Taro.Canvas
            Object.assign(args, { canvas: mycanvas })
          }
          if (canvasId) {
            Object.assign(args, { canvasId: _this.state.canvasId })
          }
          TestConsole.consoleDebug('args:', args)
          Taro.canvasToTempFilePath(
            {
              ...args,
              success: (res) => {
                _this.setState({
                  src: res.tempFilePath,
                })
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            },
            _this
          ).then((res) => {
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'CanvasContext-attribute',
        inputData: {
          shadowOffsetX: 10,
          shadowOffsetY: 10,
          shadowBlur: 20,
          shadowColor: 'black',
          fillStyle: 'red',
          globalAlpha: 1,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.shadowOffsetX = data.shadowOffsetX
            context.shadowOffsetY = data.shadowOffsetY
            context.shadowBlur = data.shadowBlur
            context.shadowColor = data.shadowColor
            context.fillStyle = data.fillStyle
            context.globalAlpha = data.globalAlpha
            context.fillRect(20, 20, 100, 80)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-attribute', context)
          })
        },
      },
      {
        id: 'CanvasContext-attribute1',
        inputData: {
          lineCap: 'round',
          lineJoin: 'round',
          lineWidth: 10,
          miterLimit: 5,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.lineCap = data.lineCap
            context.lineJoin = data.lineJoin
            context.lineWidth = data.lineWidth
            context.miterLimit = data.miterLimit
            context.moveTo(20, 20)
            context.lineTo(100, 50)
            context.lineTo(20, 100)
            context.stroke()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-attribute1', context)
          })
        },
      },
      {
        id: 'CanvasContext-arc',
        inputData: {
          x: 100,
          y: 75,
          r: 50,
          sAngle: 0,
          eAngle: 2 * Math.PI,
          counterclockwise: false,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setStrokeStyle('#000000')
            context.setLineWidth(1)
            context.arc(...Object.values(data))
            context.stroke()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-arc success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-arcTo',
        inputData: {
          x1: 150,
          y1: 20,
          x2: 150,
          y2: 70,
          radius: 50,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setStrokeStyle('#000000')
            context.setLineWidth(1)
            context.moveTo(20, 20)
            context.lineTo(100, 20)
            context.arcTo(...Object.values(data))
            context.lineTo(150, 120)
            context.stroke()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-arcTo success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-bezierCurveTo',
        inputData: {
          cp1x: 20,
          cp1y: 100,
          cp2x: 200,
          cp2y: 100,
          x: 200,
          y: 20,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setStrokeStyle('#000000')
            context.setLineWidth(1)
            context.moveTo(20, 20)
            context.bezierCurveTo(...Object.values(data))
            context.closePath()
            context.stroke()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-bezierCurveTo success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-clearRect',
        inputData: {
          x: 0,
          y: 0,
          width: 305,
          height: 305,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.fillStyle = '#ffffff'
            context.clearRect(...Object.values(data))
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-clearRect success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-clip',
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.rect(50, 20, 200, 120)
            context.stroke()
            context.clip()
            context.fillStyle = 'red'
            context.fillRect(0, 0, 150, 100)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-clip success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-restore/save',
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.arc(100, 100, 50, 0, 2 * Math.PI)
            context.stroke()
            context.save()
            context.restore()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-restore/save success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-createCircularGradient',
        inputData: {
          x: 75,
          y: 50,
          r: 50,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            const grd = context.createCircularGradient(...Object.values(data))
            grd.addColorStop(0, 'red')
            grd.addColorStop(1, 'white')
            context.beginPath()
            context.setFillStyle(grd)
            context.fillRect(10, 10, 150, 80)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-createCircularGradient success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-createLinearGradient',
        inputData: {
          x0: 0,
          y0: 0,
          x1: 200,
          y1: 0,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            const grd = context.createLinearGradient(...Object.values(data))
            grd.addColorStop(0, 'red')
            grd.addColorStop(1, 'white')
            context.beginPath()
            context.setFillStyle(grd)
            context.fillRect(10, 10, 150, 80)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-createLinearGradient success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-createPattern',
        inputData: {
          image: canvasPng,
          repetition: 'repeat',
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            const pattern = await context.createPattern(...Object.values(data))
            context.fillStyle = pattern
            context.fillRect(0, 0, 300, 150)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-createPattern success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-drawImage',
        inputData: {
          sx: 0,
          sy: 0,
          sWidth: 150,
          sHeight: 100,
          dx: 0,
          dy: 0,
          dWidth: 150,
          dHeight: 100,
        },
        func: async (apiIndex, data) => {
          Taro.chooseImage({
            success: (res) => {
              Taro.getImageInfo({
                src: res.tempFilePaths[0],
                success: (res) => {
                  this.initCanvas(apiIndex, async () => {
                    context.beginPath()
                    context.drawImage(res.path, ...Object.values(data))
                    await context.draw()
                    TestConsole.consoleNormal('CanvasContext-drawImage success ', context)
                  })
                },
                fail: (res) => {
                  TestConsole.consoleNormal('getImageInfo fail', res)
                },
                complete: (res) => {
                  TestConsole.consoleNormal('getImageInfo complete', res)
                },
              })
            },
            fail: (err) => {
              TestConsole.consoleNormal('chooseImage fail:', err)
            },
            complete: (com) => {
              TestConsole.consoleNormal('chooseImage complete', com)
            },
          })
          /**
           * 通过downloadFile形式获取的路径的方式样例
           * Taro.downloadFile({
           *   url: 'http://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg',
           *   success: (res) => {
           *     TestConsole.consoleNormal('downloadFile path:', res.tempFilePath)
           *     this.initCanvas(apiIndex, async () => {
           *       context.beginPath()
           *       context.drawImage(
           *         res.tempFilePath,
           *         ...Object.values(data)
           *       )
           *       await context.draw()
           *       TestConsole.consoleNormal('CanvasContext-drawImage success ', context)
           *     })
           *   }
           * })
           *
           * 直接传入网络路径的方式样例
           * this.initCanvas(apiIndex, async () => {
           *   context.beginPath()
           *   context.drawImage(
           *     'http://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg',
           *     imageResource,
           *     ...Object.values(data)
           *   )
           *   await context.draw()
           *   TestConsole.consoleNormal('CanvasContext-drawImage success ', context)
           * })
           */
        },
      },
      {
        id: 'CanvasContext-fill',
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            // 场景1
            context.beginPath()
            context.rect(20, 20, 150, 100)
            context.fillStyle = 'red'
            context.fill()
            // 场景2
            context.beginPath()
            context.rect(20, 130, 100, 30)
            context.setFillStyle('blue')
            context.fillRect(20, 160, 100, 30)
            context.rect(20, 190, 100, 30)
            context.setFillStyle('red')
            context.fill()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-fill success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-fillText',
        inputData: {
          text: 'Hello word',
          x: 10,
          y: 50,
          maxWidth: 500,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setFillStyle('#000000')
            context.font = '50px Georgia'
            context.fillText(...Object.values(data))
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-fillText success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-measureText',
        inputData: {
          text: 'hello word',
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setFillStyle('#000000')
            context.font = '30px Georgia'
            context.fillText(...Object.values(data), 10, 50, 200)
            await context.draw()
            const metrics = context.measureText(...Object.values(data))
            TestConsole.consoleNormal('CanvasContext-measureText', metrics)
          })
        },
      },
      {
        id: 'CanvasContext-quadraticCurveTo',
        inputData: {
          cpx: 20,
          cpy: 100,
          x: 200,
          y: 20,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setStrokeStyle('#000000')
            context.moveTo(20, 20)
            context.quadraticCurveTo(...Object.values(data))
            context.stroke()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-quadraticCurveTo success ', context)
          })
        },
      },

      {
        id: 'CanvasContext-rotate',
        inputData: {
          rotate: (20 * Math.PI) / 180,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.rotate(...Object.values(data))
            context.fillRect(50, 20, 100, 50)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-rotate success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-scale',
        inputData: {
          scaleWidth: 2,
          scaleHeight: 2,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.strokeRect(10, 10, 25, 15)
            context.scale(...Object.values(data))
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-scale success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setFillStyle',
        inputData: {
          color: 'red',
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setFillStyle(...Object.values(data))
            context.fillRect(10, 10, 150, 75)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-setFillStyle success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setFontSize',
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setFillStyle('#000000')
            context.setFontSize(20)
            context.fillText('20', 20, 20)
            context.setFontSize(30)
            context.fillText('30', 40, 40)
            context.setFontSize(40)
            context.fillText('40', 60, 60)
            context.setFontSize(50)
            context.fillText('50', 90, 90)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-setFontSize success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setGlobalAlpha',
        inputData: {
          alpha: 0.2,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setGlobalAlpha(...Object.values(data))
            context.fillRect(10, 10, 150, 100)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-setGlobalAlpha success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setLineCap',
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.moveTo(10, 10)
            context.lineTo(150, 10)
            context.stroke()
            context.beginPath()
            context.setLineCap('butt')
            context.setLineWidth(10)
            context.moveTo(10, 30)
            context.lineTo(150, 30)
            context.stroke()
            context.beginPath()
            context.setLineCap('round')
            context.setLineWidth(10)
            context.moveTo(10, 50)
            context.lineTo(150, 50)
            context.stroke()
            context.beginPath()
            context.setLineCap('square')
            context.setLineWidth(10)
            context.moveTo(10, 70)
            context.lineTo(150, 70)
            context.stroke()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-setLineCap success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setLineDash',
        inputData: {
          pattern: [10, 20],
          offset: 5,
          lineDashOffset: 0,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.setLineDash(...Object.values(data))
            if (data.lineDashOffset) {
              context.lineDashOffset = data.lineDashOffset
            }
            context.beginPath()
            context.moveTo(0, 100)
            context.lineTo(400, 100)
            context.stroke()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-setLineDash success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setLineJoin',
        inputData: {
          lineJoin: 'bevel',
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.moveTo(10, 10)
            context.lineTo(100, 50)
            context.lineTo(10, 90)
            context.stroke()
            context.beginPath()
            context.setLineJoin('bevel')
            context.setLineWidth(10)
            context.moveTo(50, 10)
            context.lineTo(140, 50)
            context.lineTo(50, 90)
            context.stroke()
            context.beginPath()
            context.setLineJoin('round')
            context.setLineWidth(10)
            context.moveTo(90, 10)
            context.lineTo(180, 50)
            context.lineTo(90, 90)
            context.stroke()
            context.beginPath()
            context.setLineJoin('miter')
            context.setLineWidth(10)
            context.moveTo(130, 10)
            context.lineTo(220, 50)
            context.lineTo(130, 90)
            context.stroke()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-setLineJoin success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setMiterLimit',
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setLineWidth(10)
            context.setLineJoin('miter')
            context.setMiterLimit(1)
            context.moveTo(10, 10)
            context.lineTo(100, 50)
            context.lineTo(10, 90)
            context.stroke()
            context.beginPath()
            context.setLineWidth(10)
            context.setLineJoin('miter')
            context.setMiterLimit(2)
            context.moveTo(50, 10)
            context.lineTo(140, 50)
            context.lineTo(50, 90)
            context.stroke()
            context.beginPath()
            context.setLineWidth(10)
            context.setLineJoin('miter')
            context.setMiterLimit(3)
            context.moveTo(90, 10)
            context.lineTo(180, 50)
            context.lineTo(90, 90)
            context.stroke()
            context.beginPath()
            context.setLineWidth(10)
            context.setLineJoin('miter')
            context.setMiterLimit(4)
            context.moveTo(130, 10)
            context.lineTo(220, 50)
            context.lineTo(130, 90)
            context.stroke()
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-setMiterLimit success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setShadow',
        inputData: {
          offsetX: 10,
          offsetY: 50,
          blur: 50,
          color: 'blue',
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setFillStyle('red')
            context.setShadow(...Object.values(data))
            context.fillRect(10, 10, 150, 75)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-setShadow success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setTextAlign',
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setStrokeStyle('red')
            context.moveTo(150, 20)
            context.lineTo(150, 170)
            context.stroke()
            context.beginPath()
            context.setFontSize(15)
            context.setTextAlign('left')
            context.fillText('textAlign=left', 150, 60)
            context.setTextAlign('center')
            context.fillText('textAlign=center', 150, 80)
            context.setTextAlign('right')
            context.fillText('textAlign=right', 150, 100)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-setTextAlign success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setTextBaseline',
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.setStrokeStyle('red')
            context.moveTo(5, 75)
            context.lineTo(295, 75)
            context.stroke()
            context.beginPath()
            context.setFontSize(20)
            context.setTextBaseline('top')
            context.fillText('top', 5, 75)
            context.setTextBaseline('middle')
            context.fillText('middle', 50, 75)
            context.setTextBaseline('bottom')
            context.fillText('bottom', 120, 75)
            context.setTextBaseline('normal')
            context.fillText('normal', 200, 75)
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-setTextBaseline success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-setTransform',
        inputData: {
          scaleX: 1,
          scaleY: 0.5,
          skewX: -0.5,
          skewY: 1,
          translateX: 10,
          translateY: 10,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.fillRect(10, 10, 100, 50)
            await context.draw(false)
            context.setTransform(...Object.values(data))
            context.fillRect(10, 10, 100, 50)
            await context.draw(false)
            TestConsole.consoleNormal('CanvasContext-setTransform success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-strokeText',
        inputData: {
          text: 'hello word',
          x: 10,
          y: 50,
          maxWidth: 500,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.beginPath()
            context.font = '20px Georgia'
            context.strokeText(...Object.values(data))
            await context.draw()
            TestConsole.consoleNormal('CanvasContext-strokeText success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-transform',
        inputData: {
          scaleX: 1,
          scaleY: 0.5,
          skewX: -0.5,
          skewY: 1,
          translateX: 20,
          translateY: 10,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.fillRect(10, 10, 100, 50)
            await context.draw(false)
            context.transform(...Object.values(data))
            context.fillRect(10, 10, 100, 50)
            await context.draw(false)
            TestConsole.consoleNormal('CanvasContext-transform success ', context)
          })
        },
      },
      {
        id: 'CanvasContext-translate',
        inputData: {
          x: 20,
          y: 20,
        },
        func: (apiIndex, data) => {
          this.initCanvas(apiIndex, async () => {
            context.fillRect(10, 10, 100, 50)
            await context.draw(false)
            context.translate(...Object.values(data))
            context.fillRect(10, 10, 100, 50)
            await context.draw(false)
            TestConsole.consoleNormal('CanvasContext-translate success ', context)
          })
        },
      },
      {
        id: 'createOffscreenCanvas',
        func: null,
      },
      {
        id: 'canvasPutImageData',
        func: null,
      },
      {
        id: 'canvasGetImageData',
        func: null,
      },
      {
        id: 'Canvas',
        func: null,
      },
      {
        id: 'CanvasGradient',
        func: null,
      },
      {
        id: 'Color',
        func: null,
      },
      {
        id: 'Image',
        func: null,
      },
      {
        id: 'ImageData',
        func: null,
      },
      {
        id: 'OffscreenCanvas',
        func: null,
      },
      {
        id: 'Path2D',
        func: null,
      },
      {
        id: 'RenderingContext',
        func: null,
      },
    ],
  }
  initCanvas(apiIndex, callback) {
    if (Taro.getEnv() === 'WEAPP') {
      context = Taro.createCanvasContext('canvas')
      callback()
      return
    }
    this.setState({
      canvasId: 'canvas' + (apiIndex + 1),
    })
    Taro.nextTick(() => {
      TestConsole.consoleTest('createCanvasContext')
      context = Taro.createCanvasContext('canvas' + (apiIndex + 1))
      callback()
    })
  }
  render() {
    const { list, canvasId, src } = this.state
    return (
      <View>
        <View className='canvas-main' style={{ top: '79px' }}>
          <Canvas
            canvasId={canvasId}
            className='canvas'
            width='305px'
            height='280px'
            style='width: 305px; height: 280px;'
          ></Canvas>
        </View>
        <View style={{ height: '300px' }}></View>
        <View className={`${!src ? 'hide' : 'show'}`}>
          <View>Taro.canvasToTempFilePath图片 </View>
          <Image className='image-show' src={src}></Image>
        </View>

        <ButtonList buttonList={list} />
      </View>
    )
  }
}
