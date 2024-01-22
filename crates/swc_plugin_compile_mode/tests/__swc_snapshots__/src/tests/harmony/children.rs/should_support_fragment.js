const TARO_TEMPLATES_f0t0 = `import { createLazyChildren, createChildItem } from '../render'
import commonStyleModify from '../style'
import { getButtonColor } from '../button'
import { FlexManager } from '../utils/FlexManager'
import { TOUCH_EVENT_MAP } from '../utils/constant/event'
import { BUTTON_THEME_COLOR } from '../utils/constant/style'
import { getNodeThresholds, getNormalAttributes, getFontAttributes } from '../utils/helper'
import { NodeType, convertNumber2VP, TaroElement, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '../../runtime'
import { DynamicCenter } from '../utils/DynamicCenter'

import type { TaroButtonElement, TaroViewElement, TaroAny, TaroStyleType, TaroTextStyleType } from '../../runtime'

@Extend(Row)
function rowAttrs (style: TaroStyleType) {
  .constraintSize({
    minWidth: style.minWidth || style.width,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
}
@Extend(Column)
function columnAttrs (style: TaroStyleType) {
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

function getButtonFontSize (node: TaroButtonElement) {
  const isMini = node._attrs.size === 'mini'

  return isMini ? convertNumber2VP(26) : convertNumber2VP(36)
}
@Component
export default struct TARO_TEMPLATES_f0t0 {
  node: TaroViewElement = new TaroElement('Ignore')

  dynamicCenter: DynamicCenter = new DynamicCenter()

  aboutToAppear () {
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  @State node0: TaroElement = new TaroElement('Ignore')
  @State node1: TaroElement = new TaroElement('Ignore')
  @State node2: TaroElement = new TaroElement('Ignore')
  @State node3: TaroElement = new TaroElement('Ignore')
  @State node4: TaroElement = new TaroElement('Ignore')
  @State node5: TaroElement = new TaroElement('Ignore')
  @State node6: TaroElement = new TaroElement('Ignore')
  
  build() {
    Column() {
      if (this.node0.childNodes[0].nodeType === NodeType.TEXT_NODE && this.node0.childNodes[0].parentNode) {
        if ((this.node0.childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
          Text(this.node0.childNodes[0].textContent)
          .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[0] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[0] as TaroElement))
          .fontSize((this.node0.childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node0.childNodes[0].parentNode as TaroButtonElement)))
          .fontColor((this.node0.childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node0.childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node0.childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
        } else {
          Text(this.node0.childNodes[0].textContent)
          .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[0] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[0] as TaroElement))
        }
      } else {
        Text(this.node0.childNodes[0].textContent)
        .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node0.childNodes[0] as TaroElement))
        .textNormalFontStyle(getNormalAttributes(this.node0.childNodes[0]))
        .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[0] as TaroElement))
        .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node0.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      Column() {
        if (this.node1.childNodes[0].nodeType === NodeType.TEXT_NODE && this.node1.childNodes[0].parentNode) {
          if ((this.node1.childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
            Text(this.node1.childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node1.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node1.childNodes[0] as TaroElement))
            .fontSize((this.node1.childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node1.childNodes[0].parentNode as TaroButtonElement)))
            .fontColor((this.node1.childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node1.childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node1.childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
          } else {
            Text(this.node1.childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node1.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node1.childNodes[0] as TaroElement))
          }
        } else {
          Text(this.node1.childNodes[0].textContent)
          .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node1.childNodes[0] as TaroElement))
          .textNormalFontStyle(getNormalAttributes(this.node1.childNodes[0]))
          .attributeModifier(commonStyleModify.setNode(this.node1.childNodes[0] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node1.childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node1.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node1.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node1.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
      }
      .attributeModifier(commonStyleModify.setNode(this.node1 as TaroElement))
      .columnAttrs(getNormalAttributes(this.node1 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node1 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node1 as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node1 as TaroElement).justifyContent)
      Column() {
        if (this.node0.childNodes[2].childNodes[0].nodeType === NodeType.TEXT_NODE && this.node0.childNodes[2].childNodes[0].parentNode) {
          if ((this.node0.childNodes[2].childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
            Text(this.node0.childNodes[2].childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[2].childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[2].childNodes[0] as TaroElement))
            .fontSize((this.node0.childNodes[2].childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node0.childNodes[2].childNodes[0].parentNode as TaroButtonElement)))
            .fontColor((this.node0.childNodes[2].childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node0.childNodes[2].childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node0.childNodes[2].childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
          } else {
            Text(this.node0.childNodes[2].childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[2].childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[2].childNodes[0] as TaroElement))
          }
        } else {
          Text(this.node0.childNodes[2].childNodes[0].textContent)
          .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node0.childNodes[2].childNodes[0] as TaroElement))
          .textNormalFontStyle(getNormalAttributes(this.node0.childNodes[2].childNodes[0]))
          .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[2].childNodes[0] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[2].childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[2].childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[2].childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node0.childNodes[2].childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node0.childNodes[2].childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
      }
      .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[2] as TaroElement))
      .columnAttrs(getNormalAttributes(this.node0.childNodes[2] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[2] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[2] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[2] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[2] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node0.childNodes[2] as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node0.childNodes[2] as TaroElement).justifyContent)
      Column() {
        Column() {
          if (this.node2.childNodes[0].nodeType === NodeType.TEXT_NODE && this.node2.childNodes[0].parentNode) {
            if ((this.node2.childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
              Text(this.node2.childNodes[0].textContent)
              .attributeModifier(commonStyleModify.setNode(this.node2.childNodes[0] as TaroElement))
              .textSpecialFontStyle(getFontAttributes(this.node2.childNodes[0] as TaroElement))
              .fontSize((this.node2.childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node2.childNodes[0].parentNode as TaroButtonElement)))
              .fontColor((this.node2.childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node2.childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node2.childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
            } else {
              Text(this.node2.childNodes[0].textContent)
              .attributeModifier(commonStyleModify.setNode(this.node2.childNodes[0] as TaroElement))
              .textSpecialFontStyle(getFontAttributes(this.node2.childNodes[0] as TaroElement))
            }
          } else {
            Text(this.node2.childNodes[0].textContent)
            .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node2.childNodes[0] as TaroElement))
            .textNormalFontStyle(getNormalAttributes(this.node2.childNodes[0]))
            .attributeModifier(commonStyleModify.setNode(this.node2.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node2.childNodes[0] as TaroElement))
            .onVisibleAreaChange(getNodeThresholds(this.node2.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
            .onAreaChange(getComponentEventCallback(this.node2.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
              (this.node2.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
            }))
          }
        }
        .attributeModifier(commonStyleModify.setNode(this.node2 as TaroElement))
        .columnAttrs(getNormalAttributes(this.node2 as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node2 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node2 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node2 as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        .alignItems(FlexManager.flexOptions(this.node2 as TaroElement).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(this.node2 as TaroElement).justifyContent)
        Column() {
          if (this.node0.childNodes[3].childNodes[1].childNodes[0].nodeType === NodeType.TEXT_NODE && this.node0.childNodes[3].childNodes[1].childNodes[0].parentNode) {
            if ((this.node0.childNodes[3].childNodes[1].childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
              Text(this.node0.childNodes[3].childNodes[1].childNodes[0].textContent)
              .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement))
              .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement))
              .fontSize((this.node0.childNodes[3].childNodes[1].childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node0.childNodes[3].childNodes[1].childNodes[0].parentNode as TaroButtonElement)))
              .fontColor((this.node0.childNodes[3].childNodes[1].childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node0.childNodes[3].childNodes[1].childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node0.childNodes[3].childNodes[1].childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
            } else {
              Text(this.node0.childNodes[3].childNodes[1].childNodes[0].textContent)
              .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement))
              .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement))
            }
          } else {
            Text(this.node0.childNodes[3].childNodes[1].childNodes[0].textContent)
            .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement))
            .textNormalFontStyle(getNormalAttributes(this.node0.childNodes[3].childNodes[1].childNodes[0]))
            .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement))
            .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
            .onAreaChange(getComponentEventCallback(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
              (this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
            }))
          }
        }
        .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[3].childNodes[1] as TaroElement))
        .columnAttrs(getNormalAttributes(this.node0.childNodes[3].childNodes[1] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3].childNodes[1] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3].childNodes[1] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[3].childNodes[1] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node0.childNodes[3].childNodes[1] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        .alignItems(FlexManager.flexOptions(this.node0.childNodes[3].childNodes[1] as TaroElement).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(this.node0.childNodes[3].childNodes[1] as TaroElement).justifyContent)
      }
      .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[3] as TaroElement))
      .columnAttrs(getNormalAttributes(this.node0.childNodes[3] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[3] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[3] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node0.childNodes[3] as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node0.childNodes[3] as TaroElement).justifyContent)
      Column() {
        if (this.node3.childNodes[0].nodeType === NodeType.TEXT_NODE && this.node3.childNodes[0].parentNode) {
          if ((this.node3.childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
            Text(this.node3.childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node3.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node3.childNodes[0] as TaroElement))
            .fontSize((this.node3.childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node3.childNodes[0].parentNode as TaroButtonElement)))
            .fontColor((this.node3.childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node3.childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node3.childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
          } else {
            Text(this.node3.childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node3.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node3.childNodes[0] as TaroElement))
          }
        } else {
          Text(this.node3.childNodes[0].textContent)
          .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node3.childNodes[0] as TaroElement))
          .textNormalFontStyle(getNormalAttributes(this.node3.childNodes[0]))
          .attributeModifier(commonStyleModify.setNode(this.node3.childNodes[0] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node3.childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node3.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node3.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node3.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node3.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
      }
      .attributeModifier(commonStyleModify.setNode(this.node3 as TaroElement))
      .columnAttrs(getNormalAttributes(this.node3 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node3 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node3 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node3 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node3 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node3 as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node3 as TaroElement).justifyContent)
      Column() {
        if (this.node4.childNodes[0].nodeType === NodeType.TEXT_NODE && this.node4.childNodes[0].parentNode) {
          if ((this.node4.childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
            Text(this.node4.childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node4.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node4.childNodes[0] as TaroElement))
            .fontSize((this.node4.childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node4.childNodes[0].parentNode as TaroButtonElement)))
            .fontColor((this.node4.childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node4.childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node4.childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
          } else {
            Text(this.node4.childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node4.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node4.childNodes[0] as TaroElement))
          }
        } else {
          Text(this.node4.childNodes[0].textContent)
          .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node4.childNodes[0] as TaroElement))
          .textNormalFontStyle(getNormalAttributes(this.node4.childNodes[0]))
          .attributeModifier(commonStyleModify.setNode(this.node4.childNodes[0] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node4.childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node4.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node4.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node4.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node4.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
      }
      .attributeModifier(commonStyleModify.setNode(this.node4 as TaroElement))
      .columnAttrs(getNormalAttributes(this.node4 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node4 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node4 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node4 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node4 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node4 as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node4 as TaroElement).justifyContent)
      Column() {
        if (this.node5.childNodes[0].nodeType === NodeType.TEXT_NODE && this.node5.childNodes[0].parentNode) {
          if ((this.node5.childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
            Text(this.node5.childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node5.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node5.childNodes[0] as TaroElement))
            .fontSize((this.node5.childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node5.childNodes[0].parentNode as TaroButtonElement)))
            .fontColor((this.node5.childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node5.childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node5.childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
          } else {
            Text(this.node5.childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node5.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node5.childNodes[0] as TaroElement))
          }
        } else {
          Text(this.node5.childNodes[0].textContent)
          .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node5.childNodes[0] as TaroElement))
          .textNormalFontStyle(getNormalAttributes(this.node5.childNodes[0]))
          .attributeModifier(commonStyleModify.setNode(this.node5.childNodes[0] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node5.childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node5.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node5.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node5.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node5.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
      }
      .attributeModifier(commonStyleModify.setNode(this.node5 as TaroElement))
      .columnAttrs(getNormalAttributes(this.node5 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node5 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node5 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node5 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node5 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node5 as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node5 as TaroElement).justifyContent)
      Column() {
        if (this.node0.childNodes[7].childNodes[0].nodeType === NodeType.TEXT_NODE && this.node0.childNodes[7].childNodes[0].parentNode) {
          if ((this.node0.childNodes[7].childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
            Text(this.node0.childNodes[7].childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[7].childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[7].childNodes[0] as TaroElement))
            .fontSize((this.node0.childNodes[7].childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node0.childNodes[7].childNodes[0].parentNode as TaroButtonElement)))
            .fontColor((this.node0.childNodes[7].childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node0.childNodes[7].childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node0.childNodes[7].childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
          } else {
            Text(this.node0.childNodes[7].childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[7].childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[7].childNodes[0] as TaroElement))
          }
        } else {
          Text(this.node0.childNodes[7].childNodes[0].textContent)
          .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node0.childNodes[7].childNodes[0] as TaroElement))
          .textNormalFontStyle(getNormalAttributes(this.node0.childNodes[7].childNodes[0]))
          .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[7].childNodes[0] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[7].childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[7].childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[7].childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node0.childNodes[7].childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node0.childNodes[7].childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
      }
      .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[7] as TaroElement))
      .columnAttrs(getNormalAttributes(this.node0.childNodes[7] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[7] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[7] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[7] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[7] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node0.childNodes[7] as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node0.childNodes[7] as TaroElement).justifyContent)
      Column() {
        if (this.node0.childNodes[8].childNodes[0].nodeType === NodeType.TEXT_NODE && this.node0.childNodes[8].childNodes[0].parentNode) {
          if ((this.node0.childNodes[8].childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
            Text(this.node0.childNodes[8].childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[8].childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[8].childNodes[0] as TaroElement))
            .fontSize((this.node0.childNodes[8].childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node0.childNodes[8].childNodes[0].parentNode as TaroButtonElement)))
            .fontColor((this.node0.childNodes[8].childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node0.childNodes[8].childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node0.childNodes[8].childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
          } else {
            Text(this.node0.childNodes[8].childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[8].childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[8].childNodes[0] as TaroElement))
          }
        } else {
          Text(this.node0.childNodes[8].childNodes[0].textContent)
          .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node0.childNodes[8].childNodes[0] as TaroElement))
          .textNormalFontStyle(getNormalAttributes(this.node0.childNodes[8].childNodes[0]))
          .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[8].childNodes[0] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[8].childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[8].childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[8].childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node0.childNodes[8].childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node0.childNodes[8].childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
      }
      .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[8] as TaroElement))
      .columnAttrs(getNormalAttributes(this.node0.childNodes[8] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[8] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[8] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[8] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[8] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node0.childNodes[8] as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node0.childNodes[8] as TaroElement).justifyContent)
      Column() {
        if (this.node6.childNodes[0].nodeType === NodeType.TEXT_NODE && this.node6.childNodes[0].parentNode) {
          if ((this.node6.childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
            Text(this.node6.childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node6.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node6.childNodes[0] as TaroElement))
            .fontSize((this.node6.childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node6.childNodes[0].parentNode as TaroButtonElement)))
            .fontColor((this.node6.childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node6.childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node6.childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
          } else {
            Text(this.node6.childNodes[0].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node6.childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node6.childNodes[0] as TaroElement))
          }
        } else {
          Text(this.node6.childNodes[0].textContent)
          .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node6.childNodes[0] as TaroElement))
          .textNormalFontStyle(getNormalAttributes(this.node6.childNodes[0]))
          .attributeModifier(commonStyleModify.setNode(this.node6.childNodes[0] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node6.childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node6.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node6.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node6.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node6.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
      }
      .attributeModifier(commonStyleModify.setNode(this.node6 as TaroElement))
      .columnAttrs(getNormalAttributes(this.node6 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node6 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node6 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node6 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node6 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node6 as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node6 as TaroElement).justifyContent)
    }
    .attributeModifier(commonStyleModify.setNode(this.node0 as TaroElement))
    .columnAttrs(getNormalAttributes(this.node0 as TaroElement))
    .onVisibleAreaChange(getNodeThresholds(this.node0 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node0 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      (this.node0 as TaroElement)._nodeInfo.areaInfo = res[1]
    }))
    .alignItems(FlexManager.flexOptions(this.node0 as TaroElement).alignItems as HorizontalAlign)
    .justifyContent(FlexManager.flexOptions(this.node0 as TaroElement).justifyContent)
  }
}
`;
function Index() {
    return <View compileMode="f0t0" _dynamicID="node0">

            {content0}

            <>

              <View _dynamicID="node1">{content1}</View>

              <View>hello</View>

              <View>

                <>

                  <View _dynamicID="node2">{content2}</View>

                  <View>hello!</View>

                </>

              </View>

              <View _dynamicID="node3">{content3}</View>

            </>

            <View _dynamicID="node4">{content4}</View>

            <>

              <View _dynamicID="node5">{content5}</View>

            </>

            <>

              <View>hello!!</View>

            </>

            <View>hello!!!</View>

            <View _dynamicID="node6">{content6}</View>

          </View>;
}
