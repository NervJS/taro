import Taro from '@tarojs/api'

import native from '../NativeApi'

export class NativeInnerAudioContext implements Taro.InnerAudioContext {
  autoplay: boolean
  buffered: number
  currentTime: number
  duration: number
  loop: boolean
  obeyMuteSwitch: boolean
  paused: boolean
  playbackRate: number
  src: string
  startTime: number
  volume: number
  private contextId: string

  constructor ()  {
    this.contextId = native.createInnerAudioContext()
  }

  static createInnerAudioContext () {
    return new NativeInnerAudioContext()
  }

  stop (): void {
    native.stop({ contextId: this.contextId })
  }

  play (): void {
    native.play({ contextId: this.contextId })
  }

  onStop (option: any): void {
    native.onStop({ listener: option, contextId: this.contextId })
  }

  onPlay (option: any): void {
    native.onPlay({ listener: option, contextId: this.contextId })
  }

  onEnded (option: any): void {
    native.onEnded({ listener: option, contextId: this.contextId })
  }

  onError (option: any): void {
    native.onError({ listener: option, contextId: this.contextId })
  }

  destroy (): void {
  }

  offCanplay (option: any): void {
    return option
  }

  offEnded (option: any): void {
    return option
  }

  offError (option: any): void {
    return option
  }

  offPause (option: any): void {
    return option
  }

  offPlay (option: any): void {
    return option
  }

  offSeeked (option: any): void {
    return option
  }

  offSeeking (option: any): void {
    return option
  }

  offStop (option: any): void {
    return option
  }

  offTimeUpdate (option: any): void {
    return option
  }

  offWaiting (option: any): void {
    return option
  }

  onCanplay (option: any): void {
    return option
  }

  onPause (option: any): void {
    return option
  }

  onSeeked (option: any): void {
    return option
  }

  onSeeking (option: any): void {
    return option
  }

  onTimeUpdate (option: any): void {
    return option
  }

  onWaiting (option: any): void {
    return option
  }

  pause (): void {
  }

  seek (option: any): void {
    return option
  }
}
