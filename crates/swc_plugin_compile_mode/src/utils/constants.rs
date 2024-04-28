pub const COMPILE_MODE: &str = "compileMode";
pub const COMPILE_IF: &str = "compileIf";
pub const COMPILE_ELSE: &str = "compileElse";
pub const COMPILE_IGNORE: &str = "compileIgnore";
pub const COMPILE_FOR: &str = "compileFor";
pub const COMPILE_FOR_KEY: &str = "compileForKey";
pub const EVENT_HANDLER: &str = "eh";
pub const DATA_SID: &str = "data-sid";
pub const TMPL_DATA_ROOT: &str = "i.";
pub const ID: &str = "id";
pub const LOOP_WRAPPER_ID: i32 = -1;
pub const DYNAMIC_ID: &str = "_dynamicID";
pub const REACT_RESERVED: [&str; 2] = ["key", "ref"];

pub const VIEW_TAG: &str = "view";
pub const TEXT_TAG: &str = "text";
pub const IMAGE_TAG: &str = "image";

pub const STYLE_ATTR: &str = "style";
pub const DIRECTION_ATTR: &str = "harmonyDirection";

pub const HARMONY_IMPORTER: &str = "import {
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

";

pub const HARMONY_TEXT_HELPER_FUNCITON: &str = r#"


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

function getButtonFontSize (node: TaroButtonElement): string | number {
  const isMini = node._attrs.size === 'mini'

  return isMini ? convertNumber2VP(26) : convertNumber2VP(36)
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

"#;

pub const HARMONY_TEXT_BUILDER: &str = r#"@Builder
function createText (node: TaroTextElement) {
  if (node.nodeType === NodeType.TEXT_NODE) {
    if (node.parentNode) {
      if ((node.parentNode as TaroElement).tagName === 'BUTTON') {
        Text(node.textContent)
          .attributeModifier(textModify.setNode(node?.parentElement as TaroElement, {
            fontSize: getButtonFontSize(node.parentNode as TaroButtonElement),
            color: getButtonColor(node.parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((node.parentNode as TaroButtonElement)._attrs.type || '').text)
          }))
      } else {
        Text(node.textContent)
          .attributeModifier(textModify.setNode(node?.parentElement as TaroElement))
          .width(getTextInViewWidth(node.parentElement))
      }
    }
  } else {
    Text(node.textContent) {
      // text 下还有标签
      if (node.childNodes.length > 1 || ((node.childNodes[0] && node.childNodes[0] as TaroElement)?.nodeType === NodeType.ELEMENT_NODE)) {
        ForEach(node.childNodes, (item: TaroElement) => {
          createTextChildNode(item, getSpanVerticalAlign(node.hmStyle?.verticalAlign))
        }, (item: TaroElement) => item._nid)
      }
    }
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .attributeModifier(textModify.setNode(node).withNormalStyle())
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
  }
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
"#;

// pub const HARMONY_TEXT_STYLE_BIND: &str = r#"@Extend(Text)
// function textNormalFontStyle (style: HarmonyStyle) {
//   .id(style.id)
//   .key(style.id)
//   .opacity(style.opacity)
//   .fontColor(style.color)
//   .fontSize(style.fontSize)
//   .fontWeight(style.fontWeight)
//   .fontStyle(style.fontStyle)
//   .fontFamily(style.fontFamily)
//   .lineHeight(style.lineHeight)
//   .decoration({
//     type: style.textDecoration?.type,
//     color: style.color
//   })
// }

// @Extend(Text)
// function textSpecialFontStyle(attr: TaroTextStyleType) {
//   .textAlign(attr.textAlign)
//   .textOverflow(attr.textOverflow)
//   .maxLines(attr.WebkitLineClamp)
//   .letterSpacing(attr.letterSpacing)
// }

// function getButtonFontSize (node: TaroButtonElement) {
//   const isMini = node._attrs.size === 'mini'

//   return isMini ? convertNumber2VP(26) : convertNumber2VP(36)
// }
// "#;

// pub const HARMONY_TEXT_STYLE_BIND: &str = r#"function getButtonFontSize (node: TaroButtonElement): string | number {
//   const isMini = node._attrs.size === 'mini'

//   return isMini ? convertNumber2VP(26) : convertNumber2VP(36)
// }
// "#;

// pub const HARMONY_IMAGE_STYLE_BIND: &str = r#"function getImageMode (mode: string): ImageFit {
//   switch (mode) {
//     case 'aspectFit': return ImageFit.Contain
//     case 'aspectFill': return ImageFit.Cover
//     case 'scaleToFill': return ImageFit.Fill
//     case 'widthFix': return ImageFit.Auto
//     case 'heightFix': return ImageFit.Auto
//     default: return ImageFit.Contain
//   }
// }
// "#;
