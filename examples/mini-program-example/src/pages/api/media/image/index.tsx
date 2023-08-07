import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

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
          TestConsole.consoleTest('chooseImage_album')
          Taro.chooseImage({
            count: 7,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: function (res) {
              TestConsole.consoleSuccess(res)
            },
            fail: function (res) {
              TestConsole.consoleFail(res)
            },
            complete: function (res) {
              TestConsole.consoleComplete(res)
            },
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'chooseImage_camera',
        func: () => {
          TestConsole.consoleTest('chooseImage_camera')
          Taro.chooseImage({
            count: 5,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: function (res) {
              TestConsole.consoleSuccess(res)
            },
            fail: function (res) {
              TestConsole.consoleFail(res)
            },
            complete: function (res) {
              TestConsole.consoleComplete(res)
            },
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'chooseImage_user',
        func: () => {
          TestConsole.consoleTest('chooseImage_user')
          Taro.chooseImage({
            count: 7,
            sizeType: ['original', 'compressed'],
            sourceType: ['user'],
            success: function (res) {
              TestConsole.consoleSuccess(res)
            },
            fail: function (res) {
              TestConsole.consoleFail(res)
            },
            complete: function (res) {
              TestConsole.consoleComplete(res)
            },
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'chooseImage_environment',
        func: () => {
          TestConsole.consoleTest('chooseImage_environment')
          Taro.chooseImage({
            count: 5,
            sizeType: ['original', 'compressed'],
            sourceType: ['environment'],
            success: function (res) {
              TestConsole.consoleSuccess(res)
            },
            fail: function (res) {
              TestConsole.consoleFail(res)
            },
            complete: function (res) {
              TestConsole.consoleComplete(res)
            },
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'previewImage',
        func: () => {
          TestConsole.consoleTest('previewImage')
          Taro.chooseImage({
            count: 3,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
              TestConsole.consoleNormal('chooseImage success')
              Taro.previewImage({
                urls: res.tempFilePaths,
                current: 'test/currentField',
                showmenu: false,
                referrerPolicy: 'origin',
                success: function (res) {
                  TestConsole.consoleSuccess(res)
                },
                fail: function (res) {
                  TestConsole.consoleFail(res)
                },
                complete: function (res) {
                  TestConsole.consoleComplete(res)
                },
              }).then((ret) => {
                TestConsole.consoleReturn(ret)
              })
            },
            fail: function (res) {
              TestConsole.consoleFail(res)
            },
            complete: function (res) {
              TestConsole.consoleComplete(res)
            },
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'getImageInfo',
        func: () => {
          TestConsole.consoleTest('getImageInfo')
          Taro.chooseImage({
            success: function (res) {
              Taro.getImageInfo({
                src: res.tempFilePaths[0],
                success: function (res) {
                  TestConsole.consoleSuccess(res)
                },
                fail: function (res) {
                  TestConsole.consoleFail(res)
                },
                complete: function (res) {
                  TestConsole.consoleComplete(res)
                },
              }).then((res) => {
                TestConsole.consoleReturn(res)
              })
            },
          })
        },
      },
      {
        id: 'saveImageToPhotosAlbum',
        func: () => {
          TestConsole.consoleTest('saveImageToPhotosAlbum')
          Taro.chooseImage({
            success: function (res) {
              Taro.saveImageToPhotosAlbum({
                filePath: res.tempFilePaths[0],
                success: function (res) {
                  TestConsole.consoleSuccess(res)
                },
                fail: function (res) {
                  TestConsole.consoleFail(res)
                },
                complete: function (res) {
                  TestConsole.consoleComplete(res)
                },
              }).then((ret) => {
                TestConsole.consoleReturn(ret)
              })
            },
          })
        },
      },
      {
        id: 'compressImage',
        func: () => {
          TestConsole.consoleTest('compressImage')
          Taro.chooseImage({
            success: function (res) {
              Taro.compressImage({
                quality: 1,
                src: res.tempFilePaths[0],
                compressedWidth: 300,
                compressHeight: 200,
                success: function (res1) {
                  TestConsole.consoleNormal('compressImage success ', res1)
                  Taro.saveImageToPhotosAlbum({
                    filePath: res1.tempFilePath,
                    success: function (res2) {
                      TestConsole.consoleNormal('saveImageToPhotosAlbum success ', res2)
                      Taro.getImageInfo({
                        src: res1.tempFilePath,
                        success: function (res) {
                          TestConsole.consoleNormal('compress later:getImageInfo success ', res)
                        },
                        fail: function (res) {
                          TestConsole.consoleNormal('compress later:getImageInfo fail ', res)
                        },
                        complete: function (res) {
                          TestConsole.consoleNormal('compress later:getImageInfo complete ', res)
                        },
                      })
                    },
                    fail: function (res2) {
                      TestConsole.consoleNormal('saveImageToPhotosAlbum fail ', res2)
                    },
                    complete: function (res2) {
                      TestConsole.consoleNormal('saveImageToPhotosAlbum complete ', res2)
                    },
                  })
                },
                fail: function (res1) {
                  TestConsole.consoleFail(res1)
                },
                complete: function (res1) {
                  TestConsole.consoleComplete(res1)
                },
              }).then((ret1) => {
                TestConsole.consoleReturn(ret1)
              })
            },
          }).then((res) => {
            TestConsole.consoleNormal('compress before :chooseImage ret ', res.tempFiles[0].size)
          })
        },
      },
      {
        id: 'previewMedia_image',
        func: () => {
          TestConsole.consoleTest('previewMedia_image')
          Taro.chooseImage({
            success: function (res) {
              Taro.previewMedia({
                sources: [
                  {
                    url: res.tempFilePaths[0],
                    type: 'image',
                    poster: 'test',
                  },
                ],
                current: 0,
                showmenu: false,
                referrerPolicy: 'origin',
                success: function (res) {
                  TestConsole.consoleSuccess(res)
                },
                fail: function (res) {
                  TestConsole.consoleFail(res)
                },
                complete: function (res) {
                  TestConsole.consoleComplete(res)
                },
              }).then((ret) => {
                TestConsole.consoleReturn(ret)
              })
            },
          })
        },
      },
      {
        id: 'previewMedia_video_album',
        func: () => {
          TestConsole.consoleTest('previewMedia_video_album')
          Taro.chooseVideo({
            sourceType: ['album'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              TestConsole.consoleNormal('chooseMedia success ', res)
              Taro.previewMedia({
                sources: [
                  {
                    url: res.tempFilePath,
                    type: 'video',
                    poster: 'test_video',
                  },
                ],
                success: function (res) {
                  TestConsole.consoleSuccess(res)
                },
                fail: function (res) {
                  TestConsole.consoleFail(res)
                },
                complete: function (res) {
                  TestConsole.consoleComplete(res)
                },
              }).then((ret) => {
                TestConsole.consoleReturn(ret)
              })
            },
          })
        },
      },
      {
        id: 'previewMedia_video_camera',
        func: () => {
          TestConsole.consoleTest('previewMedia_video_camera')
          Taro.chooseVideo({
            sourceType: ['camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              TestConsole.consoleNormal('chooseMedia success ', res)
              Taro.previewMedia({
                sources: [
                  {
                    url: res.tempFilePath,
                    type: 'video',
                    poster: 'test_video',
                  },
                ],
                success: function (res) {
                  TestConsole.consoleSuccess(res)
                },
                fail: function (res) {
                  TestConsole.consoleFail(res)
                },
                complete: function (res) {
                  TestConsole.consoleComplete(res)
                },
              }).then((ret) => {
                TestConsole.consoleReturn(ret)
              })
            },
          })
        },
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
