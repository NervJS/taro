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

function getImageMode (mode: string): ImageFit {
  switch (mode) {
    case 'aspectFit': return ImageFit.Contain
    case 'aspectFill': return ImageFit.Cover
    case 'scaleToFill': return ImageFit.Fill
    case 'widthFix': return ImageFit.Auto
    case 'heightFix': return ImageFit.Auto
    default: return ImageFit.Contain
  }
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
    Image((this.node0 as TaroElement).getAttribute('src'))
    .objectFit(getImageMode((this.node0 as TaroElement).getAttribute('mode')))
    .attributeModifier(commonStyleModify.setNode(this.node0 as TaroElement))
    .onVisibleAreaChange(getNodeThresholds(this.node0 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node0 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      (this.node0 as TaroElement)._nodeInfo.areaInfo = res[1]
    }))
  }
}
`;
const TARO_TEMPLATES_f0t1 = `import { createLazyChildren, createChildItem } from '../render'
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
export default struct TARO_TEMPLATES_f0t1 {
  node: TaroViewElement = new TaroElement('Ignore')

  dynamicCenter: DynamicCenter = new DynamicCenter()

  aboutToAppear () {
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  @State node0: TaroElement = new TaroElement('Ignore')
  @State node1: TaroElement = new TaroElement('Ignore')
  
  build() {
    Column() {
      if (this.node1.nodeType === NodeType.TEXT_NODE && this.node1.parentNode) {
        if ((this.node1.parentNode as TaroButtonElement).tagName === 'BUTTON') {
          Text(this.node1.textContent)
          .attributeModifier(commonStyleModify.setNode(this.node1 as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node1 as TaroElement))
          .fontSize((this.node1.parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.node1.parentNode as TaroButtonElement)))
          .fontColor((this.node1.parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.node1.parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node1.parentNode as TaroButtonElement)._attrs.type).text))
        } else {
          Text(this.node1.textContent)
          .attributeModifier(commonStyleModify.setNode(this.node1 as TaroElement))
          .textSpecialFontStyle(getFontAttributes(this.node1 as TaroElement))
        }
      } else {
        Text(this.node1.textContent)
        .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node1 as TaroElement))
        .textNormalFontStyle(getNormalAttributes(this.node1))
        .attributeModifier(commonStyleModify.setNode(this.node1 as TaroElement))
        .textSpecialFontStyle(getFontAttributes(this.node1 as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node1 as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
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
    return <View>

        <Image src={mySrc} compileMode="f0t0" _dynamicID="node0"/>

        <View compileMode="f0t1" _dynamicID="node0">

          <Text _dynamicID="node1">{myText}</Text>

        </View>

      </View>;
}
