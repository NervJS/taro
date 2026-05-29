import { AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { generateText } from './utils'
import { getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroRichTextElement } from '@tarojs/runtime'

@Component
export default struct TaroRichText {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroRichTextElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroRichTextElement

  build () {
    RichText(generateText(this.node))
      .attributeModifier(commonStyleModify.setNode(this.node))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }
}

