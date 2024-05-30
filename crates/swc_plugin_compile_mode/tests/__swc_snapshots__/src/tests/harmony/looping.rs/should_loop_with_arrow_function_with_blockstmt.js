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
  getStyleAttr,
  getNormalAttributes,
  shouldBindEvent,
  textModify,
  setNormalTextAttributeIntoInstance,
  getImageMode
} from '@tarojs/components'
import {
  NodeType,
  convertNumber2VP,
  TaroElement,
  eventHandler,
  getComponentEventCallback,
  AREA_CHANGE_EVENT_NAME,
  VISIBLE_CHANGE_EVENT_NAME
} from '@tarojs/runtime'
import { 
  createLazyChildren, 
  createChildItem 
} from '../render'

import type {
  TaroTextElement,
  HarmonyStyle,
  TaroButtonElement,
  TaroViewElement,
  TaroAny,
  TaroStyleType,
  TaroTextStyleType
} from '@tarojs/runtime'
import { isString } from '@tarojs/shared'
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
    type: style.textDecoration?.type,
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

@Builder
function createTextChildNode (item: TaroElement, align: ImageSpanAlignment) {
  if (item.tagName === 'IMAGE') {
    ImageSpan(item.getAttribute('src'))
      .objectFit(getImageMode(item.getAttribute('mode')))
      .verticalAlign(align)
      .width(item._st.hmStyle.width)
      .height(item._st.hmStyle.height)
      .margin({
        top: item._st.hmStyle.marginTop,
        left: item._st.hmStyle.marginLeft,
        right: item._st.hmStyle.marginRight,
        bottom: item._st.hmStyle.marginBottom,
      })
      .padding({
        top: item._st.hmStyle.paddingTop,
        left: item._st.hmStyle.paddingLeft,
        right: item._st.hmStyle.paddingRight,
        bottom: item._st.hmStyle.paddingBottom,
      })
      .textBackgroundStyle({
        color: item._st.hmStyle.backgroundColor,
        radius: {
          topLeft: item._st.hmStyle.borderTopLeftRadius,
          topRight: item._st.hmStyle.borderTopRightRadius,
          bottomLeft: item._st.hmStyle.borderBottomLeftRadius,
          bottomRight: item._st.hmStyle.borderBottomRightRadius,
        }
      })
      .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', item), item, ['click']))
  } else if (item.nodeType === NodeType.TEXT_NODE) {
    Span(item.textContent)
  } else if (item.tagName === 'TEXT') {
    Span(item.textContent)
      .attributeModifier((new SpanStyleModify()).setNode(item as TaroTextElement))
      .letterSpacing(item._st.hmStyle.letterSpacing)
      .textBackgroundStyle({
        color: item._st.hmStyle.backgroundColor,
        radius: {
          topLeft: item._st.hmStyle.borderTopLeftRadius,
          topRight: item._st.hmStyle.borderTopRightRadius,
          bottomLeft: item._st.hmStyle.borderBottomLeftRadius,
          bottomRight: item._st.hmStyle.borderBottomRightRadius,
        }
      })
      .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', item), item, ['click']))
  }
}

class SpanStyleModify implements AttributeModifier<SpanAttribute> {
  node: TaroTextElement | null = null
  style: HarmonyStyle | null = null
  overwriteStyle: Record<string, TaroAny> = {}
  withNormal = false

  setNode (node: TaroTextElement) {
    this.node = node
    this.style = getNormalAttributes(this.node)
    return this
  }

  applyNormalAttribute(instance: SpanAttribute): void {
    if (this.node && this.style) {
      setNormalTextAttributeIntoInstance(instance, this.style, this.node)
    }
  }
}

function getSpanVerticalAlign (verticalAlign?: Alignment) {
  switch (verticalAlign) {
    case Alignment.Start:
    case Alignment.TopStart:
    case Alignment.Top:
    case Alignment.TopEnd: {
      return ImageSpanAlignment.TOP
    }
    case Alignment.End:
    case Alignment.BottomStart:
    case Alignment.Bottom:
    case Alignment.BottomEnd: {
      return ImageSpanAlignment.BOTTOM
    }
    case Alignment.Center: {
      return ImageSpanAlignment.CENTER
    }
  }
  return ImageSpanAlignment.BASELINE
}

function getTextInViewWidth (node: TaroElement | null): TaroAny {
  if (node) {
    const hmStyle = node.hmStyle || {}
    const isFlexView = hmStyle.display === 'flex'
    const width: TaroAny = getStyleAttr(node, 'width')
    const isPercentWidth = isString(width) && width.includes('%')

    return isFlexView || isPercentWidth ? null : getStyleAttr(node, 'width')
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
    Column() {
      ForEach(this.node0.childNodes, (item: TaroElement) => {
        Column() {
          if (item.childNodes[0].nodeType === NodeType.TEXT_NODE) {
            if (item.childNodes[0].parentNode) {
              if ((item.childNodes[0].parentNode as TaroElement).tagName === 'BUTTON') {
                Text(item.childNodes[0].textContent)
                  .attributeModifier(textModify.setNode(item.childNodes[0]?.parentElement as TaroElement, {
                    fontSize: getButtonFontSize(item.childNodes[0].parentNode as TaroButtonElement),
                    color: getButtonColor(item.childNodes[0].parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((item.childNodes[0].parentNode as TaroButtonElement)._attrs.type || '').text)
                  }))
              } else {
                Text(item.childNodes[0].textContent)
                  .attributeModifier(textModify.setNode(item.childNodes[0]?.parentElement as TaroElement))
                  .width(getTextInViewWidth(item.childNodes[0].parentElement))
              }
            }
          } else {
            Text(item.childNodes[0].textContent) {
              // text 下还有标签
              if (item.childNodes[0].childNodes.length > 1 || ((item.childNodes[0].childNodes[0] && item.childNodes[0].childNodes[0] as TaroElement)?.nodeType === NodeType.ELEMENT_NODE)) {
                ForEach(item.childNodes[0].childNodes, (item: TaroElement) => {
                  createTextChildNode(item, getSpanVerticalAlign((item.childNodes[0] as TaroElement).hmStyle?.verticalAlign))
                }, (item: TaroElement) => item._nid)
              }
            }
            .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', item.childNodes[0]  as TaroElement), item.childNodes[0]  as TaroElement, ['click']))
            .attributeModifier(textModify.setNode(item.childNodes[0] as TaroElement).withNormalStyle())
            .onVisibleAreaChange(getNodeThresholds((item.childNodes[0] as TaroElement)) || [0.0, 1.0], getComponentEventCallback((item.childNodes[0] as TaroElement), VISIBLE_CHANGE_EVENT_NAME))
            .onAreaChange(getComponentEventCallback((item.childNodes[0] as TaroElement), AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
              (item.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
            }))
          }
        }
        .attributeModifier(columnModify.setNode(item as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(item as TaroElement) || [0.0, 1.0], getComponentEventCallback(item as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(item as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (item as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }, (item: TaroElement) => item._nid);
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

            {list.map((item)=>{
        return <View compileFor compileForKey="sid">{item}</View>;
    })}

          </View>;
}
