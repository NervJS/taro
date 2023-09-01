import { Component, h, ComponentInterface, Prop, Element, Event, EventEmitter } from '@stencil/core'

const LONG_TAP_DELAY = 500

@Component({
  tag: 'taro-canvas-core',
  styleUrl: './style/index.scss'
})
export class Canvas implements ComponentInterface {
  private timer: ReturnType<typeof setTimeout>

  @Prop({ attribute: 'id' }) canvasId: string
  @Prop({ mutable: true, reflect: true }) height: string
  @Prop({ mutable: true, reflect: true }) width: string
  @Prop() nativeProps = {}

  @Element() el: HTMLElement

  @Event({
    eventName: 'longtap'
  }) onLongTap: EventEmitter

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

  componentDidRender (): void {
    const [canvas] = this.el.children as unknown as HTMLCanvasElement[]
    if (!this.height || !this.width) {
      let style = window.getComputedStyle(canvas)
      this.height ||= style.height
      this.width ||= style.width
    }
    canvas.height = parseInt(this.height)
    canvas.width = parseInt(this.width)
  }
  render () {
    const { canvasId, nativeProps } = this

    return (
      <canvas
        canvas-id={canvasId}
        style={{
          width: '100%',
          height: '100%'
        }}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchCancel={this.onTouchEnd}
        onTouchEnd={this.onTouchEnd}
        {...nativeProps}
      />
    )
  }
}
