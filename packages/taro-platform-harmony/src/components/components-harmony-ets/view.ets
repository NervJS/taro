import { type TaroView, eventHandler } from '@tarojs/runtime'

import { createNode } from './render'
import { FlexManager } from './utils/FlexManager'
import { AttributeManager } from './utils/AttributeManager'

@Extend(Flex)
function flex (node: TaroView) {
  .flexGrow(FlexManager.flexSize(node)[0])
  .flexShrink(FlexManager.flexSize(node)[1])
  .flexBasis(FlexManager.flexSize(node)[2])
  .alignSelf(FlexManager.getAlignSelf(node))
}

@Component
struct View {
  @ObjectLink node: TaroView

  scroller: Scroller = new Scroller()

  @Styles defaultStyle () {
    .size({
      width: AttributeManager.getNodeStyle(this.node, 'width'),
      height: AttributeManager.getNodeHeight(this.node)
    })
    .margin(AttributeManager.getNodeMarginOrPaddingData(this.node, 'margin'))
    .padding(AttributeManager.getNodeMarginOrPaddingData(this.node, 'padding'))
    .backgroundImage(AttributeManager.getNodeStyle(this.node, 'backgroundImage'))
    .backgroundImageSize({
      width: AttributeManager.getNodeStyle(this.node, 'backgroundSize'),
      height: AttributeManager.getNodeStyle(this.node, 'backgroundSize')
    })
    .linearGradient(AttributeManager.getNodeLinearGradient(this.node))
    .zIndex(AttributeManager.getNodeStyle(this.node, 'zIndex'))
    .borderRadius(AttributeManager.getNodeStyle(this.node, 'borderRadius'))
    .opacity(AttributeManager.getNodeStyle(this.node, 'opacity'))
    .backgroundColor(AttributeManager.getNodeBackGroundData(this.node, 'backgroundColor'))
    .backgroundImage(AttributeManager.getNodeBackGroundData(this.node, 'backgroundImage'))
    // TODO
    .backgroundImageSize({ width: '100%', height: '100%' })
    .backgroundImagePosition(AttributeManager.getNodeBackGroundData(this.node, 'backgroundPosition'))
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node))
  }

  @Builder createFlexElement($$: { instance }) {
    Flex({
      direction: FlexManager.flexDirection($$.instance),
      justifyContent: FlexManager.justifyContent($$.instance),
      alignItems: FlexManager.alignItems($$.instance),
      wrap: FlexManager.flexWrap($$.instance),
      alignContent: FlexManager.alignContent($$.instance),
    }) {
      ForEach(this.node.childNodes, (item, index) => {
        createNode(item)
      }, item => item._nid)
    }
    .flex($$.instance)
    .defaultStyle()
    .defaultEvent()
  }

  @Builder createFlexElementWithPosition ($$: { instance }) {
    if (AttributeManager.getNodeStyle($$.instance, 'position') === 'absolute') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createFlexElement({ instance: $$.instance })
      }
      .position({
        x: AttributeManager.getNodeStyle($$.instance, 'left', 0),
        y: AttributeManager.getNodeStyle($$.instance, 'top', 0)
      })
    } else if ((AttributeManager.getNodeStyle(this.node, 'position') === 'relative')) {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createFlexElement({ instance: $$.instance })
      }
      .offset({
        x: AttributeManager.getNodeStyle($$.instance, 'left', 0),
        y: AttributeManager.getNodeStyle($$.instance, 'top', 0)
      })
    } else {
      this.createFlexElement({ instance: $$.instance })
    }
  }

  build() {
    this.createFlexElementWithPosition({ instance: this.node })
  }
}

export default View
