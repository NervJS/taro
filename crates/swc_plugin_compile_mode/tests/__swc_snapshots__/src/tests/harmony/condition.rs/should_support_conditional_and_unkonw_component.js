const TARO_TEMPLATES_f0t0 = `import { createLazyChildren, createChildItem } from '../render'
import commonStyleModify from '../style'
import { getButtonColor } from '../button'
import { FlexManager } from '../utils/flexManager'
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
  
  build() {
    Column() {
      if ((this.node0.childNodes[0] as TaroElement)._attrs.compileIf) {
        Column() {
          if (this.node0.childNodes[0].childNodes[0].nodeType === NodeType.TEXT_NODE && this.node0.childNodes[0].childNodes[0].parentNode) {
            if ((this.node0.childNodes[0].childNodes[0].parentNode as TaroButtonElement).tagName === 'BUTTON') {
              Text(this.node0.childNodes[0].childNodes[0].textContent)
              .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[0].childNodes[0] as TaroElement))
              .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[0].childNodes[0] as TaroElement))
              .fontSize((this.node0.childNodes[0].childNodes[0].parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node0.childNodes[0].childNodes[0].parentNode as TaroButtonElement)))
              .fontColor((this.node0.childNodes[0].childNodes[0].parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node0.childNodes[0].childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node0.childNodes[0].childNodes[0].parentNode as TaroButtonElement)._attrs.type).text))
            } else {
              Text(this.node0.childNodes[0].childNodes[0].textContent)
              .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[0].childNodes[0] as TaroElement))
              .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[0].childNodes[0] as TaroElement))
            }
          } else {
            Text(this.node0.childNodes[0].childNodes[0].textContent)
            .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node0.childNodes[0].childNodes[0] as TaroElement))
            .textNormalFontStyle(getNormalAttributes(this.node0.childNodes[0].childNodes[0]))
            .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[0].childNodes[0] as TaroElement))
            .textSpecialFontStyle(getFontAttributes(this.node0.childNodes[0].childNodes[0] as TaroElement))
            .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0].childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0].childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
            .onAreaChange(getComponentEventCallback(this.node0.childNodes[0].childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
              (this.node0.childNodes[0].childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
            }))
          }
        }
        .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[0] as TaroElement))
        .columnAttrs(getNormalAttributes(this.node0.childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node0.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        .alignItems(FlexManager.flexOptions(this.node0.childNodes[0] as TaroElement).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(this.node0.childNodes[0] as TaroElement).justifyContent)
      } else {
        createChildItem(this.node0.childNodes[0] as TaroElement)
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

          {condition ? <View hoverClass='test' compileIf={condition}>hello</View> : <UnKnow selectable>hello</UnKnow>}

        </View>;
}
