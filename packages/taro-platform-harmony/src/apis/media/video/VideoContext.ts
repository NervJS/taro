// @ts-nocheck
import { document } from '@tarojs/runtime'

import { temporarilyNotSupport } from '../../utils'

import type { TaroVideoElement } from '@tarojs/runtime'
import type Taro from '@tarojs/taro/types'

export class VideoContext implements Taro.VideoContext {
  id: string

  video: TaroVideoElement

  controller: VideoController

  constructor (id: string) {
    this.id = id
    this.video = document.getElementById(id)

    if (this.video) {
      this.controller = this.video.controller
    }
  }

  play () {
    if (!this.controller) return

    this.controller.play()
  }

  pause () {
    if (!this.controller) return

    this.controller.pause()
  }

  stop () {
    if (!this.controller) return

    this.controller.stop()
  }

  seek (position: number) {
    if (!this.controller) return

    this.controller.setCurrentTime(position)
  }

  requestFullScreen () {
    if (!this.controller) return

    this.controller.requestFullscreen(true)
  }

  exitFullScreen () {
    if (!this.controller) return

    this.controller.exitFullscreen()
  }

  requestBackgroundPlayback = temporarilyNotSupport('VideoContext.requestBackgroundPlayback')
  exitBackgroundPlayback = temporarilyNotSupport('VideoContext.exitBackgroundPlayback')
  exitPictureInPicture = temporarilyNotSupport('VideoContext.exitPictureInPicture')
  hideStatusBar = temporarilyNotSupport('VideoContext.hideStatusBar')
  playbackRate = temporarilyNotSupport('VideoContext.playbackRate')
  sendDanmu = temporarilyNotSupport('VideoContext.sendDanmu')
  showStatusBar = temporarilyNotSupport('VideoContext.showStatusBar')
}
