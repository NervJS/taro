import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-录音管理
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'getRecorderManager',
                func: () => {
                    const recorderManager = Taro.getRecorderManager();
                    recorderManager.onStart(() => {
                        console.log('recorder onStart')
                    })
                    setTimeout(function () {
                        recorderManager.onPause(() => {
                            console.log('recorder onPause')
                        })
                    }, 10000)
                    setTimeout(function () {
                        recorderManager.onStop((res) => {
                            console.log('recorder onStop', res.duration, res.fileSize, res.tempFilePath)
                        })
                    }, 10000)
                    setTimeout(function(){
                        recorderManager.onResume((res) => {
                            console.log('recorder onResume', res.errMsg)
                        })
                    },10000)
                    setTimeout(function(){
                        recorderManager.onInterruptionBegin((res) => {
                            console.log('recorder onInterruptionBegin', res.errMsg)
                        })
                    },10000)
                    setTimeout(function(){
                        recorderManager.onInterruptionEnd((res) => {
                            console.log('recorder onInterruptionEnd', res.errMsg)
                        })
                    },10000)
                    setTimeout(function(){
                        recorderManager.onFrameRecorded((res) => {
                            const { frameBuffer } = res
                            console.log('frameBuffer.byteLength', frameBuffer.byteLength)
                        })
                    },10000)                    
                    recorderManager.start({
                        duration: 10000,
                        sampleRate: 44100,
                        numberOfChannels: 1,
                        encodeBitRate: 192000,
                        format: 'aac',
                        frameSize: 50
                    })
                    console.log('recorder start')
                    recorderManager.pause()
                    console.log('recorder pause')
                    recorderManager.resume()
                    console.log('recorder resume')
                    recorderManager.stop()
                    console.log('recorder stop')
                },
            },
            {
                id: 'env',
                func: () => {
                    
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
