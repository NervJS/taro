const TARO_TEMPLATES_f0t0 = `import {
  rowModify,
  FlexManager,
  columnModify,
  DynamicCenter,
  getButtonColor,
  TOUCH_EVENT_MAP,
  getFontAttributes,
  commonStyleModify,
  getNodeThresholds,
  BUTTON_THEME_COLOR,
  getNormalAttributes
} from '@tarojs/components'
import { NodeType, convertNumber2VP, TaroElement, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'
import { createLazyChildren, createChildItem } from '../render'

import type { HarmonyStyle, TaroButtonElement, TaroViewElement, TaroAny, TaroStyleType, TaroTextStyleType } from '@tarojs/runtime'

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
  
  build() {
    Column() {
      Column() {
        createChildItem(this.node1.childNodes[0] as TaroElement)
      }
      .attributeModifier(columnModify.setNode(this.node1 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node1 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Column() {
        createChildItem(this.node2.childNodes[0] as TaroElement)
        if (this.node2.childNodes[1].nodeType === NodeType.TEXT_NODE && this.node2.childNodes[1].parentNode) {
          if ((this.node2.childNodes[1].parentNode as TaroButtonElement).tagName === 'BUTTON') {
            Text(this.node2.childNodes[1].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node2.childNodes[1] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node2.childNodes[1] as TaroElement))
            .fontSize((this.node2.childNodes[1].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node2.childNodes[1].parentNode as TaroButtonElement)))
            .fontColor((this.node2.childNodes[1].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node2.childNodes[1].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node2.childNodes[1].parentNode as TaroButtonElement)._attrs.type).text))
          } else {
            Text(this.node2.childNodes[1].textContent)
            .attributeModifier(commonStyleModify.setNode(this.node2.childNodes[1] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node2.childNodes[1] as TaroElement))
          }
        } else {
          Text(this.node2.childNodes[1].textContent)
          .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node2.childNodes[1] as TaroElement))
          .textNormalFontStyle(getNormalAttributes(this.node2.childNodes[1]))
          .attributeModifier(commonStyleModify.setNode(this.node2.childNodes[1] as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node2.childNodes[1] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node2.childNodes[1] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2.childNodes[1] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node2.childNodes[1] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node2.childNodes[1] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
      }
      .attributeModifier(columnModify.setNode(this.node2 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node2 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node2 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node2 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Column() {
        createChildItem(this.node3.childNodes[0] as TaroElement)
      }
      .attributeModifier(columnModify.setNode(this.node3 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node3 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node3 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node3 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node3 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
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
      .attributeModifier(columnModify.setNode(this.node4 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node4 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node4 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node4 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node4 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
    }
    .attributeModifier(columnModify.setNode(this.node0 as TaroElement))
    .onVisibleAreaChange(getNodeThresholds(this.node0 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node0 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      (this.node0 as TaroElement)._nodeInfo.areaInfo = res[1]
    }))
  }
}
`;
function Index() {
    return <View compileMode="f0t0" _dynamicID="node0">

            <View _dynamicID="node1">{renderHeader()}</View>

            <View _dynamicID="node2">

              {renderHeader()}

              {normalFunc()}

            </View>

            <View _dynamicID="node3">{this.methods.renderFooter()}</View>

            <View _dynamicID="node4">{normalFunc()}</View>

          </View>;
}
