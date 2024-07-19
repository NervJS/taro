import type { TaroAny, TaroCanvasElement } from '@tarojs/runtime'
import { cancelAnimationFrame, requestAnimationFrame } from '@tarojs/runtime'
import commonStyleModify from './style'

@Component
export default struct TaroCanvas {
  @ObjectLink node: TaroCanvasElement
  rafId: number = 0
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  aboutToDisappear() {
    if(this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
  }

  build() {
    Canvas(this.node._context)
      .attributeModifier(commonStyleModify.setNode(this.node as TaroAny, {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffff00'
      }).setAnimationStyle(this.overwriteStyle))
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
