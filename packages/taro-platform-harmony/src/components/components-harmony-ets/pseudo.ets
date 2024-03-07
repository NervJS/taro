import { getFontAttributes, getStyle } from './utils/helper'
import { pseudoModify } from './style'
import { createLazyChildren } from './render'

import type { TaroViewElement, TaroStyleType, TaroTextStyleType } from '@tarojs/runtime'

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
  .lineHeight(style.lineHeight)
  .decoration({
    type: style.textDecoration,
    color: style.color
  })
}

@Extend(Text)
function textSpecialFontStyle(attr: TaroTextStyleType) {
  .textAlign(attr.textAlign)
  .textOverflow(attr.textOverflow)
  .maxLines(attr.WebkitLineClamp)
  .letterSpacing(attr.letterSpacing)
}

@Builder
export default function PseduoChildren (node: TaroViewElement) {
  // 伪类::Before
  if (node._pseudo_before) {
    if (node._pseudo_before?.hmStyle.content) {
      Text(node._pseudo_before.hmStyle.content)
        .attributeModifier(pseudoModify.setStyle(node._pseudo_before.hmStyle))
        .textNormalFontStyle(getStyle(node._pseudo_before.hmStyle || {}))
        .textSpecialFontStyle(getFontAttributes(node))
    } else {
      Flex() {}
      .attributeModifier(pseudoModify.setStyle(node._pseudo_before.hmStyle || {}))
      .flexAttrs(getStyle(node._pseudo_before.hmStyle || {}))
    }
  }
  createLazyChildren(node)
  // 伪类::After
  if (node._pseudo_after) {
    if (node._pseudo_after?.hmStyle.content) {
      Text(node._pseudo_after.hmStyle.content)
        .attributeModifier(pseudoModify.setStyle(node._pseudo_after.hmStyle))
        .textNormalFontStyle(getStyle(node._pseudo_after.hmStyle || {}))
        .textSpecialFontStyle(getFontAttributes(node))
    } else {
      Flex() {}
      .attributeModifier(pseudoModify.setStyle(node._pseudo_after.hmStyle || {}))
      .flexAttrs(getStyle(node._pseudo_after.hmStyle || {}))
    }
  }
}