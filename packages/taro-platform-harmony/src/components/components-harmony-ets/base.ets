import { convertNumber2VP } from '../runtime'
import { AttributeManager } from './utils/AttributeManager'

import type { TaroElement } from './element'


@Component
export default struct TaroComponentWrapper {
  node?: TaroElement

  @BuilderParam createElement: () => void

  top(): Length {
    return this.node?.hmStyle?.top || 0
  }

  left(): Length {
    return this.node?.hmStyle?.left || 0
  }

  @Builder createFlexElementWithPosition () {
    if (this.node?.hmStyle?.position === 'absolute') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .position({
        x: this.left(),
        y: this.top()
      })
      .id(this.node?._attrs?.id || this.node?._nid)
      .key(this.node?._attrs?.id || this.node?._nid)
      .zIndex(Number(this.node?.hmStyle?.zIndex) || null)
    } else if (this.node?.hmStyle?.position === 'fixed') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .position({
        x: this.left(),
        y: this.top()
      })
      .id(this.node?._attrs?.id || this.node?._nid)
      .key(this.node?._attrs?.id || this.node?._nid)
      .zIndex(Number(this.node?.hmStyle?.zIndex) || null)
    } else if ((this.node?.hmStyle?.position === 'relative')) {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createElement()
      }
      .offset({
        x: this.left(),
        y: this.top()
      })
      .id(this.node?._attrs?.id || this.node?._nid)
      .key(this.node?._attrs?.id || this.node?._nid)
      .zIndex(Number(this.node?.hmStyle?.zIndex) || null)
    } else {
      this.createElement()
    }
  }

  build () {
    this.createFlexElementWithPosition()
  }
}
