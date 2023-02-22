/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import { Component, Prop, h, ComponentInterface, Event, EventEmitter } from '@stencil/core'
import { TaroEvent } from '../../../types'

@Component({
  tag: 'taro-audio-core',
  styleUrl: './style/index.scss'
})
export class Audio implements ComponentInterface {
  @Prop() src: string
  @Prop() controls = true
  @Prop() autoplay = false
  @Prop() loop = false
  @Prop() muted = false
  @Prop() nativeProps = {}

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
    this.audio.addEventListener('timeupdate', (e: TaroEvent<HTMLAudioElement>) => {
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
    this.audio.addEventListener('error', (e: TaroEvent<HTMLAudioElement>) => {
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
      autoplay,
      loop,
      muted,
      nativeProps
    } = this
    return (
      <audio
        src={src}
        controls={controls}
        autoplay={autoplay}
        loop={loop}
        muted={muted}
        ref={audio => { this.audio = audio as HTMLAudioElement }}
        {...nativeProps}
      />
    )
  }
}
