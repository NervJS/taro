import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-相机组件管理
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'createCameraContext',
                func: () => {
                    const cameraContext = Taro.createCameraContext()
                    console.log('createCameraContext success')
                    cameraContext.takePhoto({
                        success: (res) => {
                            console.log('cameraContext.takePhoto success ', res)
                        },
                        fail: (res) => {
                            console.log('cameraContext.takePhoto fail ', res)
                        },
                        complete: (res) => {
                            console.log('cameraContext.takePhoto complete ', res)
                        }
                    });
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
