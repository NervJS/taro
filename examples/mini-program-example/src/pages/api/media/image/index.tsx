import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-图片
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'chooseImage ',
                func: () => {
                    Taro.chooseImage({
                        count: 1,
                        sizeType: ['original', 'compressed'],
                        sourceType: ['album', 'camera'],
                        success: function (res) {
                          console.log('chooseImage success ', res.tempFilePaths, res.tempFiles, res.errMsg);
                        },
                        fail: function (res) {
                            console.log('chooseImage fail ', res.errMsg);
                        }
                    })
                },
            }, 
            {
                id: 'previewImage',
                func: () => {
                    Taro.chooseImage({
                        count: 3,
                        sizeType: ['original', 'compressed'], 
                        sourceType: ['album', 'camera'], 
                        success: function (res) {
                          console.log('chooseImage success');
                          Taro.previewImage({
                            urls: res.tempFilePaths,
                            success: function(){
                                console.log('previewImage success ', res.errMsg);
                            },
                            fail: function(){
                                console.log('previewImage fail ',res.errMsg);
                            },
                          })
                        },
                        fail: function (res) {
                            console.log('chooseImage fail ', res.errMsg);
                        }
                    })
                },
            }, 
            {
                id: 'getImageInfo',
                func: () => {
                    Taro.chooseImage({
                        success: function (res) {
                          Taro.getImageInfo({
                            src: res.tempFilePaths[0],
                            success: function (res) {
                                console.log('getImageInfo success ', res.width, res.height, res.orientation, res.path, res.type, res.errMsg);
                            },
                            fail: function (res) {
                                console.log('getImageInfo fail ', res.errMsg);
                            },
                          })
                        }
                    })
                },
            }, 
            {
                id: 'saveImageToPhotosAlbum',
                func: () => {
                    Taro.chooseImage({
                        success: function (res) {
                          Taro.saveImageToPhotosAlbum({
                            filePath: res.tempFilePaths[0],
                            success: function (res) {
                                console.log('saveImageToPhotosAlbum success ', res.errMsg);
                            },
                            fail: function (res) {
                                console.log('saveImageToPhotosAlbum fail ', res.errMsg);
                            },
                          })
                        }
                    })
                },
            }, 
            {
                id: 'compressImage',
                func: () => {
                    Taro.chooseImage({
                        success: function (res) {
                          Taro.compressImage({
                            quality: 80,
                            src: res.tempFilePaths[0],
                            success: function (res) {
                                console.log('compressImage success ', res.errMsg);
                            },
                            fail: function (res) {
                                console.log('compressImage fail ', res.errMsg);
                            },
                          })
                        }
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
