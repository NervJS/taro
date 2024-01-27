import Taro from '@tarojs/api'

import native from '../NativeApi'

export class NativeInnerAudioContext implements Taro.InnerAudioContext {
  private objectId: number

  constructor ()  {
    this.objectId = native.createInnerAudioContext()
  }

  get volume () {
    return native.getAudioContextVolume({}, this.objectId)
  }

  set volume (option: any) {
    native.setAudioContextVolume(option, this.objectId)
  }

  get startTime () {
    return native.getAudioContextStartTime({}, this.objectId)
  }

  set startTime (option: any) {
    native.setAudioContextStartTime(option, this.objectId)
  }

  get playbackRate () {
    return native.getAudioContextPlaybackRate({}, this.objectId)
  }

  set playbackRate (option: any) {
    native.setAudioContextPlaybackRate(option, this.objectId)
  }

  get paused () {
    return native.getAudioContextPaused({}, this.objectId)
  }

  set paused (option: any) {
    native.setAudioContextPaused(option, this.objectId)
  }

  get obeyMuteSwitch () {
    return native.getAudioContextObeyMuteSwitch({}, this.objectId)
  }

  set obeyMuteSwitch (option: any) {
    native.setAudioContextObeyMuteSwitch(option, this.objectId)
  }

  get loop () {
    return native.getAudioContextLoop({}, this.objectId)
  }

  set loop (option: any) {
    native.setAudioContextLoop(option, this.objectId)
  }

  get duration () {
    return native.getAudioContextDuration({}, this.objectId)
  }

  set duration (option: any) {
    native.setAudioContextDuration(option, this.objectId)
  }

  get currentTime () {
    return native.getAudioContextCurrentTime({}, this.objectId)
  }

  set currentTime (option: any) {
    native.setAudioContextCurrentTime(option, this.objectId)
  }

  get buffered () {
    return native.getAudioContextBuffered({}, this.objectId)
  }

  set buffered (option: any) {
    native.setAudioContextBuffered(option, this.objectId)
  }

  get autoplay () {
    return native.getAudioContextAutoplay({}, this.objectId)
  }

  set autoplay (option: any) {
    native.setAudioContextAutoplay(option, this.objectId)
  }

  get src () {
    return native.getAudioContextSrc({}, this.objectId)
  }

  set src (option: any) {
    native.setAudioContextSrc(option, this.objectId)
  }

  static createInnerAudioContext () {
    return new NativeInnerAudioContext()
  }

  stop (): void {
    native.innerAudioStop({}, this.objectId)
  }

  play (): void {
    native.innerAudioPlay({}, this.objectId)
  }

  onStop (option: any): void {
    native.innerAudioOnStop(option, this.objectId)
  }

  onPlay (option: any): void {
    native.innerAudioOnPlay(option, this.objectId)
  }

  onEnded (option: any): void {
    native.innerAudioOnEnded(option, this.objectId)
  }

  onError (option: any): void {
    native.innerAudioOnError(option, this.objectId)
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
