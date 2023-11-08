// TODO: 后续这个文件通过半编译逻辑生成
import { TaroElement, eventHandler, DynamicCenter } from '@tarojs/runtime'

import { createNode } from './render'
import { FlexManager } from './utils/FlexManager'

import { transformW3CToHarmonyInStyle, bindInstanceToNode, bindAnimation, getNormalAttributes, getFontAttributes, shouldBindEvent } from './utils/helper'

import type { TaroViewElement } from '@tarojs/runtime'

@Extend(Image)

function attrsImage ({
  flexBasis,
  flexGrow,
  flexShrink,
  alignSelf,
  clip,
  width,
  height,
  margin,
  padding,
  linearGradient,
  zIndex,
  borderStyle,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  backgroundColor,
  backgroundImage,
  backgroundRepeat,
  backgroundImageSize,
  constraintSize,
  rotate,
  scale,
  translate,
  transform
}) {
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
  .constraintSize(constraintSize)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .borderStyle(borderStyle)
  .borderWidth(borderWidth)
  .borderColor(borderColor)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
  .clip(clip)
  .objectFit(ImageFit.Contain)
}

@Extend(Flex)
function attrs ({
  flexBasis,
  flexGrow,
  flexShrink,
  alignSelf,
  clip,
  width,
  height,
  margin,
  padding,
  linearGradient,
  zIndex,
  borderStyle,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  backgroundColor,
  backgroundImage,
  backgroundRepeat,
  backgroundImageSize,
  constraintSize,
  rotate,
  scale,
  translate,
  transform
}) {
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
  .constraintSize(constraintSize)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .borderStyle(borderStyle)
  .borderWidth(borderWidth)
  .borderColor(borderColor)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
  .clip(clip)
}

@Extend(Text)
function attrsText ({
  id,
  width,
  height,
  zIndex,
  opacity,
  margin,
  padding,
  decoration,
  lineHeight,
  letterSpacing,
  maxLines,
  fontColor,
  fontSize,
  fontWeight,
  fontFamily,
  textOverflow,
  constraintSize,
  border,
  borderRadius,
  backgroundColor,
  backgroundImage,
  backgroundRepeat,
  backgroundImageSize,
  rotate,
  scale,
  translate,
  transform,
  textAlign,
 }) {
  .id(id)
  .constraintSize(constraintSize)
  .zIndex(zIndex)
  .opacity(opacity)
  .margin(margin)
  .padding(padding)
  .decoration(decoration)
  .lineHeight(lineHeight)
  .letterSpacing(letterSpacing)
  .maxLines(maxLines)
  .fontColor(fontColor)
  .fontSize(fontSize)
  .fontWeight(fontWeight)
  .fontFamily(fontFamily)
  .textOverflow(textOverflow)
  .border(border)
  .borderRadius(borderRadius)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
  .textAlign(textAlign)
  .width(width)
  .height(height)
}

function getTextAttributes (node: TaroViewElement, overwriteStyle: Record<string, any>) {
  const attrs = {
    ...getNormalAttributes(node, overwriteStyle),
    ...getFontAttributes(node)
  }

  transformW3CToHarmonyInStyle(node._st, attrs)

  return attrs
}

@Component
struct TaroFeedItem {
  @ObjectLink node: TaroViewElement

  @State node1: TaroViewElement = new TaroElement('Block')

  @State node2: TaroViewElement = new TaroElement('Block')

  @State node3: TaroViewElement = new TaroElement('Block')

  @State node4: TaroViewElement = new TaroElement('Block')

  @State node5: TaroViewElement = new TaroElement('Block')

  @State node6: TaroViewElement = new TaroElement('Block')

  @State node7: TaroViewElement = new TaroElement('Block')

  @State node8: TaroViewElement = new TaroElement('Block')

  @State node9: TaroViewElement = new TaroElement('Block')

  @State node10: TaroViewElement = new TaroElement('Block')

  @State node11: TaroViewElement = new TaroElement('Block')
  
  @State node12: TaroViewElement = new TaroElement('Block')

  dynamicCount = 11

  dynamicCenter: DynamicCenter

  @State overwriteStyle: Record<string, any> = {}

  aboutToAppear () {
    this.dynamicCenter = new DynamicCenter()
    
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)

    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })
  }

  build() {
    Flex(FlexManager.flexOptions(this.node1)) {
      Flex(FlexManager.flexOptions(this.node2)) {
        Image(this.node3.getAttribute('src'))
          .attrsImage(getNormalAttributes(this.node3, this.overwriteStyle))
          .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node3), this.node3, ['click']))
        if (!this.node4.isIgnore) {
          Image(this.node4.getAttribute('src'))
            .attrsImage(getNormalAttributes(this.node4, this.overwriteStyle))
        }
      }
      .attrs(getNormalAttributes(this.node2))
      if (!this.node.childNodes[1].isIgnore) {
        Flex(FlexManager.flexOptions(this.node.childNodes[1])) {
          Text(this.node5.textContent)
            .attrsText(getTextAttributes(this.node5, this.overwriteStyle))
        }
        .attrs(getNormalAttributes(this.node.childNodes[1]))
      }
      Flex(FlexManager.flexOptions(this.node6)) {
        Text(this.node7.textContent)
          .attrsText(getTextAttributes(this.node7, this.overwriteStyle))

        Flex(FlexManager.flexOptions(this.node8)) {
          ForEach(this.node8.childNodes, item => {
            createNode(item)
          }, item => item._nid)
        }
        .attrs(getNormalAttributes(this.node8))

        if (!this.node9.isIgnore) {
          Image(this.node9.getAttribute('src'))
            .attrsImage(getNormalAttributes(this.node9, this.overwriteStyle))
        }


        Flex(FlexManager.flexOptions(this.node6.childNodes[3])) {
          Flex(FlexManager.flexOptions(this.node10)) {
            Flex(FlexManager.flexOptions(this.node10.childNodes[0])) {
              Text(this.node10.childNodes[0].childNodes[0].textContent)
                .attrsText(getTextAttributes(this.node10.childNodes[0].childNodes[0], this.overwriteStyle))
              Text(this.node11.textContent)
                .attrsText(getTextAttributes(this.node11, this.overwriteStyle))
            }
            .attrs(getNormalAttributes(this.node10.childNodes[0]))

            if (!this.node10.childNodes[1].isIgnore) {
              Flex(FlexManager.flexOptions(this.node10.childNodes[1])) {
                Text(this.node10.childNodes[1].childNodes[0].textContent)
                  .attrsText(getTextAttributes(this.node10.childNodes[1].childNodes[0], this.overwriteStyle))
                Text(this.node12.textContent)
                  .attrsText(getTextAttributes(this.node12, this.overwriteStyle))
              }
              .attrs(getNormalAttributes(this.node10.childNodes[1]))
            }
          }
          .attrs(getNormalAttributes(this.node10))

          Flex(FlexManager.flexOptions(this.node6.childNodes[3].childNodes[1])) {
            Text(this.node6.childNodes[3].childNodes[1].childNodes[0].textContent)
              .attrsText(getTextAttributes(this.node6.childNodes[3].childNodes[1].childNodes[0], this.overwriteStyle))
          }
          .attrs(getNormalAttributes(this.node6.childNodes[3].childNodes[1]))
        }
        .attrs(getNormalAttributes(this.node6.childNodes[3]))
      }
      .attrs(getNormalAttributes(this.node6))
    }
    .attrs(getNormalAttributes(this.node1))
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node1), this.node1, ['click']))
  }
}

export default TaroFeedItem
