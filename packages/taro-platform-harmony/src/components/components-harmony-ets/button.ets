// @ts-ignore
import { eventHandler, NodeType } from '@tarojs/runtime'

import { createNode } from './render'
import { FlexManager } from './utils/FlexManager'
import { AttributeManager } from './utils/AttributeManager'

import type { TaroButtonElement } from '../runtime'
import { BUTTON_THEME_COLOR } from './utils/constant/style'

@Extend(Button)
function attrs ({
   flexSize,
   alignSelf,
   size,
   margin,
   padding,
   zIndex,
}) {
  .size(size)
  .zIndex(zIndex)
  .margin(margin)
  .padding(padding)
  .alignSelf(alignSelf)
  .flexGrow(flexSize[0])
  .flexShrink(flexSize[1])
  .flexBasis(flexSize[2])
}

@Extend(Button)
function themeStyles({
 isPlain,
 fontColor,
 backgroundColor,
}) {
  .backgroundColor(isPlain ? 'transparent' : backgroundColor)
  .borderColor(backgroundColor)
  .fontColor(fontColor)
}

function getThemeAttributes (node: TaroButtonElement) {
  const { _st, _attrs } = node
  const isPlain = _attrs.plain
  const type = _attrs.type || 'default'

  return {
    isPlain,
    backgroundColor: _st.backgroundColor || BUTTON_THEME_COLOR[type].background,
    fontColor: AttributeManager.getNodeStyle(_st, 'color', BUTTON_THEME_COLOR[type].text),
  }
}

function getAttributes (node: TaroButtonElement) {
  const { _st } = node

  return {
    size: {
      width: AttributeManager.getNodeStyle(_st, 'width', 0),
      height: AttributeManager.getNodeStyle(_st, 'height', 0)
    },
    alignSelf: ItemAlign.Auto,
    flexSize: FlexManager.flexSize(_st),
    zIndex: AttributeManager.getNodeStyle(_st, 'zIndex'),
    margin: AttributeManager.getNodeMarginOrPaddingData(_st, 'margin'),
    padding: AttributeManager.getNodeMarginOrPaddingData(_st, 'padding'),
  }
}

@Component
struct TaroButton {
  @ObjectLink node: TaroButtonElement

  @Styles defaultEvent () {
    .onClick(e => eventHandler(e, 'click', this.node))
  }

  @Builder createButtonElement ($$: { instance }) {
    Button() {
      Row() {
        if ($$.instance._attrs.loading) {
          LoadingProgress()
          .width(20).height(20)
          .color(getThemeAttributes($$.instance).fontColor)
        }
        ForEach($$.instance.childNodes, item => {
          createNode(item)
        }, item => item._nid)
      }
    }
    .defaultEvent()
    .attrs(getAttributes($$.instance))
    .themeStyles(getThemeAttributes($$.instance))
  }

  @Builder createImageElementWithPosition ($$: { instance, top, left }) {
    if (AttributeManager.getNodeStyle($$.instance._st, 'position') === 'absolute') {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createButtonElement({ instance: $$.instance })
      }
      .position({
        x: $$.left,
        y: $$.top
      })
    } else if ((AttributeManager.getNodeStyle($$.instance._st, 'position') === 'relative')) {
      Stack({ alignContent: Alignment.TopStart }) {
        this.createButtonElement({ instance: $$.instance })
      }
      .offset({
        x: $$.left,
        y: $$.top
      })
    } else {
      this.createButtonElement({ instance: $$.instance })
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

export default TaroButton
