import { getFontAttributes, getStyle } from './utils/helper'
import { pseudoModify } from './style'
import { createLazyChildren } from './render'

import type { TaroViewElement, TaroStyleType, TaroTextStyleType } from '@tarojs/runtime'

@Extend(Stack)
function stackAttrs (style: TaroStyleType) {
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
  if (node.pseudo_before) {
    if (node.pseudo_before.content) {
      Text(node.pseudo_before.content)
        .attributeModifier(pseudoModify.setStyle(node.pseudo_before))
        .textNormalFontStyle(getStyle(node.pseudo_before || {}))
        .textSpecialFontStyle(getFontAttributes(node))
    } else {
      Stack() {}
      .attributeModifier(pseudoModify.setStyle(node.pseudo_before || {}))
      .stackAttrs(getStyle(node.pseudo_before || {}))
    }
  }
  createLazyChildren(node)
  // 伪类::After
  if (node.pseudo_after) {
    if (node.pseudo_after.content) {
      Text(node.pseudo_after.content)
        .attributeModifier(pseudoModify.setStyle(node.pseudo_after))
        .textNormalFontStyle(getStyle(node.pseudo_after || {}))
        .textSpecialFontStyle(getFontAttributes(node))
    } else {
      Stack() {}
      .attributeModifier(pseudoModify.setStyle(node.pseudo_after || {}))
      .stackAttrs(getStyle(node.pseudo_after || {}))
    }
  }
}