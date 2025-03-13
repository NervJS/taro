import commonStyleModify from './style'
import { generateText } from './utils'
import { getNodeThresholds } from './utils/helper'
import { getComponentEventCallback } from './utils/info'

import type { TaroAny, TaroRichTextElement } from '@tarojs/runtime'

@Component
export default struct TaroRichText {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroRichTextElement, layer?: number) => void = this.customBuilder
  @Prop node: TaroRichTextElement

  build () {
    RichText(generateText(this.node))
      .attributeModifier(commonStyleModify.setNode(this.node))
      .onAreaChange(getComponentEventCallback(this.node, 'areaChange', (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, 'visibleChange'))
  }
}

