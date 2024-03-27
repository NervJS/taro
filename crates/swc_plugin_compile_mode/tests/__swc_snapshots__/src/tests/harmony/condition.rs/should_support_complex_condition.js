const TARO_TEMPLATES_f0t0 = `import { createLazyChildren, createChildItem } from '../render'
import commonStyleModify from '@tarojs/components/style'
import { getButtonColor } from '@tarojs/components/button'
import { FlexManager } from '@tarojs/components/utils/flexManager'
import { TOUCH_EVENT_MAP } from '@tarojs/components/utils/constant/event'
import { BUTTON_THEME_COLOR } from '@tarojs/components/utils/constant/style'
import { getNodeThresholds, getNormalAttributes, getFontAttributes } from '@tarojs/components/utils/helper'
import { NodeType, convertNumber2VP, TaroElement, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'
import { DynamicCenter } from '@tarojs/components/utils/DynamicCenter'

import type { HarmonyStyle, TaroButtonElement, TaroViewElement, TaroAny, TaroStyleType, TaroTextStyleType } from '@tarojs/runtime'

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
function textNormalFontStyle (style: HarmonyStyle) {
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
  
  build() {
    Column() {
      if ((this.node0.childNodes[0] as TaroElement)._attrs.compileIf) {
        Column() {}
        .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[0] as TaroElement))
        .columnAttrs(getNormalAttributes(this.node0.childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node0.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        .alignItems(FlexManager.flexOptions(this.node0.childNodes[0] as TaroElement).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(this.node0.childNodes[0] as TaroElement).justifyContent)
        .onClick(e => eventHandler(e, 'click', this.node0.childNodes[0] as TaroElement))
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
      if ((this.node0.childNodes[4] as TaroElement)._attrs.compileIf) {
        Column() {}
        .attributeModifier(commonStyleModify.setNode(this.node4 as TaroElement))
        .columnAttrs(getNormalAttributes(this.node4 as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node4 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node4 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node4 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node4 as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        .alignItems(FlexManager.flexOptions(this.node4 as TaroElement).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(this.node4 as TaroElement).justifyContent)
      } else {
        Column() {}
        .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[4] as TaroElement))
        .columnAttrs(getNormalAttributes(this.node0.childNodes[4] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[4] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[4] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[4] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node0.childNodes[4] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        .alignItems(FlexManager.flexOptions(this.node0.childNodes[4] as TaroElement).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(this.node0.childNodes[4] as TaroElement).justifyContent)
      }
      if ((this.node0.childNodes[5] as TaroElement)._attrs.compileIf) {
        Column() {
          if ((this.node5.childNodes[0] as TaroElement)._attrs.compileIf) {
            Column() {}
            .attributeModifier(commonStyleModify.setNode(this.node5.childNodes[0] as TaroElement))
            .columnAttrs(getNormalAttributes(this.node5.childNodes[0] as TaroElement))
            .onVisibleAreaChange(getNodeThresholds(this.node5.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node5.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
            .onAreaChange(getComponentEventCallback(this.node5.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
              (this.node5.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
            }))
            .alignItems(FlexManager.flexOptions(this.node5.childNodes[0] as TaroElement).alignItems as HorizontalAlign)
            .justifyContent(FlexManager.flexOptions(this.node5.childNodes[0] as TaroElement).justifyContent)
          } else {
            Column() {}
            .attributeModifier(commonStyleModify.setNode(this.node5.childNodes[0] as TaroElement))
            .columnAttrs(getNormalAttributes(this.node5.childNodes[0] as TaroElement))
            .onVisibleAreaChange(getNodeThresholds(this.node5.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node5.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
            .onAreaChange(getComponentEventCallback(this.node5.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
              (this.node5.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
            }))
            .alignItems(FlexManager.flexOptions(this.node5.childNodes[0] as TaroElement).alignItems as HorizontalAlign)
            .justifyContent(FlexManager.flexOptions(this.node5.childNodes[0] as TaroElement).justifyContent)
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
      } else {
        Column() {}
        .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[5] as TaroElement))
        .columnAttrs(getNormalAttributes(this.node0.childNodes[5] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[5] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[5] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[5] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node0.childNodes[5] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        .alignItems(FlexManager.flexOptions(this.node0.childNodes[5] as TaroElement).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(this.node0.childNodes[5] as TaroElement).justifyContent)
      }
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

          {condition1 ? <View onClick={()=>condition2 && doSth()} compileIf={condition1}/> : <View compileIgnore/>}

          <View _dynamicID="node1">{condition1 && ident}</View>

          <View _dynamicID="node2">{condition1 && obj.property}</View>

          <View _dynamicID="node3">{condition1 && fn()}</View>

          {condition1 ? <View className={condition2 ? '' : ''} compileIf={condition1} _dynamicID="node4"/> : <View/>}

          {condition1 ? <View compileIf={condition1} _dynamicID="node5">{condition2 ? <View compileIf={condition2}/> : <View/>}</View> : <View/>}

        </View>;
}
