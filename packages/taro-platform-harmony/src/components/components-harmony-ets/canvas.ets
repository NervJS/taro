import type { TaroCanvasElement } from '@tarojs/runtime'
import { cancelAnimationFrame, requestAnimationFrame } from '@tarojs/runtime'


@Component
export default struct TaroCanvas {
  @ObjectLink node: TaroCanvasElement
  rafId: number = 0


  aboutToDisappear() {
    if(this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
  }

  build() {
    Canvas(this.node._context)
      .width('100%')
      .height('100%')
      .backgroundColor('#ffff00')
      .onReady(() => {
        const context = this.node._context

        const draw = () => {
          if (this.node._drawList.length) {
            while (this.node._drawList.length) {
              const item = this.node._drawList.shift()
              if (item) {
                if (typeof context[item.key] === 'function') {
                  context[item.key](...[].concat(item.value))
                } else {
                  context[item.key] = item.value
                }
              }
            }
          }
          this.rafId = requestAnimationFrame(draw)
        }
        draw()
      })
  }
}
