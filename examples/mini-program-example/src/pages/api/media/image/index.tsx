import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-图片
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'chooseImage_album',
                func: () => {
                    Taro.chooseImage({
                        count: 7,
                        sizeType: ['original', 'compressed'],
                        sourceType: ['album'],
                        success: function (res) {
                            console.log('chooseImage success ', res);
                        },
                        fail: function (res) {
                            console.log('chooseImage fail ', res);
                        },
                        complete: function (res) {
                            console.log('chooseImage complete ', res);
                        },
                    }).then((ret) => {
                        console.log('chooseImage ret ', ret.tempFilePaths, ret.tempFiles, ret.errMsg);
                    })
                },
            },
            {
                id: 'chooseImage_camera',
                func: () => {
                    Taro.chooseImage({
                        count: 5,
                        sizeType: ['original', 'compressed'],
                        sourceType: ['camera'],
                        success: function (res) {
                            console.log('chooseImage success ', res);
                        },
                        fail: function (res) {
                            console.log('chooseImage fail ', res);
                        },
                        complete: function (res) {
                            console.log('chooseImage complete ', res);
                        },
                    }).then((ret) => {
                        console.log('chooseImage ret ', ret.tempFilePaths, ret.tempFiles, ret.errMsg);
                    })
                },
            },
            {
                id: 'chooseImage_user',
                func: () => {
                    Taro.chooseImage({
                        count: 7,
                        sizeType: ['original', 'compressed'],
                        sourceType: ['user'],
                        success: function (res) {
                            console.log('chooseImage success ', res);
                        },
                        fail: function (res) {
                            console.log('chooseImage fail ', res);
                        },
                        complete: function (res) {
                            console.log('chooseImage complete ', res);
                        },
                    }).then((ret) => {
                        console.log('chooseImage ret ', ret.tempFilePaths, ret.tempFiles, ret.errMsg);
                    })
                },
            },
            {
                id: 'chooseImage_environment',
                func: () => {
                    Taro.chooseImage({
                        count: 5,
                        sizeType: ['original', 'compressed'],
                        sourceType: ['environment'],
                        success: function (res) {
                            console.log('chooseImage success ', res);
                        },
                        fail: function (res) {
                            console.log('chooseImage fail ', res);
                        },
                        complete: function (res) {
                            console.log('chooseImage complete ', res);
                        },
                    }).then((ret) => {
                        console.log('chooseImage ret ', ret.tempFilePaths, ret.tempFiles, ret.errMsg);
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
                                success: function (res) {
                                    console.log('previewImage success ', res);
                                },
                                fail: function (res) {
                                    console.log('previewImage fail ', res);
                                },
                                complete: function (res) {
                                    console.log('previewImage complete ', res);
                                },
                            }).then((ret) => {
                                console.log('previewImage ret ', ret);
                            })
                        },
                        fail: function (res) {
                            console.log('chooseImage fail ', res.errMsg);
                        },
                        complete: function (res) {
                            console.log('chooseImage complete ', res.errMsg);
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
                                    console.log('getImageInfo success ', res);
                                },
                                fail: function (res) {
                                    console.log('getImageInfo fail ', res);
                                },
                                complete: function (res) {
                                    console.log('getImageInfo complete ', res);
                                },
                            }).then((res) => {
                                console.log('getImageInfo ret ', res.width, res.height, res.orientation, res.path, res.type, res.errMsg);
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
                                complete: function (res) {
                                    console.log('saveImageToPhotosAlbum complete ', res);
                                }
                            }).then((ret) => {
                                console.log('saveImageToPhotosAlbum ret ', ret);
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
                                quality: 1,
                                src: res.tempFilePaths[0],
                                compressedWidth: 300,
                                compressHeight: 200,
                                success: function (res1) {
                                    console.log('compressImage success ', res1.errMsg);
                                    Taro.saveImageToPhotosAlbum({
                                        filePath: res1.tempFilePath,
                                        success: function (res2) {
                                            console.log('saveImageToPhotosAlbum success ', res2);
                                            Taro.getImageInfo({
                                                src: res1.tempFilePath,
                                                success: function (res) {
                                                    console.log('compress later:getImageInfo success ', res);
                                                },
                                                fail: function (res) {
                                                    console.log('compress later:getImageInfo fail ', res);
                                                },
                                                complete: function (res) {
                                                    console.log('compress later:getImageInfo complete ', res);
                                                },
                                            })
                                        },
                                        fail: function (res2) {
                                            console.log('saveImageToPhotosAlbum fail ', res2);
                                        },
                                        complete: function (res2) {
                                            console.log('saveImageToPhotosAlbum complete ', res2);
                                        }
                                    })
                                },
                                fail: function (res1) {
                                    console.log('compressImage fail ', res1.errMsg);
                                },
                                complete: function (res1) {
                                    console.log('compressImage complete ', res1.errMsg);
                                }
                            }).then((ret1) => {
                                console.log('compressImage ret ', ret1)
                            })
                        }
                    }).then((res) => {
                        console.log('compress before :chooseImage ret ', res.tempFiles[0].size);
                    })
                },
            },
            {
                id: 'previewMedia_image',
                func: () => {
                    Taro.chooseImage({
                        success: function (res) {
                            Taro.previewMedia({
                                sources: [{
                                    url: res.tempFilePaths[0],
                                    type: 'image',
                                    poster: 'test'
                                }],
                                current: 0,
                                showmenu: false,
                                referrerPolicy: 'origin',
                                success: function (res) {
                                    console.log('previewMedia success ', res);
                                },
                                fail: function (res) {
                                    console.log('previewMedia fail ', res);
                                },
                                complete: function (res) {
                                    console.log('previewMedia complete ', res);
                                }
                            }).then((ret) => {
                                console.log('previewMedia_image ret ', ret);
                            })
                        }
                    })
                },
            },
            {
                id: 'previewMedia_video_album',
                func: () => {
                    Taro.chooseVideo({
                        sourceType: ['album'],
                        maxDuration: 60,
                        camera: 'back',
                        success: function (res) {
                            console.log('chooseMedia success ', res);
                            Taro.previewMedia({
                                sources: [{
                                    url: res.tempFilePath,
                                    type: 'video',
                                    poster: 'test_video'
                                }],
                                success: function (res) {
                                    console.log('previewMedia success ', res);
                                },
                                fail: function (res) {
                                    console.log('previewMedia fail ', res);
                                },
                                complete: function (res) {
                                    console.log('previewMedia complete ', res);
                                }
                            }).then((ret) => {
                                console.log('previewMedia_video_album ret ', ret);
                            })
                        }
                    })
                },
            },
            {
                id: 'previewMedia_video_camera',
                func: () => {
                    Taro.chooseVideo({
                        sourceType: ['camera'],
                        maxDuration: 60,
                        camera: 'back',
                        success: function (res) {
                            console.log('chooseMedia success ', res);
                            Taro.previewMedia({
                                sources: [{
                                    url: res.tempFilePath,
                                    type: 'video',
                                    poster: 'test_video'
                                }],
                                success: function (res) {
                                    console.log('previewMedia success ', res);
                                },
                                fail: function (res) {
                                    console.log('previewMedia fail ', res);
                                },
                                complete: function (res) {
                                    console.log('previewMedia complete ', res);
                                }
                            }).then((ret) => {
                                console.log('previewMedia_video_camera ret ', ret);
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
                                key={item.id}
                                className='api-page-btn'
                                type='primary'
                                onClick={item.func == null ? () => { } : item.func}
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
