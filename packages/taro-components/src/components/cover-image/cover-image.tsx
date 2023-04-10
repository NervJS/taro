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
