import { convertNumber2VP } from '../runtime'
import { AttributeManager } from './utils/AttributeManager'
import type { TaroElement } from './utils/element'


@Component
export default struct TaroComponentWrapper {
  node?: TaroElement

  @BuilderParam createElement: () => void

  top(): Length {
    return AttributeManager.getStyleAfterConvert(this.node?._st, 'top') || convertNumber2VP(AttributeManager.getNodeStyle(this.node?._st, 'top') || 0) 
  }

  left(): Length {
    return AttributeManager.getStyleAfterConvert(this.node?._st, 'left') || convertNumber2VP(AttributeManager.getNodeStyle(this.node?._st, 'left') || 0)
  }

  @Builder createFlexElementWithPosition () {
    if (this.node?._st?.position === 'absolute') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .position({
        x: this.left(),
        y: this.top()
      })
      .id(this.node?._attrs?.id || this.node?._nid)
      .key(this.node?._attrs?.id || this.node?._nid)
      .zIndex(Number(this.node?._st?.zIndex) || null)
    } else if (this.node?._st?.position === 'fixed') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .position({
        x: this.left(),
        y: this.top()
      })
      .id(this.node?._attrs?.id || this.node?._nid)
      .key(this.node?._attrs?.id || this.node?._nid)
      .zIndex(Number(this.node?._st?.zIndex) || null)
    } else if ((this.node?._st?.position === 'relative')) {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .offset({
        x: this.left(),
        y: this.top()
      })
      .id(this.node?._attrs?.id || this.node?._nid)
      .key(this.node?._attrs?.id || this.node?._nid)
      .zIndex(Number(this.node?._st?.zIndex) || null)
    } else {
      this.createElement()
    }
  }

  build () {
    this.createFlexElementWithPosition()
  }
}
