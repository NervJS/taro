import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
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
            unit: 'ms'
        }),
        animationData: {},
        list: [
            {
                id: 'animation-target-0',
            },
            {
                id: 'createAnimation',
                func: () => {
                    this.state.animation.scale(2, 2).step()
                    this.runAnimationAndReset()
                    Taro.showToast({
                        title: '成功并执行缩放',
                        duration: 2000
                    })
                },
            },
            {
                id: 'Animation.opacity',
                func: () => {
                    this.state.animation.opacity(0).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.backgroundColor',
                func: () => {
                    this.state.animation.backgroundColor('#FF0000').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.skew',
                func: null,
            },
            {
                id: 'Animation.skewX',
                func: null,
            },
            {
                id: 'Animation.skewY',
                func: null,
            },
            {
                id: 'animation-target-1',
            },
            {
                id: 'Animation.scale',
                func: () => {
                    this.state.animation.scale(2, 2).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.scale3d',
                func: () => {
                    this.state.animation.scale3d(2, 2, 2).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.scaleX',
                func: () => {
                    this.state.animation.scaleX(2).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.scaleY',
                func: () => {
                    this.state.animation.scaleY(2).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.scaleZ',
                func: () => {
                    this.state.animation.scaleZ(2).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'animation-target-2',
            },
            {
                id: 'Animation.rotate',
                func: () => {
                    this.state.animation.rotate(45).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.rotate3d',
                func: () => {
                    this.state.animation.rotate3d(2, 2, 2, 60).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.rotateX',
                func: () => {
                    this.state.animation.rotateX(60).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.rotateY',
                func: () => {
                    this.state.animation.rotateY(60).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.rotateZ',
                func: () => {
                    this.state.animation.rotateZ(60).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.matrix',
                func: () => {
                    this.state.animation.matrix(1.2, 0.2, -1, 0.9, 0, 20).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'animation-target-3',
            },
            {
                id: 'Animation.matrix3d',
                func: () => {
                    this.state.animation.matrix3d(1, 0, 0, 0, 0, 1, 6, 0, 0, 0, 1, 0, 50, 100, 0, 1.1).step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.translate',
                func: () => {
                    this.state.animation.translate('20px', '20px').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.translate3d',
                func: () => {
                    this.state.animation.translate3d('20px', '20px', '20px').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.translateX',
                func: () => {
                    this.state.animation.translateX('20px').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.translateY',
                func: () => {
                    this.state.animation.translateY('20px').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.translateZ',
                func: () => {
                    this.state.animation.translateZ('20px').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'animation-target-4',
            },
            {
                id: 'Animation.width',
                func: () => {
                    this.state.animation.width('100px').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.height',
                func: () => {
                    this.state.animation.height('60px').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.left',
                func: () => {
                    this.state.animation.left('60px').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.right',
                func: () => {
                    this.state.animation.right('60px').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.top',
                func: () => {
                    this.state.animation.top('100px').step()
                    this.runAnimationAndReset()
                },
            },
            {
                id: 'Animation.bottom',
                func: () => {
                    this.state.animation.bottom('50px').step()
                    this.runAnimationAndReset()
                },
            },
        ],
    }
    runAnimationAndReset() {
        this.setState({
            animationData: this.state.animation.export()
        })
        setTimeout(() => {
            this.state.animation.step()
            this.setState({
                animationData: this.state.animation.export()
            })
        }, TIME_DURATION)
    }
    render () {
        return (
            <View className='api-page'>
                {
                    this.state.list.map((item) => {
                        if (item.id.startsWith('animation-target')) {
                            return (
                                <Button key={item.id} animation={this.state.animationData}>动画目标 </Button>
                            )
                        } else {
                            return (
                                <Button
                                    key={item.id}
                                    className='api-page-btn'
                                    type='primary'
                                    onClick={item.func == null ? () => {} : item.func}
                                >
                                    {item.id}
                                    {
                                        item.func == null && (<Text className='navigator-state tag'>未创建Demo</Text>)
                                    }
                                </Button>
                            )
                        }
                    })
                }
            </View>
        )
    }
}
