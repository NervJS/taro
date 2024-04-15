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
  setNormalTextAttributeIntoInstance
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
@Builder
function createTextChildNode (item: TaroElement, align: ImageSpanAlignment) {
  if (item.tagName === 'IMAGE') {
    ImageSpan(item.getAttribute('src'))
      .attributeModifier(commonStyleModify.setNode(item))
      .objectFit(getImageMode(item.getAttribute('mode')))
      .verticalAlign(align)
      .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', item), item, ['click']))
  } else if (item.nodeType === NodeType.TEXT_NODE) {
    Span(item.textContent)
  } else if (item.tagName === 'TEXT') {
    Span(item.textContent)
      .attributeModifier((new SpanStyleModify()).setNode(item as TaroTextElement))
      .letterSpacing(item._st.hmStyle.letterSpacing)
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

"#;

pub const HARMONY_TEXT_STYLE_BIND: &str = r#"@Extend(Text)
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
    type: style.textDecoration  as TaroAny,
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
"#;

pub const HARMONY_IMAGE_STYLE_BIND: &str = r#"function getImageMode (mode: string): ImageFit {
  switch (mode) {
    case 'aspectFit': return ImageFit.Contain
    case 'aspectFill': return ImageFit.Cover
    case 'scaleToFill': return ImageFit.Fill
    case 'widthFix': return ImageFit.Auto
    case 'heightFix': return ImageFit.Auto
    default: return ImageFit.Contain
  }
}
"#;
