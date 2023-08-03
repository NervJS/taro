import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Video } from '@tarojs/components'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 媒体-视频
 * @returns
 */
let videoContext
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'saveVideoToPhotosAlbum',
        func: () => {
          TestConsole.consoleTest('saveVideoToPhotosAlbum')
          Taro.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              Taro.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
                success: (res) => {
                  TestConsole.consoleSuccess(res)
                },
                fail: (res) => {
                  TestConsole.consoleFail(res)
                },
                complete: (res) => {
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
        id: 'openVideoEditor',
        func: () => {
          TestConsole.consoleTest('openVideoEditor')
          Taro.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              Taro.openVideoEditor({
                filePath: res.tempFilePath,
                success: (res) => {
                  TestConsole.consoleSuccess(res)
                },
                fail: (res) => {
                  TestConsole.consoleFail(res)
                },
                complete: (res) => {
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
        id: 'getVideoInfo',
        func: () => {
          TestConsole.consoleTest('getVideoInfo')
          Taro.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              Taro.getVideoInfo({
                src: res.tempFilePath,
                success: (res) => {
                  TestConsole.consoleSuccess(res)
                },
                fail: (res) => {
                  TestConsole.consoleFail(res)
                },
                complete: (res) => {
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
        id: 'createVideoContext',
        func: () => {
          TestConsole.consoleTest('createVideoContext')
          videoContext = Taro.createVideoContext('myVideo')
          TestConsole.consoleNormal('createVideoContext ', videoContext)
        },
      },
      {
        id: 'compressVideo_暂不支持',
        func: null,
      },
      {
        id: 'chooseVideo_album',
        func: () => {
          TestConsole.consoleTest('chooseVideo_album')
          Taro.chooseVideo({
            sourceType: ['album'],
            maxDuration: 60,
            camera: 'back',
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'chooseVideo_camera',
        func: () => {
          TestConsole.consoleTest('chooseVideo_camera')
          Taro.chooseVideo({
            sourceType: ['camera'],
            maxDuration: 60,
            camera: 'back',
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'chooseMedia_image',
        func: () => {
          TestConsole.consoleTest('chooseMedia_image')
          Taro.chooseMedia({
            count: 9,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            maxDuration: 30,
            camera: 'back',
            sizeType: ['original', 'compressed'],
            // mediaId: 'test mediaId field',//'mediaId' does not exist in type 'Option'
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'videoContext_exitBackgroundPlayback_暂不支持',
        func: () => {
          TestConsole.consoleTest('videoContext_exitBackgroundPlayback')
          videoContext.exitBackgroundPlayback()
          TestConsole.consoleNormal('exitBackgroundPlayback')
        },
      },
      {
        id: 'videoContext_exitFullScreen',
        func: () => {
          TestConsole.consoleTest('videoContext_exitFullScreen')
          videoContext.exitFullScreen()
          TestConsole.consoleNormal('exitFullScreen')
        },
      },
      {
        id: 'videoContext_exitPictureInPicture_暂不支持',
        func: () => {
          TestConsole.consoleTest('videoContext_exitPictureInPicture')
          videoContext.exitPictureInPicture({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'videoContext_hideStatusBar_暂不支持',
        func: () => {
          TestConsole.consoleTest('videoContext_hideStatusBar')
          videoContext.hideStatusBar()
          TestConsole.consoleNormal('hideStatusBar')
        },
      },
      {
        id: 'videoContext_pause',
        func: () => {
          TestConsole.consoleTest('videoContext_pause')
          videoContext.pause()
          TestConsole.consoleNormal('pause')
        },
      },
      {
        id: 'videoContext_play',
        func: () => {
          TestConsole.consoleTest('videoContext_play')
          videoContext.play()
          TestConsole.consoleNormal('play')
        },
      },
      {
        id: 'videoContext_playbackRate_暂不支持',
        func: () => {
          TestConsole.consoleTest('videoContext_playbackRate')
          videoContext.playbackRate(1.5)
          TestConsole.consoleNormal('playbackRate')
        },
      },
      {
        id: 'videoContext_requestBackgroundPlayback_暂不支持',
        func: () => {
          TestConsole.consoleTest('videoContext_requestBackgroundPlayback')
          videoContext.requestBackgroundPlayback()
          TestConsole.consoleNormal('requestBackgroundPlayback')
        },
      },
      {
        id: 'videoContext_requestFullScreen',
        func: () => {
          TestConsole.consoleTest('videoContext_requestFullScreen')
          videoContext.requestFullScreen({
            direction: 0,
          })
          TestConsole.consoleNormal('requestFullScreen')
        },
      },
      {
        id: 'videoContext_seek',
        func: () => {
          TestConsole.consoleTest('videoContext_seek')
          videoContext.seek(5)
          TestConsole.consoleNormal('seek')
        },
      },
      {
        id: 'videoContext_sendDanmu_暂不支持',
        func: () => {
          TestConsole.consoleTest('videoContext_sendDanmu')
          videoContext.sendDanmu({
            text: '测试弹幕',
            color: '#FFF',
          })
          TestConsole.consoleNormal('sendDanmu')
        },
      },
      {
        id: 'videoContext_showStatusBar_暂不支持',
        func: () => {
          TestConsole.consoleTest('videoContext_showStatusBar')
          videoContext.showStatusBar()
          TestConsole.consoleNormal('showStatusBar')
        },
      },
      {
        id: 'videoContext_stop',
        func: () => {
          TestConsole.consoleTest('videoContext_stop')
          videoContext.stop()
          TestConsole.consoleNormal('stop')
        },
      },
    ],
  }
  render () {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => { } : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
        <Video id='myVideo' src='https://storage.360buyimg.com/jdrd-blog/27.mp3' />
      </View>
    )
  }
}
