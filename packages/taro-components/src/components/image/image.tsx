import { Component, Prop, h, ComponentInterface, Host, State, Event, EventEmitter, Element } from '@stencil/core'
import classNames from 'classnames'

require('intersection-observer')

@Component({
  tag: 'taro-image',
  styleUrl: './style/index.scss'
})
export class Image implements ComponentInterface {
  @Prop() src: string
  @Prop() mode = 'scaleToFill'
  @Prop() lazyLoad = false
  @State() isLoaded = false

  @Event({
    eventName: 'load'
  }) onLoad: EventEmitter

  @Event({
    eventName: 'error'
  }) onError: EventEmitter

  private imgRef: HTMLImageElement

  @Element() el: HTMLElement

  componentDidLoad () {
    if (this.lazyLoad) {
      const lazyImg = new IntersectionObserver((entries) => {
        // 异步 api 关系
        if (entries[entries.length - 1].isIntersecting) {
          this.isLoaded = true
          lazyImg.unobserve(this.imgRef)
          this.imgRef.src = this.src
        }
      }, {
        rootMargin: '300px 0px'
      })
    }
  }

  imageOnLoad () {
    this.onLoad.emit({
      width: this.imgRef.width,
      height: this.imgRef.height
    })
  }

  imageOnError () {
    this.onError.emit()
  }

  render () {
    const cls = classNames(
      'taro-img',
      {
        'taro-img__widthfix': this.mode === 'widthFix'
      }
    )
    const imgCls = classNames(
      'taro-img__mode-' +
        (this.mode || 'scaleToFill').toLowerCase().replace(/\s/g, '')
    )
    return (
      <Host class={cls}>
        {this.lazyLoad ? (
          <img
            ref={img => (this.imgRef = img!)}
            class={imgCls}
            data-src={this.src}
            onLoad={this.imageOnLoad}
            onError={this.imageOnError}
          />
        ) : (
          <img
            ref={img => (this.imgRef = img!)}
            class={imgCls}
            src={this.src}
            onLoad={this.imageOnLoad}
            onError={this.imageOnError}
          />
        )}
      </Host>
    )
  }
}
