import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Video } from '@tarojs/components'
import './index.scss'

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
          Taro.chooseVideo({
            sourceType: ['album', 'camera'],
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
                complete: function (res) {
                  console.log('saveVideoToPhotosAlbum complete ', res.errMsg)
                },
              }).then((ret) => {
                console.log('saveVideoToPhotosAlbum ret ', ret)
              })
            },
          })
        },
      },
      {
        id: 'openVideoEditor',
        func: () => {
          Taro.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              Taro.openVideoEditor({
                filePath: res.tempFilePath,
                success(res) {
                  console.log('openVideoEditor success ', res)
                },
                fail(res) {
                  console.log('openVideoEditor fail ', res)
                },
              }).then((ret) => {
                console.log('openVideoEditor ret ', ret.duration, ret.size, ret.tempFilePath, ret.tempThumbPath)
              })
            },
          })
        },
      },
      {
        id: 'getVideoInfo',
        func: () => {
          Taro.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              Taro.getVideoInfo({
                src: res.tempFilePath,
                success(res) {
                  console.log('getVideoInfo success ', res)
                },
                fail(res) {
                  console.log('getVideoInfo fail ', res)
                },
                complete: function (res) {
                  console.log('getVideoInfo complete ', res.errMsg)
                },
              }).then((ret) => {
                console.log('getVideoInfo ret ', ret)
              })
            },
          })
        },
      },
      {
        id: 'createVideoContext',
        func: () => {
          videoContext = Taro.createVideoContext('myVideo')
          console.log('createVideoContext ', videoContext)
        },
      },
      {
        id: 'compressVideo_暂不支持',
        func: null,
      },
      {
        id: 'chooseVideo_album',
        func: () => {
          Taro.chooseVideo({
            sourceType: ['album'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              console.log(
                'chooseVideo success ',
                res.tempFilePath,
                res.duration,
                res.height,
                res.size,
                res.width,
                res.errMsg
              )
            },
            fail: function (res) {
              console.log('chooseVideo fail ', res.errMsg)
            },
            complete: function (res) {
              console.log('chooseVideo complete ', res.errMsg)
            },
          }).then((ret) => {
            console.log('chooseVideo_album ret ', ret)
          })
        },
      },
      {
        id: 'chooseVideo_camera',
        func: () => {
          Taro.chooseVideo({
            sourceType: ['camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              console.log(
                'chooseVideo success ',
                res.tempFilePath,
                res.duration,
                res.height,
                res.size,
                res.width,
                res.errMsg
              )
            },
            fail: function (res) {
              console.log('chooseVideo fail ', res.errMsg)
            },
            complete: function (res) {
              console.log('chooseVideo complete ', res.errMsg)
            },
          }).then((ret) => {
            console.log('chooseVideo_camera ret ', ret)
          })
        },
      },
      {
        id: 'chooseMedia_image',
        func: () => {
          Taro.chooseMedia({
            count: 9,
            mediaType: ['image'],
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
          }).then((ret) => {
            console.log('chooseVideo ret ', ret)
          })
        },
      },
      {
        id: 'videoContext_exitBackgroundPlayback_暂不支持',
        func: () => {
          videoContext.exitBackgroundPlayback()
          console.log('exitBackgroundPlayback')
        },
      },
      {
        id: 'videoContext_exitFullScreen',
        func: () => {
          videoContext.exitFullScreen()
          console.log('exitFullScreen')
        },
      },
      {
        id: 'videoContext_exitPictureInPicture_暂不支持',
        func: () => {
          videoContext.exitPictureInPicture({
            success: (res) => {
              console.log('videoContext.exitPictureInPicture success ', res)
            },
            fail: (res) => {
              console.log('videoContext.exitPictureInPicture fail ', res)
            },
            complete: (res) => {
              console.log('videoContext.exitPictureInPicture complete ', res)
            },
          })
        },
      },
      {
        id: 'videoContext_hideStatusBar_暂不支持',
        func: () => {
          videoContext.hideStatusBar()
          console.log('hideStatusBar')
        },
      },
      {
        id: 'videoContext_pause',
        func: () => {
          videoContext.pause()
          console.log('pause')
        },
      },
      {
        id: 'videoContext_play',
        func: () => {
          videoContext.play()
          console.log('play')
        },
      },
      {
        id: 'videoContext_playbackRate_暂不支持',
        func: () => {
          videoContext.playbackRate(1.5)
          console.log('playbackRate')
        },
      },
      {
        id: 'videoContext_requestBackgroundPlayback_暂不支持',
        func: () => {
          videoContext.requestBackgroundPlayback()
          console.log('requestBackgroundPlayback')
        },
      },
      {
        id: 'videoContext_requestFullScreen',
        func: () => {
          videoContext.requestFullScreen({
            direction: 0,
          })
          console.log('requestFullScreen')
        },
      },
      {
        id: 'videoContext_seek',
        func: () => {
          videoContext.seek(5)
          console.log('seek')
        },
      },
      {
        id: 'videoContext_sendDanmu_暂不支持',
        func: () => {
          videoContext.sendDanmu({
            text: '测试弹幕',
            color: '#FFF',
          })
          console.log('sendDanmu')
        },
      },
      {
        id: 'videoContext_showStatusBar_暂不支持',
        func: () => {
          videoContext.showStatusBar()
          console.log('showStatusBar')
        },
      },
      {
        id: 'videoContext_stop',
        func: () => {
          videoContext.stop()
          console.log('stop')
        },
      },
    ],
  }
  render() {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
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
