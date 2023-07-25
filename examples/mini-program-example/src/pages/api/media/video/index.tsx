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
                            complete: function (res){
                                console.log('saveVideoToPhotosAlbum complete ', res.errMsg)
                            }
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
                                    console.log('openVideoEditor success ', res)
                                },
                                fail (res) {
                                    console.log('openVideoEditor fail ', res)
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
                                    console.log('getVideoInfo success ', res)
                                },
                                fail (res) {
                                    console.log('getVideoInfo fail ', res)
                                },
                                complete: function (res){
                                    console.log('getVideoInfo complete ', res.errMsg)
                                }
                            })
                        },
                    })
                },
            }, 
            {
                id: 'createVideoContext',
                func: () => {
                    const videoContext = Taro.createVideoContext('myVideo')
                    console.log('createVideoContext ', videoContext)
                },
            },
            {
                id: 'compressVideo',
                func: null,
            },
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
                        },
                        complete: function (res){
                            console.log('chooseVideo complete ', res.errMsg)
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
                        sizeType: ['original', 'compressed'],
                        // mediaId: 'test mediaId field',//'mediaId' does not exist in type 'Option'
                        success: (res) => {
                          console.log('chooseMedia success ', res.tempFiles, res.type, res.errMsg)
                        },
                        fail: (res) => {
                            console.log('chooseMedia fail ', res.errMsg)
                        },
                        // complete不存在该方法
                    })
                },
            }, 
            {
                id: 'VideoContext',
                func: () => {
                    const videoContext = Taro.createVideoContext('myVideo')
                    console.log('createVideoContext ', videoContext)

                    videoContext.exitBackgroundPlayback()
                    console.log('exitBackgroundPlayback')

                    videoContext.exitFullScreen()
                    console.log('exitFullScreen')

                    videoContext.exitPictureInPicture({
                        success:(res) => {
                            console.log('videoContext.exitPictureInPicture success ', res)
                        },
                        fail:(res) => {
                            console.log('videoContext.exitPictureInPicture fail ', res)
                        },
                        complete:(res) => {
                            console.log('videoContext.exitPictureInPicture complete ', res)
                        },
                    })

                    videoContext.hideStatusBar()
                    console.log('')

                    videoContext.pause()
                    console.log('videoContext.pause')

                    videoContext.play()
                    console.log('videoContext.play')

                    videoContext.playbackRate(1.0)
                    console.log('videoContext.playbackRate')

                    videoContext.requestBackgroundPlayback()
                    console.log(' videoContext.requestBackgroundPlayback')

                    videoContext.requestFullScreen({
                        direction: 90
                    })
                    console.log('videoContext.requestFullScreen')

                    videoContext.seek(3)
                    console.log('videoContext.seek(3)')

                    videoContext.sendDanmu({
                        text:'测试弹幕',
                        color:'#FFF'
                    })
                    console.log('videoContext.sendDanmu')

                    videoContext.showStatusBar()
                    console.log('videoContext.showStatusBar')

                    videoContext.stop()
                    console.log('videoContext.stop')
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
