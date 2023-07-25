import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 界面-动画
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'createAnimation',
                func: () => {
                    var animation = Taro.createAnimation({
                        transformOrigin: "50% 50%",
                        duration: 1000,
                        timingFunction: "ease",
                        delay: 0,
                        unit: 'ms'
                    })
                    console.log('createAnimation success ', animation)
                },
            }, 
            {
                id: 'Animation',
                func: () => {
                    var animationInstance = Taro.createAnimation({
                        transformOrigin: "50% 50%",
                        duration: 1000,
                        timingFunction: "ease",
                        delay: 0,
                        unit: 'ms'
                    })
                    console.log('Animation export ', animationInstance.export)
                    
                    var animationInstance = animationInstance.step({
                        transformOrigin: "60% 60%",
                        duration: 2000,
                        timingFunction: "linear",
                        delay: 0
                    })
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.rotate(150)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.rotate3d(10,20,30,150)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.rotateX(50)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.rotateY(50)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.rotateZ(50)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.scale(2,2)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.scale3d(2,2,3)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.scaleX(4)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.scaleY(4)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.scaleZ(4)
                    console.log('Animation step ', animationInstance)
                    
                    var animationInstance = animationInstance.skew(4,2)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.skewX(4)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.skewY(4)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.translate(4,2)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.translate3d(4,2,1)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.translateX(4)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.translateY(4)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.translateZ(4)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.opacity(0.5)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.backgroundColor('#ff0000')//red
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.width(1)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.height(3)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.left(2)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.right(4)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.top(5)
                    console.log('Animation step ', animationInstance)

                    var animationInstance = animationInstance.bottom(3)
                    console.log('Animation step ', animationInstance)
                },
            }, 
        ], 
    }
    render () {
        return (
            <View className='api-page'>
                {
                    this.state.list.map((item) => {
                        return (
                            <Button
                                animation={item.func == null ? () => {} : item.func}
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
                    })
                }
            </View>
        )
    }
}
