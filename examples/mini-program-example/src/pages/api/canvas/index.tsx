import React from 'react'
import Taro, { useReady } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 画布
 * @returns
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'createCanvasContext',
                func: () => {
                    useReady(() => {
                        const context = Taro.createCanvasContext('canvas')
                        context.setStrokeStyle("#00ff00")
                        context.setLineWidth(5)
                        context.rect(0, 0, 200, 200)
                        context.stroke()
                        context.setStrokeStyle("#ff0000")
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
                        context.draw()
                        console.log('createCanvasContext ', context)
                    })
                },
            },
            {
                id: 'canvasToTempFilePath',
                func: () => {
                    useReady(() => {
                        const context = Taro.createCanvasContext('canvas')
                        context.setStrokeStyle("#00ff00")
                        context.setLineWidth(5)
                        context.rect(0, 0, 200, 200)
                        context.stroke()
                        context.setStrokeStyle("#ff0000")
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
                        context.draw(true, () => {
                            Taro.canvasToTempFilePath({
                                x: 100,
                                y: 200,
                                width: 50,
                                height: 50,
                                destWidth: 100,
                                destHeight: 100,
                                quality: 1,
                                fileType: 'png',
                                canvasId: 'myCanvas',
                                success: function (res) {
                                    console.log('canvasToTempFilePath success', res)
                                },
                                fail: function (res) {
                                    console.log('canvasToTempFilePath fail', res)
                                },
                                complete: function (res) {
                                    console.log('canvasToTempFilePath complete', res)
                                },
                            })
                        })
                    })
                },
            },
            {
                id: 'CanvasContext',
                func: () => {
                    const ctx = Taro.createCanvasContext('myCanvas')
                    // Draw coordinates
                    ctx.arc(100, 75, 50, 0, 2 * Math.PI)
                    ctx.setFillStyle('#EEEEEE')
                    ctx.fill()
                    ctx.beginPath()
                    ctx.moveTo(40, 75)
                    ctx.lineTo(160, 75)
                    ctx.moveTo(100, 15)
                    ctx.lineTo(100, 135)
                    ctx.setStrokeStyle('#AAAAAA')
                    ctx.stroke()
                    ctx.setFontSize(12)
                    ctx.setFillStyle('black')
                    ctx.fillText('0', 165, 78)
                    ctx.fillText('0.5*PI', 83, 145)
                    ctx.fillText('1*PI', 15, 78)
                    ctx.fillText('1.5*PI', 83, 10)
                    // Draw points
                    ctx.beginPath()
                    ctx.arc(100, 75, 2, 0, 2 * Math.PI)
                    ctx.setFillStyle('lightgreen')
                    ctx.fill()
                    ctx.beginPath()
                    ctx.arc(100, 25, 2, 0, 2 * Math.PI)
                    ctx.setFillStyle('blue')
                    ctx.fill()
                    ctx.beginPath()
                    ctx.arc(150, 75, 2, 0, 2 * Math.PI)
                    ctx.setFillStyle('red')
                    ctx.fill()
                    // Draw arc
                    ctx.beginPath()
                    ctx.arc(100, 75, 50, 0, 1.5 * Math.PI)
                    ctx.setStrokeStyle('#333333')
                    ctx.stroke()
                    ctx.draw()
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
    render () {
        return (
            <View className='api-page'>
                {
                    this.state.list.map((item) => {
                        return (
                            <View
                                className='api-page-btn'
                                onClick={item.func == null ? () => {} : item.func}
                            >
                                {item.id}
                                {
                                    item.func == null && (<Text className='navigator-state tag'>未创建Demo</Text>)
                                }
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}
