import { eventHandler } from '@tarojs/runtime'

import { FlexManager } from './utils/FlexManager'
import { AttributeManager } from './utils/AttributeManager'

import type { TaroImageElement } from '@tarojs/runtime'

@Extend(Image)
function attrs ({
   flexSize,
   alignSelf,
   size,
   margin,
   padding,
   zIndex,
   objectFit,
   backgroundColor,
}) {
  .size(size)
  .zIndex(zIndex)
  .margin(margin)
  .padding(padding)
  .objectFit(objectFit)
  .alignSelf(alignSelf)
  .flexGrow(flexSize[0])
  .flexShrink(flexSize[1])
  .flexBasis(flexSize[2])
  .backgroundColor(backgroundColor)
}

function getAttributes (node: TaroImageElement) {
  const { _st } = node

  return {
    size: {
      width: AttributeManager.getNodeStyle(_st, 'width', 0),
      height: AttributeManager.getNodeStyle(_st, 'height', 0)
    },
    alignSelf: ItemAlign.Auto,
    objectFit: ImageFit.Contain,
    flexSize: FlexManager.flexSize(_st),
    backgroundColor: _st.backgroundColor,
    zIndex: AttributeManager.getNodeStyle(_st, 'zIndex'),
    margin: AttributeManager.getNodeMarginOrPaddingData(_st, 'margin'),
    padding: AttributeManager.getNodeMarginOrPaddingData(_st, 'padding'),
  }
}

@Component
struct TaroImage {
  @ObjectLink node: TaroImageElement

  @Styles defaultEvent () {
    .onClick(e => eventHandler(e, 'click', this.node))
  }

  @Builder createImageElement ($$: { instance }) {
    Image($$.instance.getAttribute('src'))
      .defaultEvent()
      .attrs(getAttributes($$.instance))
      .onComplete(e => eventHandler(e, 'complete', $$.instance))
  }

  @Builder createImageElementWithPosition ($$: { instance, top, left }) {
    if (AttributeManager.getNodeStyle($$.instance._st, 'position') === 'absolute') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createImageElement({ instance: $$.instance })
      }
      .position({
        x: $$.left,
        y: $$.top
      })
    } else if ((AttributeManager.getNodeStyle($$.instance._st, 'position') === 'relative')) {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createImageElement({ instance: $$.instance })
      }
      .offset({
        x: $$.left,
        y: $$.top
      })
    } else {
      this.createImageElement({ instance: $$.instance })
    }
  }

  build() {
    this.createImageElementWithPosition({
      instance: this.node,
      top: AttributeManager.getNodeStyle(this.node._st, 'top', 0),
      left: AttributeManager.getNodeStyle(this.node._st, 'left', 0),
    })
  }
}

export default TaroImage