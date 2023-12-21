import { temporarilyNotSupport } from '../../utils'

import type Taro from '@tarojs/taro/types'

export class VideoContext implements Taro.VideoContext {
  exitBackgroundPlayback = temporarilyNotSupport('VideoContext.exitBackgroundPlayback')
  exitFullScreen = temporarilyNotSupport('VideoContext.exitFullScreen')
  exitPictureInPicture = temporarilyNotSupport('VideoContext.exitPictureInPicture')
  hideStatusBar = temporarilyNotSupport('VideoContext.hideStatusBar')
  pause = temporarilyNotSupport('VideoContext.pause')
  play = temporarilyNotSupport('VideoContext.play')
  playbackRate = temporarilyNotSupport('VideoContext.playbackRate')
  requestBackgroundPlayback = temporarilyNotSupport('VideoContext.requestBackgroundPlayback')
  requestFullScreen = temporarilyNotSupport('VideoContext.requestFullScreen')
  seek = temporarilyNotSupport('VideoContext.seek')
  sendDanmu = temporarilyNotSupport('VideoContext.sendDanmu')
  showStatusBar = temporarilyNotSupport('VideoContext.showStatusBar')
  stop = temporarilyNotSupport('VideoContext.stop')
}
