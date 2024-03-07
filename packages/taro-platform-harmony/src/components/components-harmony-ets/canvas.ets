import type { TaroCanvasElement } from '@tarojs/runtime'


@Component
export default struct TaroCanvas {
  @ObjectLink node: TaroCanvasElement

  build() {
    Canvas(this.node.context)
  }
}
