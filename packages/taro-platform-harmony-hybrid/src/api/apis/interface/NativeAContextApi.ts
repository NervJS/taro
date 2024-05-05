import Taro from '@tarojs/api'

import native from '../NativeApi'

export class NativeInnerAudioContext implements Taro.InnerAudioContext {
  private objectId: number

  constructor () {
    this.objectId = native.callInstance({}, {
      type: 'create',
      name: 'InnerAudioContext',
      objectId: -1,
      isAsync: false,
      autoRelease: true
    })
  }

  get volume () {
    return native.callInstance({}, {
      type: 'get',
      name: 'volume',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set volume (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'volume',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  get startTime () {
    return native.callInstance({}, {
      type: 'get',
      name: 'startTime',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set startTime (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'startTime',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  get playbackRate () {
    return native.callInstance({}, {
      type: 'get',
      name: 'playbackRate',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set playbackRate (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'playbackRate',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  get paused () {
    return native.callInstance({}, {
      type: 'get',
      name: 'paused',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set paused (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'paused',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  get obeyMuteSwitch () {
    return native.callInstance({}, {
      type: 'get',
      name: 'obeyMuteSwitch',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set obeyMuteSwitch (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'obeyMuteSwitch',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  get loop () {
    return native.callInstance({}, {
      type: 'get',
      name: 'loop',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set loop (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'loop',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  get duration () {
    return native.callInstance({}, {
      type: 'get',
      name: 'duration',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set duration (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'duration',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  get currentTime () {
    return native.callInstance({}, {
      type: 'get',
      name: 'currentTime',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set currentTime (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'currentTime',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  get buffered () {
    return native.callInstance({}, {
      type: 'get',
      name: 'buffered',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set buffered (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'buffered',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  get autoplay () {
    return native.callInstance({}, {
      type: 'get',
      name: 'volume',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set autoplay (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'autoplay',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  get src () {
    return native.callInstance({}, {
      type: 'get',
      name: 'src',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  set src (option: any) {
    native.callInstance(option, {
      type: 'set',
      name: 'src',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  static createInnerAudioContext () {
    return new NativeInnerAudioContext()
  }

  pause (): void {
    return native.callInstance({}, {
      type: 'function',
      name: 'pause',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  stop (): void {
    return native.callInstance({}, {
      type: 'function',
      name: 'stop',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  play (): void {
    return native.callInstance({}, {
      type: 'function',
      name: 'play',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  onStop (option: any): void {
    return native.callInstance(option, {
      type: 'function',
      name: 'onStop',
      objectId: this.objectId,
      isAsync: true,
      autoRelease: false
    })
  }

  onPlay (option: any): void {
    return native.callInstance(option, {
      type: 'function',
      name: 'onPlay',
      objectId: this.objectId,
      isAsync: true,
      autoRelease: false
    })
  }

  onEnded (option: any): void {
    return native.callInstance(option, {
      type: 'function',
      name: 'onEnded',
      objectId: this.objectId,
      isAsync: true,
      autoRelease: false
    })
  }

  onError (option: any): void {
    return native.callInstance(option, {
      type: 'function',
      name: 'onError',
      objectId: this.objectId,
      isAsync: true,
      autoRelease: false
    })
  }

  destroy (): void {}

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

  seek (option: any): void {
    return option
  }
}
