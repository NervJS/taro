// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Element, Event } from '@stencil/core'

const LONG_TAP_DELAY = 500

@Component({
  tag: 'taro-canvas-core',
  styleUrl: './style/index.css'
})
export class Canvas implements ComponentInterface {
  private timer: NodeJS.Timeout

  @Prop() canvasId: string

  @Element() el: HTMLElement

  @Event({
    eventName: 'longtap'
  })

  onLongTap

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
    const { canvasId } = this

    return (
      <canvas
        canvas-id={canvasId}
        style={{
          width: '100%',
          height: '100%'
        }}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      />
    )
  }
}
