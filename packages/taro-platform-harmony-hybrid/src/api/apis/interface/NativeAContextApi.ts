import Taro from '@tarojs/api'

import { ClassInstanceManager } from './ClassInstanceManager'

export class NativeInnerAudioContext implements Taro.InnerAudioContext {
  readonly objectId: number
  readonly className: string = 'NativeInnerAudioContext'

  constructor () {
    this.objectId = ClassInstanceManager.getInstance().createInstance(this.className)
  }

  static createInnerAudioContext () {
    return new NativeInnerAudioContext()
  }

  get autoplay (): boolean {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'autoplay', this.objectId)
  }

  set autoplay (value: boolean) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'autoplay', this.objectId)
  }

  get buffered (): number {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'buffered', this.objectId)
  }

  set buffered (value: number) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'buffered', this.objectId)
  }

  get currentTime (): number {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'currentTime', this.objectId)
  }

  set currentTime (value: number) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'currentTime', this.objectId)
  }

  get duration (): number {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'duration', this.objectId)
  }

  set duration (value: number) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'duration', this.objectId)
  }

  get loop (): boolean {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'loop', this.objectId)
  }

  set loop (value: boolean) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'loop', this.objectId)
  }

  get obeyMuteSwitch (): boolean {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'obeyMuteSwitch', this.objectId)
  }

  set obeyMuteSwitch (value: boolean) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'obeyMuteSwitch', this.objectId)
  }

  get paused (): boolean {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'paused', this.objectId)
  }

  set paused (value: boolean) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'paused', this.objectId)
  }

  get playbackRate (): number {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'playbackRate', this.objectId)
  }

  set playbackRate (value: number) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'playbackRate', this.objectId)
  }

  get src (): string {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'src', this.objectId)
  }

  set src (value: string) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'src', this.objectId)
  }

  get startTime (): number {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'startTime', this.objectId)
  }

  set startTime (value: number) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'startTime', this.objectId)
  }

  get volume (): number {
    return ClassInstanceManager.getInstance().getInstanceValue(this.className, 'volume', this.objectId)
  }

  set volume (value: number) {
    ClassInstanceManager.getInstance().setInstanceValue(value, this.className, 'volume', this.objectId)
  }

  destroy (): void {
    ClassInstanceManager.getInstance().destroyInstance(this.className, this.objectId)
  }

  onEnded (options: any): any {
    return ClassInstanceManager.getInstance().setInstanceFunctionAsync(options, this.className, 'onEnded', this.objectId)
  }

  onError (options: any): any {
    return ClassInstanceManager.getInstance().setInstanceFunctionAsync(options, this.className, 'onError', this.objectId)
  }

  onPlay (options: any): any {
    return ClassInstanceManager.getInstance().setInstanceFunctionAsync(options, this.className, 'onPlay', this.objectId)
  }

  onStop (options: any): any {
    return ClassInstanceManager.getInstance().setInstanceFunctionAsync(options, this.className, 'onStop', this.objectId)
  }

  pause (): void {
    return ClassInstanceManager.getInstance().setInstanceFunction({}, this.className, 'pause', this.objectId)
  }

  play (): void {
    return ClassInstanceManager.getInstance().setInstanceFunction({}, this.className, 'play', this.objectId)
  }

  stop (): void {
    return ClassInstanceManager.getInstance().setInstanceFunction({}, this.className, 'stop', this.objectId)
  }

  offCanplay (option: any): void {
    return option
  }

  offEnded (option: any): void {
    return ClassInstanceManager.getInstance().setInstanceFunctionAsync(option, this.className, 'offEnded', this.objectId)
  }

  offError (option: any): void {
    return ClassInstanceManager.getInstance().setInstanceFunctionAsync(option, this.className, 'offError', this.objectId)
  }

  offPause (option: any): void {
    return ClassInstanceManager.getInstance().setInstanceFunctionAsync(option, this.className, 'offPause', this.objectId)
  }

  offPlay (option: any): void {
    return ClassInstanceManager.getInstance().setInstanceFunctionAsync(option, this.className, 'offPlay', this.objectId)
  }

  offStop (option: any): void {
    return ClassInstanceManager.getInstance().setInstanceFunctionAsync(option, this.className, 'offStop', this.objectId)
  }

  onPause (option: any): void {
    return ClassInstanceManager.getInstance().setInstanceFunctionAsync(option, this.className, 'onPause', this.objectId)
  }

  offTimeUpdate (option: any): void {
    return option
  }

  offSeeked (option: any): void {
    return option
  }

  offSeeking (option: any): void {
    return option
  }

  offWaiting (option: any): void {
    return option
  }

  onCanplay (option: any): void {
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
