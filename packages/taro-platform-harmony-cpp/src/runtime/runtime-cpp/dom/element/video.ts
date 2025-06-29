import { TaroElement } from './element'

import type { VideoProps } from '@tarojs/components/types'
import type { TaroAny } from '../../interface'

export class TaroVideoElement extends TaroElement<VideoProps> {
  controller: VideoController

  isETS = true

  constructor() {
    super('Video')

    this._nodeInfo._currentTime = 0
  }

  public setAttribute(name: string, value: TaroAny): void {
    super.setAttribute(name, value)

    // Note: 使用 @ComponentV2 时，需要在 struct 将参数声明为 @Local 并在此更新
    if (this._instance) {
      const attrName = `attr${name.charAt(0).toUpperCase()}${name.slice(1)}`
      this._instance[attrName] = value
    }
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

  dispose () {
    this.controller = null
  }
}
