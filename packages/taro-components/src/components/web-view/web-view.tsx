/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { Component, h, ComponentInterface, Prop, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'taro-web-view-core',
  styleUrl: './style/index.scss'
})
export class WebView implements ComponentInterface {
  @Prop() src: string

  @Event({
    eventName: 'load'
  })
  onLoad: EventEmitter

  @Event({
    eventName: 'error'
  })
  onError: EventEmitter

  render () {
    const {
      src,
      onLoad,
      onError
    } = this
    return (
      <iframe
        class='taro-webview'
        onLoad={(e: Event) => {
          e.stopPropagation()
          onLoad.emit({ src })
        }}
        onError={(e: Event) => {
          e.stopPropagation()
          onError.emit({ src })
        }}
        src={src}
      />
    )
  }
}
