/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { Component, Prop, h, ComponentInterface, Host, State, Event, EventEmitter } from '@stencil/core'
import classNames from 'classnames'

import('intersection-observer')

export type Mode =
  'scaleToFill'
  | 'aspectFit'
  | 'aspectFill'
  | 'widthFix'
  | 'top'
  | 'bottom'
  | 'center'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right'

@Component({
  tag: 'taro-image-core',
  styleUrl: './style/index.scss'
})
export class Image implements ComponentInterface {
  @Prop() src: string
  @Prop() mode: Mode = 'scaleToFill'
  @Prop() lazyLoad = false
  @State() aspectFillMode = 'width'

  @Event({
    eventName: 'load'
  }) onLoad: EventEmitter

  @Event({
    eventName: 'error'
  }) onError: EventEmitter

  private imgRef: HTMLImageElement

  componentDidLoad () {
    if (!this.lazyLoad) return

    const lazyImg = new IntersectionObserver(entries => {
      // 异步 api 关系
      if (entries[entries.length - 1].isIntersecting) {
        lazyImg.unobserve(this.imgRef)
        this.imgRef.src = this.src
      }
    }, {
      rootMargin: '300px 0px'
    })

    lazyImg.observe(this.imgRef)
  }

  imageOnLoad () {
    const {
      width,
      height,
      naturalWidth,
      naturalHeight
    } = this.imgRef

    this.onLoad.emit({
      width,
      height
    })

    this.aspectFillMode = naturalWidth > naturalHeight ? 'width' : 'height'
  }

  imageOnError () {
    this.onError.emit()
  }

  render () {
    const {
      src,
      mode,
      lazyLoad,
      aspectFillMode,
      imageOnLoad,
      imageOnError
    } = this

    const cls = classNames({
      'taro-img__widthfix': mode === 'widthFix'
    })
    const imgCls = classNames(
      `taro-img__mode-${mode.toLowerCase().replace(/\s/g, '')}`,
      {
        [`taro-img__mode-aspectfill--${aspectFillMode}`]: mode === 'aspectFill'
      }
    )

    return (
      <Host class={cls}>
        {lazyLoad ? (
          <img
            ref={img => (this.imgRef = img!)}
            class={imgCls}
            onLoad={imageOnLoad.bind(this)}
            onError={imageOnError.bind(this)}
          />
        ) : (
          <img
            ref={img => (this.imgRef = img!)}
            class={imgCls}
            src={src}
            onLoad={imageOnLoad.bind(this)}
            onError={imageOnError.bind(this)}
          />
        )}
      </Host>
    )
  }
}
