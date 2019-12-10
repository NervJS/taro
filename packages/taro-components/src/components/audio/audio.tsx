// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Prop, h, ComponentInterface, Event, EventEmitter } from '@stencil/core'
import { TaroEvent } from '@tarojs/components'

@Component({
  tag: 'taro-audio',
  styleUrl: './style/index.scss'
})
export class Audio implements ComponentInterface {
  @Prop() src: string
  @Prop() loop: boolean
  @Prop() controls: boolean

  @Event({
    eventName: 'error'
  }) onError: EventEmitter

  @Event({
    eventName: 'play'
  }) onPlay: EventEmitter

  @Event({
    eventName: 'pause'
  }) onPause: EventEmitter

  @Event({
    eventName: 'timeupdate'
  }) onTimeUpdate: EventEmitter

  @Event({
    eventName: 'ended'
  }) onEnded: EventEmitter

  private audio: HTMLAudioElement

  private bindevent () {
    this.audio.addEventListener('timeupdate', (e: TaroEvent<HTMLMediaElement>) => {
      this.onTimeUpdate.emit({
        duration: e.srcElement!.duration,
        currentTime: e.srcElement!.duration
      })
    })

    this.audio.addEventListener('ended', () => {
      this.onEnded.emit()
    })

    this.audio.addEventListener('play', () => {
      this.onPlay.emit()
    })

    this.audio.addEventListener('pause', (e) => {
      this.onPause.emit(e)
    })

    // 1网络错误, 2解码错误, 3解码错误，4 不合适资源
    this.audio.addEventListener('error', (e: TaroEvent<HTMLMediaElement>) => {
      this.onError.emit({
        errMsg: e.srcElement!.error?.code
      })
    })
  }

  componentDidLoad () {
    this.bindevent()
  }

  render () {
    const {
      src,
      controls,
      loop
    } = this
    return (
      <audio
        src={src}
        controls={controls}
        loop={loop}
        ref={audio => { this.audio = audio! }}
      />
    )
  }
}
