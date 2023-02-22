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

import { Component, Prop, Event, h, ComponentInterface, EventEmitter } from '@stencil/core'

@Component({
  tag: 'taro-cover-image-core',
  styleUrl: './style/index.scss'
})
export class CoverImage implements ComponentInterface {
  @Prop() src: string
  @Prop() nativeProps = {}
  @Event({
    eventName: 'load'
  }) onLoad: EventEmitter

  @Event({
    eventName: 'error'
  }) onError: EventEmitter

  private imgRef: HTMLImageElement

  imageOnLoad () {
    const {
      width,
      height,
    } = this.imgRef

    this.onLoad.emit({
      width,
      height
    })
  }

  imageOnError (e: Event) {
    this.onError.emit(e)
  }

  render () {
    const {
      src,
      imageOnLoad,
      imageOnError,
      nativeProps
    } = this
    return (
      <img
        ref={img => (this.imgRef = img!)}
        src={src}
        onLoad={imageOnLoad.bind(this)}
        onError={imageOnError.bind(this)}
        {...nativeProps}
      />
    )
  }
}
