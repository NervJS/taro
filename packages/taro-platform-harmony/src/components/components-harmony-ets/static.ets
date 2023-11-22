// TODO: 后续这个文件通过半编译逻辑生成
import { TaroIgnoreElement, eventHandler, DynamicCenter, getComponentEventCallback, AREA_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import { createNode } from './render'
import { FlexManager } from './utils/FlexManager'

import { transformW3CToHarmonyInStyle, getNormalAttributes, getFontAttributes, shouldBindEvent } from './utils/helper'

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
  .key(id)
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

function getTextAttributes (node: TaroViewElement) {
  const attrs = {
    ...getNormalAttributes(node),
    ...getFontAttributes(node)
  }

  transformW3CToHarmonyInStyle(node._st, attrs)

  return attrs
}

@Component
export default struct TaroFeedItem {
  @ObjectLink node: TaroViewElement

  @State node1: TaroViewElement = new TaroIgnoreElement()

  @State node2: TaroViewElement = new TaroIgnoreElement()

  @State node3: TaroViewElement = new TaroIgnoreElement()

  @State node4: TaroViewElement = new TaroIgnoreElement()

  @State node5: TaroViewElement = new TaroIgnoreElement()

  @State node6: TaroViewElement = new TaroIgnoreElement()

  @State node7: TaroViewElement = new TaroIgnoreElement()

  @State node8: TaroViewElement = new TaroIgnoreElement()

  @State node9: TaroViewElement = new TaroIgnoreElement()

  @State node10: TaroViewElement = new TaroIgnoreElement()

  @State node11: TaroViewElement = new TaroIgnoreElement()

  @State node12: TaroViewElement = new TaroIgnoreElement()

  dynamicCount = 11

  dynamicCenter: DynamicCenter

  nodeInfoMap: any = {}


  aboutToAppear () {
    this.dynamicCenter = new DynamicCenter()

    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  build() {
    Flex(FlexManager.flexOptions(this.node1)) {
      Flex(FlexManager.flexOptions(this.node2)) {
        Image(this.node3.getAttribute('src'))
          .attrsImage(getNormalAttributes(this.node3))
          .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node3), this.node3, ['click']))
        if (!this.node4.isIgnore) {
          Image(this.node4.getAttribute('src'))
            .attrsImage(getNormalAttributes(this.node4))
            .onAreaChange(getComponentEventCallback(this.node4, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
              const [_, areaResult] = eventResult

              this.nodeInfoMap[this.node4._nid].areaInfo = areaResult
            }))
        }
      }
      .attrs(getNormalAttributes(this.node2))
      if (!this.node.childNodes[1].isIgnore) {
        Flex(FlexManager.flexOptions(this.node.childNodes[1])) {
          Text(this.node5.textContent)
            .attrsText(getTextAttributes(this.node5))
        }
        .attrs(getNormalAttributes(this.node.childNodes[1]))
      }
      Flex(FlexManager.flexOptions(this.node6)) {
        Text(this.node7.textContent)
          .attrsText(getTextAttributes(this.node7))

        Flex(FlexManager.flexOptions(this.node8)) {
          ForEach(this.node8.childNodes, item => {
            createNode(item)
          }, item => item._nid)
        }
        .attrs(getNormalAttributes(this.node8))

        if (!this.node9.isIgnore) {
          Image(this.node9.getAttribute('src'))
            .attrsImage(getNormalAttributes(this.node9))
        }


        Flex(FlexManager.flexOptions(this.node6.childNodes[3])) {
          Flex(FlexManager.flexOptions(this.node10)) {
            Flex(FlexManager.flexOptions(this.node10.childNodes[0])) {
              Text(this.node10.childNodes[0].childNodes[0].textContent)
                .attrsText(getTextAttributes(this.node10.childNodes[0].childNodes[0]))
              Text(this.node11.textContent)
                .attrsText(getTextAttributes(this.node11))
            }
            .attrs(getNormalAttributes(this.node10.childNodes[0]))

            if (!this.node10.childNodes[1].isIgnore) {
              Flex(FlexManager.flexOptions(this.node10.childNodes[1])) {
                Text(this.node10.childNodes[1].childNodes[0].textContent)
                  .attrsText(getTextAttributes(this.node10.childNodes[1].childNodes[0]))
                Text(this.node12.textContent)
                  .attrsText(getTextAttributes(this.node12))
              }
              .attrs(getNormalAttributes(this.node10.childNodes[1]))
            }
          }
          .attrs(getNormalAttributes(this.node10))

          Flex(FlexManager.flexOptions(this.node6.childNodes[3].childNodes[1])) {
            Text(this.node6.childNodes[3].childNodes[1].childNodes[0].textContent)
              .attrsText(getTextAttributes(this.node6.childNodes[3].childNodes[1].childNodes[0]))
          }
          .attrs(getNormalAttributes(this.node6.childNodes[3].childNodes[1]))
          .onAreaChange(getComponentEventCallback(this.node6.childNodes[3].childNodes[1], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult

            this.nodeInfoMap[this.node6.childNodes[3].childNodes[1]._nid].areaInfo = areaResult
          }))
        }
        .attrs(getNormalAttributes(this.node6.childNodes[3]))
      }
      .attrs(getNormalAttributes(this.node6))
    }
    .attrs(getNormalAttributes(this.node1))
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node1), this.node1, ['click']))
  }
}
