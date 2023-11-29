import type { TaroElement } from './utils/element'


@Component
export default struct TaroComponentWrapper {
  @ObjectLink node: TaroElement

  @BuilderParam createElement: () => void

  get top() {
    return Number(this.node._st?.top || this.node._st?._top || 0)
  }

  get left() {
    return Number(this.node._st?.left || this.node._st?._left || 0)
  }

  @Builder createFlexElementWithPosition () {
    if (this.node._st?.position === 'absolute') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .position({
        x: this.left,
        y: this.top
      })
      .id(this.node._attrs?.id || this.node._nid)
      .key(this.node._attrs?.id || this.node._nid)
      .zIndex(Number(this.node._st?.zIndex) || null)
    } else if (this.node._st?.position === 'fixed') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .position({
        x: this.left,
        y: this.top
      })
      .id(this.node._attrs?.id || this.node._nid)
      .key(this.node._attrs?.id || this.node._nid)
      .zIndex(Number(this.node._st?.zIndex) || null)
    } else if ((this.node._st?.position === 'relative')) {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .offset({
        x: this.left,
        y: this.top
      })
      .id(this.node._attrs?.id || this.node._nid)
      .key(this.node._attrs?.id || this.node._nid)
      .zIndex(Number(this.node._st?.zIndex) || null)
    } else {
      this.createElement()
    }
  }

  build () {
    this.createFlexElementWithPosition()
  }
}
