import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { generateText } from './utils' 
import { getNodeThresholds, shouldBindEvent } from './utils/helper'

import type { TaroAny, TaroRichTextElement } from '@tarojs/runtime'

@Component
export default struct TaroRichText {
  @ObjectLink node: TaroRichTextElement

  build () {
    if (this.node.hmStyle?.display !== 'none') {
      RichText(generateText(this.node))
        .attributeModifier(commonStyleModify.setNode(this.node))
        .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
        .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          this.node._nodeInfo.areaInfo = res[1]
        }))
        .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    }
  }
}

