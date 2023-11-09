import type { TaroElement } from 'tarojs/runtime'

@Component
struct TaroComponentWrapper {
  node: TaroElement

  @BuilderParam createElement: () => void

  @Builder createFlexElementWithPosition ($$: { instance: TaroElement, top: number, left: number }) {
    if ($$.instance._st?.position === 'absolute') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .position({
        x: $$.left,
        y: $$.top,
      })
      .id($$.instance._attrs?.id || $$.instance._nid)
      .zIndex(Number($$.instance._st?.zIndex) || null)
    } else if ($$.instance._st?.position === 'fixed') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .position({
        x: $$.left,
        y: $$.top
      })
      .id($$.instance._attrs?.id || $$.instance._nid)
      .zIndex(Number($$.instance._st?.zIndex) || null)
    } else if (($$.instance._st?.position === 'relative')) {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .offset({
        x: $$.left,
        y: $$.top
      })
      .id($$.instance._attrs?.id || $$.instance._nid)
      .zIndex(Number($$.instance._st?.zIndex) || null)
    } else {
      this.createElement()
    }
  }

  build () {
    this.createFlexElementWithPosition({
      instance: this.node,
      top: this.node._st?.top || this.node._st?._top || 0,
      left: this.node._st?.left || this.node._st?._left || 0,
    })
  }
}

export default TaroComponentWrapper
