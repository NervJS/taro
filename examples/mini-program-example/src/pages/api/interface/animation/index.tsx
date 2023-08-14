import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import './index.scss'

const TIME_DURATION = 1000

/**
 * 界面-动画
 * @returns
 */

export default class Index extends React.Component {
  state = {
    animation: Taro.createAnimation({
      transformOrigin: '50% 50%',
      duration: TIME_DURATION,
      timingFunction: 'ease',
      delay: 0,
      unit: 'px',
    }),
    animationData: {},
    description: '动画说明',
    list: [
      {
        id: 'createAnimation',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.createAnimation')
          const an = Taro.createAnimation({
            transformOrigin: '50% 50%',
            duration: TIME_DURATION,
            timingFunction: 'ease',
            delay: 0,
            unit: 'px',
          })
          console.log('Animation:', an)
          Taro.showToast({
            title: '创建动画成功',
            duration: 2000,
          })
        },
      },
      {
        id: 'Animation.opacity',
        func: (apiIndex) => {
          this.state.animation.opacity(0).step().opacity(1).step()
          this.exportAnimation('opacity(0).step().opacity(1).step()')
        },
      },
      {
        id: 'Animation.backgroundColor',

        func: (apiIndex) => {
          this.state.animation.backgroundColor('#f00').step().backgroundColor('#5b5').step()
          this.exportAnimation("backgroundColor('#f00').step().backgroundColor('#5b5').step()")
        },
      },
      {
        id: 'Animation.skew',
        func: () => {
          this.state.animation.skew(45, 45).step().skew(0, 0).step()
          this.exportAnimation('skew(45, 45).step().skew(0, 0).step()')
        },
      },
      {
        id: 'Animation.skewX',
        func: () => {
          this.state.animation.skewX(45).step().skewX(0).step()
          this.exportAnimation('skewX(45).step().skewX(0).step()')
        },
      },
      {
        id: 'Animation.skewY',
        func: () => {
          this.state.animation.skewY(45).step().skewY(0).step()
          this.exportAnimation('skewY(45).step().skewY(0).step()')
        },
      },
      {
        id: 'Animation.scale',
        func: (apiIndex) => {
          this.state.animation.scale(2, 2).step().scale(1, 1).step()
          this.exportAnimation('scale(2, 2).step().scale(1, 1).step()')
        },
      },
      {
        id: 'Animation.scale3d',
        func: (apiIndex) => {
          this.state.animation.scale3d(2, 2, 2).step().scale3d(1, 1, 1).step()
          this.exportAnimation('scale3d(2, 2, 2).step().scale3d(1, 1, 1).step()')
        },
      },
      {
        id: 'Animation.scaleX',
        func: (apiIndex) => {
          this.state.animation.scaleX(2).step().scaleX(1).step()
          this.exportAnimation('scaleX(2).step().scaleX(1).step()')
        },
      },
      {
        id: 'Animation.scaleY',
        func: (apiIndex) => {
          this.state.animation.scaleY(2).step().scaleY(1).step()
          this.exportAnimation('scaleY(2).step().scaleY(1).step()')
        },
      },
      {
        id: 'Animation.scaleZ',
        func: (apiIndex) => {
          this.state.animation.scaleZ(2).step().scaleZ(1).step()
          this.exportAnimation('scaleZ(2).step().scaleZ(1).step()')
        },
      },
      {
        id: 'Animation.rotate',
        func: (apiIndex) => {
          this.state.animation.rotate(45).step().rotate(0).step()
          this.exportAnimation('rotate(45).step().rotate(0).step()')
        },
      },
      {
        id: 'Animation.rotate3d',
        func: (apiIndex) => {
          this.state.animation.rotate3d(2, 2, 2, 60).step().rotate3d(0, 0, 0, 0).step()
          this.exportAnimation('rotate3d(2, 2, 2, 60).step().rotate3d(0, 0, 0, 0).step()')
        },
      },
      {
        id: 'Animation.rotateX',
        func: (apiIndex) => {
          this.state.animation.rotateX(60).step().rotateX(0).step()
          this.exportAnimation('rotateX(60).step().rotateX(0).step()')
        },
      },
      {
        id: 'Animation.rotateY',
        func: (apiIndex) => {
          this.state.animation.rotateY(60).step().rotateY(0).step()
          this.exportAnimation('rotateY(60).step().rotateY(0).step()')
        },
      },
      {
        id: 'Animation.rotateZ',
        func: (apiIndex) => {
          this.state.animation.rotateZ(60).step().rotateZ(0).step()
          this.exportAnimation('rotateZ(60).step().rotateZ(0).step()')
        },
      },
      {
        id: 'Animation.translate',
        func: (apiIndex) => {
          this.state.animation.translate(20, 20).step().translate(0, 0).step()
          this.exportAnimation('translate(20, 20).step().translate(0, 0).step()')
        },
      },
      {
        id: 'Animation.translate3d',
        func: (apiIndex) => {
          this.state.animation.translate3d(20, 20, 20).step().translate3d(0, 0, 0).step()
          this.exportAnimation('translate3d(20, 20, 20).step().translate3d(0, 0, 0).step()')
        },
      },
      {
        id: 'Animation.translateX',
        func: (apiIndex) => {
          this.state.animation.translateX(20).step().translateX(0).step()
          this.exportAnimation('translateX(20).step().translateX(0).step()')
        },
      },
      {
        id: 'Animation.translateY',
        func: (apiIndex) => {
          this.state.animation.translateY(20).step().translateY(0).step()
          this.exportAnimation('translateY(20).step().translateY(0).step()')
        },
      },
      {
        id: 'Animation.translateZ',
        func: (apiIndex) => {
          console.log('jerer')
          this.state.animation.rotateY(45).translateZ(200).step().translateZ(0).step()
          this.exportAnimation('rotateY(45).translateZ(200).step().translateZ(0).step()')
        },
      },
      {
        id: 'Animation.width',
        func: (apiIndex) => {
          this.state.animation.width('60%').step().width('50%').step()
          this.exportAnimation("width('60%').step().width('50%').step()")
        },
      },
      {
        id: 'Animation.height',
        func: (apiIndex) => {
          this.state.animation.height('60%').step().height('50%').step()
          this.exportAnimation("height('60%').step().height('50%').step()")
        },
      },
      {
        id: 'Animation.left',
        func: (apiIndex) => {
          this.state.animation.left('20%').step()
          this.exportAnimation("left('20%').step()")
        },
      },
      {
        id: 'Animation.right',
        func: (apiIndex) => {
          this.state.animation.right('20%').step()
          this.exportAnimation("right('20%').step()")
        },
      },
      {
        id: 'Animation.top',
        func: (apiIndex) => {
          this.state.animation.top('10%').step()
          this.exportAnimation("top('10%').step()")
        },
      },
      {
        id: 'Animation.bottom',
        func: (apiIndex) => {
          this.state.animation.bottom('-20%').step()
          this.exportAnimation("bottom('-20%').step()")
        },
      },
      {
        id: 'Animation.matrix',
        func: () => {
          this.state.animation.matrix(1.2, 0.2, -1, 0.9, 0, 20).step()
          this.exportAnimation('matrix(1.2, 0.2, -1, 0.9, 0, 20).step()')
        },
      },
      {
        id: 'Animation.matrix3d',
        func: () => {
          this.state.animation.matrix3d(1, 0, 0, 0, 0, 1, 6, 0, 0, 0, 1, 0, 50, 100, 0, 1.1).step()
          this.exportAnimation('matrix3d(1, 0, 0, 0, 0, 1, 6, 0, 0, 0, 1, 0, 50, 100, 0, 1.1).step()')
        },
      },
    ],
  }
  exportAnimation(description) {
    this.setState({
      animationData: this.state.animation.export(),
      description,
    })
  }
  render() {
    const animationProp =
      Taro.getEnv() == Taro.ENV_TYPE.WEAPP
        ? { animation: this.state.animationData }
        : { 'data-animation': this.state.animationData }
    return (
      <View>
        <View
          style={{
            position: 'sticky',
            top: 0,
            width: '100%',
            height: '300px',
            border: '1px solid #000',
            backgroundColor: '#fff',
          }}
        >
          <Text>{this.state.description}</Text>
          <View
            {...animationProp}
            style={{
              position: 'relative',
              width: '50%',
              height: '50%',
              border: '1px solid #000',
              borderRadius: '16px',
              backgroundColor: '#5b5',
            }}
          >
            动画目标
          </View>
        </View>
        <View className='api-page'>
          {this.state.list.map((item) => {
            return (
              <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
                {item.id}
                {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
