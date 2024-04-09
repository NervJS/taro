import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Video } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
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
        inputData: {
          sourceType: ['album'],
          maxDuration: 60,
          camera: 'back',
          compressed: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('saveVideoToPhotosAlbum')
          Taro.chooseVideo({
            ...data,
            success: (res) => {
              TestConsole.consoleNormal('chooseVideo success ', res)
              Taro.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
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
        id: 'openVideoEditor_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('openVideoEditor')
          Taro.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: (res) => {
              Taro.openVideoEditor({
                filePath: res.tempFilePath,
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
        id: 'getVideoInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('getVideoInfo')
          Taro.chooseVideo({
            sourceType: ['album'],
            maxDuration: 60,
            camera: 'back',
            compressed: false,
            success: (res) => {
              TestConsole.consoleNormal('chooseVideo success ', res)
              Taro.getVideoInfo({
                src: res.tempFilePath,
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
        id: 'compressVideo_暂不支持',
        inputData: {
          quality: 'high',
          bitrate: 1032,
          fps: 24,
          resolution: 0.5,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('compressVideo')
          Taro.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            compressed: false,
            success: (res) => {
              Taro.compressVideo({
                src: res.tempFilePath,
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
        id: 'chooseVideo',
        inputData: {
          camera: '',
          compressed: false,
          sourceType: ['album'],
          maxDuration: 30,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('chooseVideo')
          Taro.chooseVideo({
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
        id: 'chooseMedia',
        inputData: {
          count: 9,
          mediaType: ['image'],
          sourceType: ['album', 'camera'],
          maxDuration: 30,
          sizeType: ['original', 'compressed'],
          camera: 'back',
          mediaId: '',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('chooseMedia')
          Taro.chooseMedia({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'createVideoContext',
        func: (apiIndex) => {
          TestConsole.consoleTest('createVideoContext')
          videoContext = Taro.createVideoContext('myVideo')
          TestConsole.consoleResult.call(this, videoContext, apiIndex)
        },
      },
      {
        id: 'video_exitBackgroundPlayback_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_exitBackgroundPlayback')
          videoContext.exitBackgroundPlayback()
          TestConsole.consoleNormal('exitBackgroundPlayback')
        },
      },
      {
        id: 'video_exitFullScreen',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_exitFullScreen')
          videoContext.exitFullScreen()
          TestConsole.consoleNormal('exitFullScreen')
        },
      },
      {
        id: 'video_exitPictureInPicture_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_exitPictureInPicture')
          videoContext
            .exitPictureInPicture({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
            .then((res) => {
              TestConsole.consoleResult.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'video_hideStatusBar_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_hideStatusBar')
          videoContext.hideStatusBar()
          TestConsole.consoleNormal('hideStatusBar')
        },
      },
      {
        id: 'video_pause',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_pause')
          videoContext.pause()
          TestConsole.consoleNormal('pause')
        },
      },
      {
        id: 'video_play',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_play')
          videoContext.play()
          TestConsole.consoleNormal('play')
        },
      },
      {
        id: 'video_playbackRate_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_playbackRate')
          videoContext.playbackRate(1.5)
          TestConsole.consoleNormal('playbackRate')
        },
      },
      {
        id: 'video_requestBackgroundPlayback_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_requestBackgroundPlayback')
          videoContext.requestBackgroundPlayback()
          TestConsole.consoleNormal('requestBackgroundPlayback')
        },
      },
      {
        id: 'video_requestFullScreen',
        inputData: {
          direction: 0,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('videoContext_requestFullScreen')
          videoContext.requestFullScreen({
            ...data,
          })
          setTimeout(() => {
            videoContext.exitFullScreen()
            TestConsole.consoleNormal('exitFullScreen')
          }, 8000)

          TestConsole.consoleNormal('requestFullScreen')
        },
      },
      {
        id: 'video_seek',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_seek')
          videoContext.seek(5)
          TestConsole.consoleNormal('seek')
        },
      },
      {
        id: 'video_sendDanmu_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_sendDanmu')
          videoContext.sendDanmu({
            text: '测试弹幕',
            color: '#FFF',
          })
          TestConsole.consoleNormal('sendDanmu')
        },
      },
      {
        id: 'video_showStatusBar_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_showStatusBar')
          videoContext.showStatusBar()
          TestConsole.consoleNormal('showStatusBar')
        },
      },
      {
        id: 'video_stop',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_stop')
          videoContext.stop()
          TestConsole.consoleNormal('stop')
        },
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
        <Video id='myVideo' src='https://storage.360buyimg.com/jdrd-blog/27.mp3' />
      </View>
    )
  }
}
