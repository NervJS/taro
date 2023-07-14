import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-视频
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'chooseVideo',
                func: () => {
                    Taro.chooseVideo({
                        sourceType: ['album','camera'],
                        maxDuration: 60,
                        camera: 'back',
                        success: function (res) {
                          console.log('chooseVideo success ', res.tempFilePath, res.duration, res.height, res.size, res.width, res.errMsg)
                        },
                        fail: function (res) {
                            console.log('chooseVideo fail ', res.errMsg)
                          }
                    })
                },
            }, 
            {
                id: 'chooseMedia',
                func: () => {
                    Taro.chooseMedia({
                        count: 9,
                        mediaType: ['image','video'],
                        sourceType: ['album', 'camera'],
                        maxDuration: 30,
                        camera: 'back',
                        success: (res) => {
                          console.log('chooseMedia success ', res.tempFiles, res.type, res.errMsg)
                        },
                        fail: (res) => {
                            console.log('chooseMedia fail ', res.errMsg)
                          },
                    })
                },
            }, 
            {
                id: 'saveVideoToPhotosAlbum',
                func: () => {
                    Taro.chooseVideo({
                        sourceType: ['album','camera'],
                        maxDuration: 60,
                        camera: 'back',
                        success: function (res) {
                          Taro.saveVideoToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: function (res) {
                              console.log('saveVideoToPhotosAlbum success ', res.errMsg)
                            },
                            fail: function (res) {
                                console.log('saveVideoToPhotosAlbum fail ', res.errMsg)
                            },
                          })
                        },
                    })
                },
            }, 
            {
                id: 'getVideoInfo',
                func: () => {
                    Taro.chooseVideo({
                        sourceType: ['album','camera'],
                        maxDuration: 60,
                        camera: 'back',
                        success: function (res) {
                            Taro.getVideoInfo({
                                src: res.tempFilePath,
                                success (res) {
                                    console.log('getVideoInfo success ', res.bitrate, res.duration, res.fps, res.height, res.orientation, res.size, res.type, res.width, res.errMsg)
                                },
                                fail (res) {
                                    console.log('getVideoInfo fail ', res.errMsg)
                                },
                            })
                        },
                    })
                },
            }, 
            {
                id: 'openVideoEditor',
                func: () => {
                    Taro.chooseVideo({
                        sourceType: ['album','camera'],
                        maxDuration: 60,
                        camera: 'back',
                        success: function (res) {
                            Taro.openVideoEditor({
                                filePath: res.tempFilePath,
                                success (res) {
                                    console.log('openVideoEditor success ', res.duration, res.size, res.tempFilePath, res.tempThumbPath, res.errMsg)
                                },
                                fail (res) {
                                    console.log('openVideoEditor fail ', res.errMsg)
                                },
                            })
                        },
                    })
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
