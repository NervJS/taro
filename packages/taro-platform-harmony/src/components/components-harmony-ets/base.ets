import type { TaroElement } from 'tarojs/runtime'

import { AttributeManager } from './utils/AttributeManager'

@Component
struct TaroComponentWrapper {
  @Prop node: TaroElement;

  @BuilderParam createElement: () => void

  @Builder createFlexElementWithPosition ($$: { instance: TaroElement, top: number, left: number }) {
    if (AttributeManager.getNodeStyle($$.instance._st, 'position') === 'absolute') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .position({
        x: $$.left,
        y: $$.top
      })
      .zIndex(Number(AttributeManager.getNodeStyle($$.instance._st, 'zIndex')) || null)
    } else if (AttributeManager.getNodeStyle($$.instance._st, 'position') === 'fixed') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .position({
        x: $$.left,
        y: $$.top
      })
      .zIndex(Number(AttributeManager.getNodeStyle($$.instance._st, 'zIndex')) || null)
    } else if ((AttributeManager.getNodeStyle($$.instance._st, 'position') === 'relative')) {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .offset({
        x: $$.left,
        y: $$.top
      })
      .zIndex(Number(AttributeManager.getNodeStyle($$.instance._st, 'zIndex')) || null)
    } else {
      this.createElement()
    }
  }

  build () {
    this.createFlexElementWithPosition({
      instance: this.node,
      top: AttributeManager.getNodeStyle(this.node._st, 'top', 0),
      left: AttributeManager.getNodeStyle(this.node._st, 'left', 0),
    })
  }
}

export default TaroComponentWrapper
