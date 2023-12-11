import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

const TRANSFORM_ORG = '50% 50%'
const DURATION_MS = 1000
const TIMING_FUNC = 'ease'
const DELAY_MS = 0
const UNIT = 'px'

const initOption: Taro.createAnimation.Option = {
  transformOrigin: TRANSFORM_ORG,
  duration: DURATION_MS,
  timingFunction: TIMING_FUNC,
  delay: DELAY_MS,
  unit: UNIT,
}

/**
 * 界面-动画
 * @returns
 */

export default class Index extends React.Component {
  state = {
    animation: Taro.createAnimation(initOption),
    animationData: {},
    description: '动画说明',
    list: [
      {
        id: 'createAnimation',
        inputData: {
          ...initOption,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.createAnimation')
          const animation = Taro.createAnimation(data)
          this.setState({ animation, animationData: {} })
          TestConsole.consoleResult.call(this, animation, apiIndex)
          Taro.showToast({
            title: '创建动画成功',
            duration: 2000,
          })
        },
      },
      {
        id: 'Animation.opacity',
        func: () => {
          this.state.animation.opacity(0).step().opacity(0.5).step().opacity(0.1).step().opacity(1).step()
          this.exportAnimation('opacity(0).step().opacity(0.5).step().opacity(0.1).step().opacity(1).step()')
        },
      },
      {
        id: 'Animation.backgroundColor',

        func: () => {
          this.state.animation.backgroundColor('#00f').step()
          this.exportAnimation("backgroundColor('#00f').step()")
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
        func: () => {
          this.state.animation.scale(2, 2).step().scale(1, 1).step().scale(1.5).step().scale(1).step()
          this.exportAnimation('scale(2, 2).step().scale(1, 1).step().scale(1.5).step().scale(1).step()')
        },
      },
      {
        id: 'Animation.scale3d',
        func: () => {
          this.state.animation.scale3d(2, 2, 2).step().scale3d(1, 1, 1).step()
          this.exportAnimation('scale3d(2, 2, 2).step().scale3d(1, 1, 1).step()')
        },
      },
      {
        id: 'Animation.scaleX',
        func: () => {
          this.state.animation.scaleX(2).step().scaleX(1).step()
          this.exportAnimation('scaleX(2).step().scaleX(1).step()')
        },
      },
      {
        id: 'Animation.scaleY',
        func: () => {
          this.state.animation.scaleY(2).step().scaleY(1).step()
          this.exportAnimation('scaleY(2).step().scaleY(1).step()')
        },
      },
      {
        id: 'Animation.scaleZ',
        func: () => {
          this.state.animation.scaleZ(2).step().scaleZ(1).step()
          this.exportAnimation('scaleZ(2).step().scaleZ(1).step()')
        },
      },
      {
        id: 'Animation.rotate',
        func: () => {
          this.state.animation.rotate(45).step().rotate(0).step()
          this.exportAnimation('rotate(45).step().rotate(0).step()')
        },
      },
      {
        id: 'Animation.rotate3d',
        func: () => {
          this.state.animation.rotate3d(2, 2, 2, 60).step().rotate3d(0, 0, 0, 0).step()
          this.exportAnimation('rotate3d(2, 2, 2, 60).step().rotate3d(0, 0, 0, 0).step()')
        },
      },
      {
        id: 'Animation.rotateX',
        func: () => {
          this.state.animation.rotateX(60).step().rotateX(0).step()
          this.exportAnimation('rotateX(60).step().rotateX(0).step()')
        },
      },
      {
        id: 'Animation.rotateY',
        func: () => {
          this.state.animation.rotateY(60).step().rotateY(0).step()
          this.exportAnimation('rotateY(60).step().rotateY(0).step()')
        },
      },
      {
        id: 'Animation.rotateZ',
        func: () => {
          this.state.animation.rotateZ(60).step().rotateZ(0).step()
          this.exportAnimation('rotateZ(60).step().rotateZ(0).step()')
        },
      },
      {
        id: 'Animation.translate',
        func: () => {
          this.state.animation.translate(20, 20).step().translate(0, 0).step()
          this.exportAnimation('translate(20, 20).step().translate(0, 0).step()')
        },
      },
      {
        id: 'Animation.translate3d',
        func: () => {
          this.state.animation.translate3d(20, 20, 20).step().translate3d(0, 0, 0).step()
          this.exportAnimation('translate3d(20, 20, 20).step().translate3d(0, 0, 0).step()')
        },
      },
      {
        id: 'Animation.translateX',
        func: () => {
          this.state.animation.translateX(40).step().translateX(0).step()
          this.exportAnimation('translateX(40).step().translateX(0).step()')
        },
      },
      {
        id: 'Animation.translateY',
        func: () => {
          this.state.animation.translateY(40).step().translateY(0).step()
          this.exportAnimation('translateY(40).step().translateY(0).step()')
        },
      },
      {
        id: 'Animation.translateZ',
        func: () => {
          this.state.animation.rotateY(45).translateZ(200).step().translateZ(0).step()
          this.exportAnimation('rotateY(45).translateZ(200).step().translateZ(0).step()')
        },
      },
      {
        id: 'Animation.width',
        func: () => {
          this.state.animation.width('60%').step().width('100%').step()
          this.exportAnimation("width('60%').step().width('100%').step()")
        },
      },
      {
        id: 'Animation.height',
        func: () => {
          this.state.animation.height('60%').step().height('100%').step()
          this.exportAnimation("height('60%').step().height('100%').step()")
        },
      },
      {
        id: 'Animation.left',
        func: () => {
          this.state.animation.left('20%').step()
          this.exportAnimation("left('20%').step()")
        },
      },
      {
        id: 'Animation.right',
        func: () => {
          this.state.animation.right('20%').step()
          this.exportAnimation("right('20%').step()")
        },
      },
      {
        id: 'Animation.top',
        func: () => {
          this.state.animation.top('20%').step()
          this.exportAnimation("top('20%').step()")
        },
      },
      {
        id: 'Animation.bottom',
        func: () => {
          this.state.animation.bottom('20%').step()
          this.exportAnimation("bottom('20%').step()")
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
    const { list, animationData, description } = this.state
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
            zIndex: 100,
          }}
        >
          <Text style={{ fontSize: '16px' }}>{description}</Text>
          <View
            style={{
              position: 'relative',
              width: '50%',
              height: '50%',
              left: '25%',
              top: '10%',
            }}
          >
            <View
              animation={animationData}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                border: '1px solid #000',
                borderRadius: '16px',
                backgroundColor: '#5b5',
                textAlign: 'center',
              }}
            >
              动画目标
            </View>
          </View>
        </View>
        <View className='api-page'>
          <ButtonList buttonList={list} />
        </View>
      </View>
    )
  }
}
