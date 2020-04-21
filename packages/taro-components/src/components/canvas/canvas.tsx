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
  @State() klass: string
  @State() css: string

  @Element() el: HTMLElement

  @Event({
    eventName: 'longtap'
  })

  onLongTap

  private canvas?: HTMLCanvasElement

  componentDidLoad () {
    const { width, height } = this.el.getBoundingClientRect()
    this.width = width
    this.height = height
    this.klass = this.el.className
    this.css = this.el.style.cssText
  }

  componentDidUpdate () {
    const { width, height } = this.el.getBoundingClientRect()
    if (this.width !== width) this.width = width
    if (this.height !== height) this.height = height
    if (this.canvas) {
      this.canvas.className = this.el.className
      this.canvas.style.cssText = this.el.style.cssText
    }
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
        ref={node => (this.canvas = node!)}
        width={width}
        height={height}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      />
    )
  }
}
