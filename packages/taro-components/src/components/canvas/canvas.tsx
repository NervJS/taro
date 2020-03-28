// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, State, Element, Event } from '@stencil/core'

const LONG_TAP_DELAY = 500

@Component({
  tag: 'taro-canvas-core',
  styleUrl: './style/index.css'
})
export class Canvas implements ComponentInterface {
  private timer: NodeJS.Timeout
  // @Prop() type: '2d' | 'webgl'
  @Prop() canvasId: string

  @State() width = 300
  @State() height = 150

  @Element() el: HTMLElement

  @Event({
    eventName: 'longtap'
  })
  onLongTap

  componentDidLoad () {
    const { width, height } = this.el.getBoundingClientRect()
    this.width = width
    this.height = height
  }

  componentDidUpdate () {
    const { width, height } = this.el.getBoundingClientRect()
    if (this.width !== width) this.width = width
    if (this.height !== height) this.height = height
  }

  onTouchStart = () => {
    this.timer = setTimeout(() => {
      this.onLongTap.emit()
    }, LONG_TAP_DELAY)
  }

  onTouchMove = () => {
    clearTimeout(this.timer)
  }

  onTouchEnd = () => {
    clearTimeout(this.timer)
  }

  render () {
    const {
      canvasId,
      width,
      height
    } = this

    return (
      <canvas
        canvas-id={canvasId}
        width={width}
        height={height}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      />
    )
  }
}
