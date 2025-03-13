import { TaroElement } from './element'

import type { VideoProps } from '@tarojs/components/types'
import type { TaroAny } from '../../interface'

export class TaroVideoController {
  private _element: TaroAny

  constructor(element: TaroAny) {
    this._element = element
  }

  setCurrentTime(val: number) {
    this._element.currentTime = val
  }

  requestFullscreen() {
    this._element.requestFullscreen()
  }

  exitFullscreen() {
    this._element.exitFullscreen()
  }

  start() {
    this._element.play()
  }

  pause() {
    this._element.pause()
  }

  stop() {
    this._element.stop()
  }

  reset() {
    this._element.reset()
  }
}

export class TaroVideoElement extends TaroElement<VideoProps> {
  controller: TaroVideoController

  constructor() {
    super('Video')
  }

  controller = new TaroVideoController(this)

  async play() {
    try {
      nativeVideoController.exec(this._nid, 'play')
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  pause() {
    try {
      nativeVideoController.exec(this._nid, 'pause')
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  stop() {
    try {
      nativeVideoController.exec(this._nid, 'stop')
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  reset() {
    try {
      nativeVideoController.exec(this._nid, 'reset')
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  requestFullscreen() {
    try {
      nativeVideoController.exec(this._nid, 'requestFullscreen')
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  exitFullscreen() {
    try {
      nativeVideoController.exec(this._nid, 'exitFullscreen')
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  get currentTime() {
    return nativeVideoController.getCurrentTime(this._nid)
  }

  set currentTime(val: number) {
    nativeVideoController.setCurrentTime(this._nid, val)
  }

  dispose () {
    this.controller = null
  }
}
