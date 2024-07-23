import { TaroElement } from './element'

import type { VideoProps } from '@tarojs/components/types'

@Observed
export class TaroVideoElement extends TaroElement<VideoProps> {
  controller: VideoController = new VideoController()

  constructor() {
    super('Video')

    this._nodeInfo._currentTime = 0
  }

  async play() {
    try {
      this.controller.start()
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  pause() {
    try {
      this.controller.pause()
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  stop() {
    try {
      this.controller.stop()
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  get currentTime() {
    return this._nodeInfo._currentTime
  }

  set currentTime(val: number) {
    this._nodeInfo._currentTime = val
    this.controller.setCurrentTime(val)
  }
}
