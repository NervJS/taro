import React from 'react'
import Taro, { Current } from '@tarojs/taro'
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
                            console.log('chooseImage fail ', res);
                        },
                        complete: function(res){
                            console.log('chooseImage complete ', res);
                        },
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
                            current: 'test/currentField',
                            showmenu: false,
                            referrerPolicy: 'origin',
                            success: function(res){
                                console.log('previewImage success ', res);
                            },
                            fail: function(res){
                                console.log('previewImage fail ',res);
                            },
                            complete: function(res){
                                console.log('previewImage complete ', res);
                            },
                          })
                        },
                        fail: function (res) {
                            console.log('chooseImage fail ', res);
                        },
                        complete: function(res){
                            console.log('chooseImage complete ', res);
                        },
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
                                console.log('getImageInfo fail ', res);
                            },
                            complete: function(res){
                                console.log('getImageInfo complete ', res);
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
                                console.log('saveImageToPhotosAlbum success ', res);
                            },
                            fail: function (res) {
                                console.log('saveImageToPhotosAlbum fail ', res);
                            },
                            complete: function(res){
                                console.log('saveImageToPhotosAlbum complete ', res);
                            }
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
                            compressedWidth: 300,
                            compressHeight: 200,
                            success: function (res) {
                                console.log('compressImage success ', res);
                            },
                            fail: function (res) {
                                console.log('compressImage fail ', res);
                            },
                            complete: function(res){
                                console.log('compressImage complete ', res);
                            }
                          })
                        }
                    })
                },
            },
            {
                id: 'previewMedia',
                func: () => {
                    Taro.chooseImage({
                        success: function (res) {
                          Taro.previewMedia({
                            sources:[{
                                url:res.tempFilePaths[0],
                                type:'image',
                                poster:'test'
                            }],
                            success: function (res) {
                                console.log('previewMedia success ', res);
                            },
                            fail: function (res) {
                                console.log('previewMedia fail ', res);
                            },
                            complete: function(res){
                                console.log('previewMedia complete ', res);
                            }
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
