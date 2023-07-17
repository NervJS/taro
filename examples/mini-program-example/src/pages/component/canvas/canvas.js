import './canvas.scss'

import Taro from '@tarojs/taro'
import React from 'react'
import { View, Text, Canvas } from '@tarojs/components'

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'
import { useReady } from '@tarojs/taro'

const PageView = () => {

  useReady(() => {
    setTimeout(() => {
      const context = Taro.createCanvasContext('canvas2D')
      draw(context)
    }, 200)
  })

  const draw = (context) => {
    context.fillStyle="#FF0000";
    context.fillRect(0,0,150,75);
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
  }

  return (
    <View className='container'>
      <Header title='Canvas'></Header>
      <ComponentState platform='h5' rate='60'> </ComponentState>
      <View className='page-body'>
        <View className='page-section'>
          <View className="page-section-spacing">
            <View className="page-body-wrapper">
              <Canvas type="2d" canvasId="canvas2D" className="canvas" width={"305px"} height={"305px"} style='width: 305px; height: 305px;'></Canvas>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default PageView
