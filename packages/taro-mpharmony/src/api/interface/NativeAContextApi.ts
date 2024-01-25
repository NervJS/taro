import Taro from '@tarojs/api'

import native from '../NativeApi'

export class NativeInnerAudioContext implements Taro.InnerAudioContext {
  private contextId: string

  constructor ()  {
    this.contextId = native.createInnerAudioContext()
  }

  get volume () {
    return native.getAudioContextVolume({ contextId: this.contextId })
  }

  set volume (option: any) {
    native.setAudioContextVolume({ listener: option, contextId: this.contextId })
  }

  get startTime () {
    return native.getAudioContextStartTime({ contextId: this.contextId })
  }

  set startTime (option: any) {
    native.setAudioContextStartTime({ listener: option, contextId: this.contextId })
  }

  get playbackRate () {
    return native.getAudioContextPlaybackRate({ contextId: this.contextId })
  }

  set playbackRate (option: any) {
    native.setAudioContextPlaybackRate({ listener: option, contextId: this.contextId })
  }

  get paused () {
    return native.getAudioContextPaused({ contextId: this.contextId })
  }

  set paused (option: any) {
    native.setAudioContextPaused({ listener: option, contextId: this.contextId })
  }

  get obeyMuteSwitch () {
    return native.getAudioContextObeyMuteSwitch({ contextId: this.contextId })
  }

  set obeyMuteSwitch (option: any) {
    native.setAudioContextObeyMuteSwitch({ listener: option, contextId: this.contextId })
  }

  get loop () {
    return native.getAudioContextLoop({ contextId: this.contextId })
  }

  set loop (option: any) {
    native.setAudioContextLoop({ listener: option, contextId: this.contextId })
  }

  get duration () {
    return native.getAudioContextDuration({ contextId: this.contextId })
  }

  set duration (option: any) {
    native.setAudioContextDuration({ listener: option, contextId: this.contextId })
  }

  get currentTime () {
    return native.getAudioContextCurrentTime({ contextId: this.contextId })
  }

  set currentTime (option: any) {
    native.setAudioContextCurrentTime({ listener: option, contextId: this.contextId })
  }

  get buffered () {
    return native.getAudioContextBuffered({ contextId: this.contextId })
  }

  set buffered (option: any) {
    native.setAudioContextBuffered({ listener: option, contextId: this.contextId })
  }

  get autoplay () {
    return native.getAudioContextAutoplay({ contextId: this.contextId })
  }

  set autoplay (option: any) {
    native.setAudioContextAutoplay({ listener: option, contextId: this.contextId })
  }

  get src () {
    return native.getAudioContextSrc({ contextId: this.contextId })
  }

  set src (option: any) {
    native.setAudioContextSrc({ listener: option, contextId: this.contextId })
  }

  static createInnerAudioContext () {
    return new NativeInnerAudioContext()
  }

  stop (): void {
    native.innerAudioStop({ contextId: this.contextId })
  }

  play (): void {
    native.innerAudioPlay({ contextId: this.contextId })
  }

  onStop (option: any): void {
    native.innerAudioOnStop({ listener: option, contextId: this.contextId })
  }

  onPlay (option: any): void {
    native.innerAudioOnPlay({ listener: option, contextId: this.contextId })
  }

  onEnded (option: any): void {
    native.innerAudioOnEnded({ listener: option, contextId: this.contextId })
  }

  onError (option: any): void {
    native.innerAudioOnError({ listener: option, contextId: this.contextId })
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
