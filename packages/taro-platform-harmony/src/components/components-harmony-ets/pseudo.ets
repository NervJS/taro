import { getFontAttributes } from './utils/helper'
import { pseudoModify } from './style'

import type { TaroAny, TaroStyleType, TaroTextStyleType, TaroViewElement } from '@tarojs/runtime'

@Extend(Flex)
function flexAttrs (style: TaroStyleType) {
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight || style.height,
    maxHeight: style.maxHeight
  })
}


@Extend(Text)
function textNormalFontStyle (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .opacity(style.opacity)
  .fontColor(style.color)
  .fontSize(style.fontSize)
  .fontWeight(style.fontWeight)
  .fontStyle(style.fontStyle)
  .fontFamily(style.fontFamily)
  .decoration({
    type: style.textDecoration?.type || TextDecorationType.None,
    color: style.color
  })
}

@Extend(Text)
function textSpecialFontStyle(attr: TaroTextStyleType) {
  .textAlign(attr.textAlign)
  .align(attr.verticalAlign)
  .textOverflow(attr.textOverflow)
  .maxLines(attr.WebkitLineClamp)
  .letterSpacing(attr.letterSpacing)
  .lineHeight(attr.lineHeight)
}

@Component
export default struct PseduoChildren {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroAny, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroViewElement

  build () {
    if (true) {
      // 伪类::Before
      if (this.node._pseudo_before) {
        if (this.node._pseudo_before?.hmStyle.content) {
          Text(this.node._pseudo_before.hmStyle.content)
            .attributeModifier(pseudoModify.setStyle(this.node._pseudo_before.hmStyle))
            .textNormalFontStyle(this.node._pseudo_before.hmStyle || {})
            .textSpecialFontStyle(getFontAttributes(this.node))
        } else {
          Flex() {}
          .attributeModifier(pseudoModify.setStyle(this.node._pseudo_before.hmStyle || {}))
          .flexAttrs(this.node._pseudo_before.hmStyle || {})
        }
      }
      this.createLazyChildren(this.node, 0)
      // 伪类::After
      if (this.node._pseudo_after) {
        if (this.node._pseudo_after?.hmStyle.content) {
          Text(this.node._pseudo_after.hmStyle.content)
            .attributeModifier(pseudoModify.setStyle(this.node._pseudo_after.hmStyle))
            .textNormalFontStyle(this.node._pseudo_after.hmStyle || {})
            .textSpecialFontStyle(getFontAttributes(this.node))
        } else {
          Flex() {}
          .attributeModifier(pseudoModify.setStyle(this.node._pseudo_after.hmStyle || {}))
          .flexAttrs(this.node._pseudo_after.hmStyle || {})
        }
      }
    }
  }
}
