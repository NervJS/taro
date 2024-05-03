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
        id: 'chooseImage',
        inputData: {
          count: 7,
          sizeType: ['original'],
          sourceType: ['album'],
          imageId: ''
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('chooseImage')
          Taro.chooseImage({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'previewImage',
        inputData: {
          urls: [
            'http://www.baidu.com/img/bdlogo.png',
            'https://img1.baidu.com/it/u=698323844,3339950020&fm=253&app=138&size=w931&n=0&f=PNG&fmt=auto?sec=1694278800&t=60a09ae53f4ed052e28032d918935164',
            'https://img1.baidu.com/it/u=698323844,3339950020&fm=253&app=138&size=w931&n=0&f=PNG&fmt=auto?sec=1694278800&t=60a09ae53f4ed052e28032d918935164',
          ],
          current: '',
          showmenu: true,
          referrerPolicy: '',
          imageMenuPrevent: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('previewImage')
          Taro.previewImage({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'getImageInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('getImageInfo')
          Taro.chooseImage({
            success: (res) => {
              Taro.getImageInfo({
                src: res.tempFilePaths[0],
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              }).then((res) => {
                TestConsole.consoleResult.call(this, res, apiIndex)
              })
            },
            fail: (err) => {
              TestConsole.consoleNormal('chooseImage fail:', err)
            },
            complete: (com) => {
              TestConsole.consoleNormal('chooseImage complete', com)
            },
          }).then((ret) => {
            TestConsole.consoleNormal('chooseImage return', ret)
          })
        },
      },
      {
        id: 'saveImageToPhotosAlbum',
        func: (apiIndex) => {
          TestConsole.consoleTest('saveImageToPhotosAlbum')
          Taro.chooseImage({
            success: (res) => {
              TestConsole.consoleNormal('chooseImage success:', res)
              Taro.saveImageToPhotosAlbum({
                filePath: res.tempFilePaths[0],
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              }).then((res) => {
                TestConsole.consoleResult.call(this, res, apiIndex)
              })
            },
            fail: (err) => {
              TestConsole.consoleNormal('chooseImage fail:', err)
            },
            complete: (com) => {
              TestConsole.consoleNormal('chooseImage complete', com)
            },
          }).then((ret) => {
            TestConsole.consoleNormal('chooseImage return', ret)
          })
        },
      },
      {
        id: 'compressImage',
        func: (apiIndex) => {
          TestConsole.consoleTest('compressImage')
          Taro.chooseImage({
            success: (res) => {
              Taro.compressImage({
                quality: 1,
                src: res.tempFilePaths[0],
                compressedWidth: 300,
                compressHeight: 200,
                success: (res1) => {
                  TestConsole.consoleNormal('compressImage success ', res1)
                  Taro.saveImageToPhotosAlbum({
                    filePath: res1.tempFilePath,
                    success: (res2) => {
                      TestConsole.consoleNormal('saveImageToPhotosAlbum success ', res2)
                      Taro.getImageInfo({
                        src: res1.tempFilePath,
                        success: (res) => {
                          TestConsole.consoleNormal('compress later:getImageInfo success ', res)
                        },
                        fail: (res) => {
                          TestConsole.consoleNormal('compress later:getImageInfo fail ', res)
                        },
                        complete: (res) => {
                          TestConsole.consoleNormal('compress later:getImageInfo complete ', res)
                        },
                      })
                    },
                    fail: (res2) => {
                      TestConsole.consoleNormal('saveImageToPhotosAlbum fail ', res2)
                    },
                    complete: (res2) => {
                      TestConsole.consoleNormal('saveImageToPhotosAlbum complete ', res2)
                    },
                  })
                },
                fail: (res1) => {
                  TestConsole.consoleFail(res1)
                },
                complete: (res1) => {
                  TestConsole.consoleComplete(res1)
                },
              }).then((ret1) => {
                TestConsole.consoleResult(ret1)
              })
            },
          }).then((res) => {
            TestConsole.consoleNormal('compress before :chooseImage ret ', res.tempFiles[0].size)
          })
        },
      },
      {
        id: 'previewMedia_image',
        func: (apiIndex) => {
          TestConsole.consoleTest('previewMedia_image')
          Taro.chooseImage({
            success: (res) => {
              TestConsole.consoleNormal('chooseImage success:', res)
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
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              }).then((res) => {
                TestConsole.consoleResult.call(this, res, apiIndex)
              })
            },
            fail: (err) => {
              TestConsole.consoleNormal('chooseImage fail:', err)
            },
            complete: (com) => {
              TestConsole.consoleNormal('chooseImage complete', com)
            },
          }).then((ret) => {
            TestConsole.consoleNormal('chooseImage return', ret)
          })
        },
      },
      {
        id: 'previewMedia_video_album',
        func: (apiIndex) => {
          TestConsole.consoleTest('previewMedia_video_album')
          Taro.chooseVideo({
            sourceType: ['album'],
            maxDuration: 60,
            camera: 'back',
            success: (res) => {
              TestConsole.consoleNormal('chooseVideo success ', res)
              Taro.previewMedia({
                sources: [
                  {
                    url: res.tempFilePath,
                    type: 'video',
                    poster: 'test_video',
                  },
                ],
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              }).then((res) => {
                TestConsole.consoleResult.call(this, res, apiIndex)
              })
            },
            fail: (err) => {
              TestConsole.consoleNormal('chooseVideo fail:', err)
            },
            complete: (com) => {
              TestConsole.consoleNormal('chooseVideo complete', com)
            },
          }).then((ret) => {
            TestConsole.consoleNormal('chooseVideo return', ret)
          })
        },
      },
      {
        id: 'previewMedia_video_camera',
        func: (apiIndex) => {
          TestConsole.consoleTest('previewMedia_video_camera')
          Taro.chooseVideo({
            sourceType: ['camera'],
            maxDuration: 60,
            camera: 'back',
            success: (res) => {
              TestConsole.consoleNormal('chooseVideo success ', res)
              Taro.previewMedia({
                sources: [
                  {
                    url: res.tempFilePath,
                    type: 'video',
                    poster: 'test_video',
                  },
                ],
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              }).then((res) => {
                TestConsole.consoleResult.call(this, res, apiIndex)
              })
            },
            fail: (err) => {
              TestConsole.consoleNormal('chooseVideo fail:', err)
            },
            complete: (com) => {
              TestConsole.consoleNormal('chooseVideo complete', com)
            },
          }).then((ret) => {
            TestConsole.consoleNormal('chooseVideo return', ret)
          })
        },
      },
    ],
  }
  render () {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
