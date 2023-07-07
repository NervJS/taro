import { type TaroImageElement, eventHandler } from '@tarojs/runtime'

import { FlexManager } from './utils/FlexManager'
import { AttributeManager } from './utils/AttributeManager'

@Extend(Image)
function flex (node: TaroImageElement) {
  .flexGrow(FlexManager.flexSize(node)[0])
  .flexShrink(FlexManager.flexSize(node)[1])
  .flexBasis(FlexManager.flexSize(node)[2])
  .alignSelf(FlexManager.getAlignSelf(node))
}

@Component
struct TaroImage {
  @ObjectLink node: TaroImageElement

  @Styles defaultStyle () {
    .size({
      width: AttributeManager.getNodeStyle(this.node, 'width', 0),
      height: AttributeManager.getNodeStyle(this.node, 'height', 0)
    })
    .margin(AttributeManager.getNodeMarginOrPaddingData(this.node, 'margin'))
    .padding(AttributeManager.getNodeMarginOrPaddingData(this.node, 'padding'))
    .backgroundColor(this.node._st.backgroundColor)
    .zIndex(AttributeManager.getNodeStyle(this.node, 'zIndex'))
  }

  @Styles defaultEvent () {
    .onClick(e => eventHandler(e, 'click', this.node))
  }

  @Builder createImageElement ($$: { instance }) {
    Image($$.instance.getAttribute('src'))
      .defaultStyle()
      .defaultEvent()
      .flex($$.instance)
      .objectFit(ImageFit.Contain)
      .onComplete(e => eventHandler(e, 'complete', $$.instance))
  }

  @Builder createImageElementWithPosition ($$: { instance }) {
    if (AttributeManager.getNodeStyle($$.instance, 'position') === 'absolute') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createImageElement({ instance: $$.instance })
      }
      .position({
        x: AttributeManager.getNodeStyle($$.instance, 'left', 0),
        y: AttributeManager.getNodeStyle($$.instance, 'top', 0)
      })
    } else if ((AttributeManager.getNodeStyle(this.node, 'position') === 'relative')) {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createImageElement({ instance: $$.instance })
      }
      .offset({
        x: AttributeManager.getNodeStyle($$.instance, 'left', 0),
        y: AttributeManager.getNodeStyle($$.instance, 'top', 0)
      })
    } else {
      this.createImageElement({ instance: $$.instance })
    }
  }

  build() {
    this.createImageElementWithPosition({ instance: this.node })
  }
}

export default TaroImage
