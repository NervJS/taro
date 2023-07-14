import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 文件
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'saveFile',
                func: () => {
                    Taro.chooseImage({
                        success: function (res) {
                          var tempFilePaths = res.tempFilePaths
                          Taro.saveFile({
                            tempFilePath: tempFilePaths[0],
                            success: function (res) {
                              console.log('saveFile success ', res.savedFilePath, res.errMsg)
                            },
                            fail: function (res) {
                                console.log('saveFile fail ', res.errMsg)
                            },
                          })
                        }
                    })
                },
            }, 
            {
                id: 'getSavedFileList',
                func: () => {
                    Taro.getSavedFileList({
                        success: function (res) {
                          console.log('getSavedFileList success ', res.fileList, res.errMsg)
                        },
                        fail: function (res) {
                            console.log('getSavedFileList fail', res.errMsg)
                        },
                    })
                },
            }, 
            {
                id: 'getSavedFileInfo',
                func: () => {
                    Taro.chooseImage({
                        success: function (res) {
                          var tempFilePaths = res.tempFilePaths
                          Taro.saveFile({
                            tempFilePath: tempFilePaths[0],
                            success: function (res) {
                              console.log('saveFile success ', res.savedFilePath, res.errMsg)
                              Taro.getSavedFileInfo({
                                filePath: res.savedFilePath,
                                success: function (res) {
                                  console.log('getSavedFileInfo success', res.size, res.createTime)
                                },
                                fail: function (res) {
                                  console.log('getSavedFileInfo fail', res.errMsg)
                                },
                              })
                            },
                            fail: function (res) {
                                console.log('saveFile fail ', res.errMsg)
                            },
                          })
                        }
                    })
                },
            },
            {
                id: 'getFileInfo',
                func: () => {
                    Taro.chooseImage({
                        success: function (res) {
                          var tempFilePaths = res.tempFilePaths
                          Taro.saveFile({
                            tempFilePath: tempFilePaths[0],
                            success: function (res) {
                              console.log('saveFile success ', res.savedFilePath, res.errMsg)
                              Taro.getFileInfo({
                                filePath: res.savedFilePath,
                                success: function (res) {
                                  console.log('getFileInfo success', res.size, res.digest)
                                },
                                fail: function (res) {
                                  console.log('getFileInfo fail', res.errMsg)
                                },
                              })
                            },
                            fail: function (res) {
                                console.log('saveFile fail ', res.errMsg)
                            },
                          })
                        }
                    })
                },
            },
            {
                id: 'removeSavedFile',
                func: () => {
                    Taro.getSavedFileList({
                        success: function (res) {
                            console.log('getSavedFileList success ', res.fileList, res.errMsg)
                            if (res.fileList.length > 0){
                                Taro.removeSavedFile({
                                    filePath: res.fileList[0].filePath,
                                    success: function(res) {
                                        console.log('removeSavedFile success ', res.errMsg)
                                    },
                                    fail: function(res) {
                                        console.log('removeSavedFile fail ', res.errMsg)
                                    },
                                })
                            }
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
