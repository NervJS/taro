// @ts-ignore
import { eventHandler } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { BUTTON_THEME_COLOR } from './utils/constant/style'
import { AttributeManager } from './utils/AttributeManager'
import { TOUCH_EVENT_MAP } from './utils/constant/event.ets'
import { bindInstanceToNode, getNormalAttributes } from './utils/helper'

import type { TaroButtonElement } from '../runtime'

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
 isDisabled,
 backgroundColor,
}) {
  .border({
    width: 1,
    color: backgroundColor
  })
  .fontColor(fontColor)
  .opacity(isDisabled ? 0.4 : 1)
  .backgroundColor(isPlain ? Color.Transparent : backgroundColor)
}

function getThemeAttributes (node: TaroButtonElement) {
  const { _st, _attrs } = node
  const isPlain = _attrs.plain
  const isDisabled = _attrs.disabled
  const type = _attrs.type || 'default'

  return {
    isPlain,
    isDisabled,
    backgroundColor: _st.backgroundColor || BUTTON_THEME_COLOR[type].background,
    fontColor: AttributeManager.getNodeStyle(_st, 'color', BUTTON_THEME_COLOR[type].text),
  }
}

@Component
struct TaroButton {
  info: Area = null

  @ObjectLink node: TaroButtonElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Button({ stateEffect: !this.node._attrs.disabled }) {
        Row() {
          if (this.node._attrs.loading) {
            LoadingProgress()
            .width(20).height(20)
            .color(getThemeAttributes(this.node).fontColor)
          }
          ForEach(this.node.childNodes, item => {
            createNode(item)
          }, item => item._nid)
        }
      }
      .attrs(getNormalAttributes(this.node))
      .themeStyles(getThemeAttributes(this.node))
      .onClick(e => !this.node._attrs.disabled && eventHandler(e, 'click', this.node))
      .onTouch(e => !this.node._attrs.disabled && eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node))
    }
  }
}

export default TaroButton
