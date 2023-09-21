import { Component, Prop, h, ComponentInterface, Host, State, Event, EventEmitter } from '@stencil/core'
import classNames from 'classnames'

import('intersection-observer')

export type Mode =
  'scaleToFill'
  | 'aspectFit'
  | 'aspectFill'
  | 'widthFix'
  | 'heightFix'
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
  @Prop() nativeProps = {}

  @State() aspectFillMode = 'width'
  @State() didLoad = false

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
        this.didLoad = true
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

  imageOnError (e: Event) {
    this.onError.emit(e)
  }

  render () {
    const {
      src,
      mode = 'scaleToFill',
      lazyLoad = false,
      aspectFillMode = 'width',
      imageOnLoad,
      imageOnError,
      nativeProps,
      didLoad
    } = this

    // mode="" 按默认值处理
    const compMode = mode || 'scaleToFill'

    const cls = classNames({
      'taro-img__widthfix': compMode === 'widthFix'
    })
    const imgCls = classNames(
      `taro-img__mode-${compMode.toLowerCase().replace(/\s/g, '')}`,
      {
        [`taro-img__mode-aspectfill--${aspectFillMode}`]: compMode === 'aspectFill'
      }
    )

    return (
      <Host class={cls}>
        {
          src ? (
            <img
              ref={(img) => (this.imgRef = img!)}
              class={imgCls}
              src={lazyLoad && !didLoad ? undefined : src}
              onLoad={imageOnLoad.bind(this)}
              onError={imageOnError.bind(this)}
              {...nativeProps} />
          ) : ''
        }
      </Host>
    )
  }
}
