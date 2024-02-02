import Taro from '@tarojs/api'

/**
 * AudioContext 实例
 * 
 * @canUse AudioContext
 * @__class [pause, play, seek, setSrc]
 */
export class AudioContext implements Taro.AudioContext {
  Instance?: HTMLAudioElement

  constructor () {
    this.Instance = new Audio()

    Taro.eventCenter.on('__taroRouterChange', () => {
      this.stop()
    })
  }

  get paused () {
    return this.Instance?.paused ?? true
  }

  get src () {
    return this.Instance?.src || ''
  }

  set src (e) {
    this.setProperty('src', e)
  }

  private setProperty (key: string, value: unknown) {
    if (this.Instance) {
      this.Instance[key] = value
    }
  }

  play = () => this.Instance?.play()

  pause = () => this.Instance?.pause()

  stop = () => {
    this.pause()
    this.seek(0)
  }

  seek = (position: number) => {
    if (this.Instance) {
      this.Instance.currentTime = position
    }
  }

  setSrc = (src: string) => {
    if (this.Instance) {
      this.Instance.src = src
    }
  }
}
