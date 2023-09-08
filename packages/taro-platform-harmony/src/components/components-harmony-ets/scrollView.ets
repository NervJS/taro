import { eventHandler } from '../runtime'

import { createNode } from './render'
import { AttributeManager } from './utils/AttributeManager'

import type { TaroViewElement } from '../runtime'

@Extend(Row)
function attrs ({
 margin,
 padding,
 linearGradient,
 zIndex,
 borderRadius,
 opacity,
 backgroundColor,
 backgroundImage,
 backgroundImageSize,
}) {
  .margin(margin)
  .zIndex(zIndex)
  .padding(padding)
  .opacity(opacity)
  .borderRadius(borderRadius)
  .linearGradient(linearGradient)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage)
  .backgroundImageSize(backgroundImageSize)
}

function getAttributes (node: TaroViewElement) {
  const { _st } = node
  return {
    size: {
      width: AttributeManager.getNodeStyle(_st, 'width'),
      height: AttributeManager.getNodeHeight(_st)
    },
    margin: AttributeManager.getNodeMarginOrPaddingData(_st, 'margin'),
    padding: AttributeManager.getNodeMarginOrPaddingData(_st, 'padding'),
    linearGradient: AttributeManager.getNodeLinearGradient(_st),
    zIndex: AttributeManager.getNodeStyle(_st, 'zIndex'),
    borderRadius: AttributeManager.getNodeStyle(_st, 'borderRadius'),
    opacity: AttributeManager.getNodeStyle(_st, 'opacity'),
    backgroundColor: AttributeManager.getNodeBackGroundData(_st, 'backgroundColor'),
    backgroundImage: AttributeManager.getNodeBackGroundData(_st, 'backgroundImage'),
    backgroundImageSize: { width: '100%', height: '100%' }
    // Todo: 尚未完成
    // backgroundImageSize: {
    //   width: AttributeManager.getNodeStyle(_st, 'backgroundSize'),
    //   height: AttributeManager.getNodeStyle(_st, 'backgroundSize'),
    // },
  }
}

@Component
struct TaroScrollView {
  scroller: Scroller = new Scroller()

  @ObjectLink node: TaroViewElement

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node))
  }

  @Builder createFlexElement($$: { instance }) {
    if (this.node._attrs.scrollX) {
      Scroll(this.scroller) {
        Row() {
          ForEach($$.instance.childNodes, item => {
            createNode(item)
          }, item => item._nid)
        }
        .attrs(getAttributes($$.instance))
        .height(getAttributes($$.instance).size.height)
      }
      .width(getAttributes($$.instance).size.width)
      .scrollable(ScrollDirection.Horizontal)
      .defaultEvent()
    } else {
      Scroll(this.scroller) {
        Row() {
          ForEach($$.instance.childNodes, item => {
            createNode(item)
          }, item => item._nid)
        }
        .width(getAttributes($$.instance).size.width)
        .attrs(getAttributes($$.instance))
      }
      .height(getAttributes($$.instance).size.height)
      .scrollable(ScrollDirection.Horizontal)
      .defaultEvent()
    }
  }

  @Builder createFlexElementWithPosition ($$: { instance, top, left }) {
    if (AttributeManager.getNodeStyle($$.instance._st, 'position') === 'absolute') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createFlexElement({ instance: $$.instance })
      }
      .position({
        x: $$.left,
        y: $$.top
      })
    } else if ((AttributeManager.getNodeStyle($$.instance._st, 'position') === 'relative')) {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createFlexElement({ instance: $$.instance })
      }
      .offset({
        x: $$.left,
        y: $$.top
      })
    } else {
      this.createFlexElement({ instance: $$.instance })
    }
  }

  build() {
    this.createFlexElementWithPosition({
      instance: this.node,
      top: AttributeManager.getNodeStyle(this.node._st, 'top', 0),
      left: AttributeManager.getNodeStyle(this.node._st, 'left', 0),
    })
  }
}

export default TaroScrollView
