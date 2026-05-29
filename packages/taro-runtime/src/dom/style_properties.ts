/*
 *
 * https://www.w3.org/Style/CSS/all-properties.en.html
 */

const WEBKIT = 'webkit'

const styleProperties = [
  'all',
  'appearance',
  'backdropFilter',
  'blockOverflow',
  'blockSize',
  'bottom',
  'clear',
  'contain',
  'content',
  'continue',
  'cursor',
  'direction',
  'display',
  'filter',
  'float',
  'gap',
  'height',
  'inset',
  'isolation',
  'left',
  'letterSpacing',
  'lightingColor',
  'markerSide',
  'mixBlendMode',
  'opacity',
  'order',
  'position',
  'quotes',
  'resize',
  'right',
  'rowGap',
  'tabSize',
  'tableLayout',
  'top',
  'userSelect',
  'verticalAlign',
  'visibility',
  'voiceFamily',
  'volume',
  'whiteSpace',
  'widows',
  'width',
  'zIndex',
  'pointerEvents',
  'aspectRatio'

  /** 非常用 style */
  // 'azimuth',
  // 'backfaceVisibility',
  // 'baselineShift',
  // 'captionSide',
  // 'chains',
  // 'dominantBaseline',
  // 'elevation',
  // 'emptyCells',
  // 'forcedColorAdjust',
  // 'glyphOrientationVertical',
  // 'hangingPunctuation',
  // 'hyphenateCharacter',
  // 'hyphens',
  // 'imageOrientation',
  // 'imageResolution',
  // 'orphans',
  // 'playDuring',
  // 'pointerEvents',
  // 'regionFragment',
  // 'richness',
  // 'running',
  // 'scrollBehavior',
  // 'speechRate',
  // 'stress',
  // 'stringSet',
  // 'unicodeBidi',
  // 'willChange',
  // 'writingMode',
]

// 减少文件体积
function combine (prefix: string, list: string[], excludeSelf?: boolean) {
  !excludeSelf && styleProperties.push(prefix)
  list.forEach(item => {
    styleProperties.push(prefix + item)
    if (prefix === WEBKIT) {
      styleProperties.push('Webkit' + item)
    }
  })
}

const color = 'Color'
const style = 'Style'
const width = 'Width'
const image = 'Image'
const size = 'Size'
const color_style_width = [color, style, width]
const fitlength_fitwidth_image = ['FitLength', 'FitWidth', image]
const fitlength_fitwidth_image_radius = [...fitlength_fitwidth_image, 'Radius']
const color_style_width_fitlength_fitwidth_image = [...color_style_width, ...fitlength_fitwidth_image]
const endRadius_startRadius = ['EndRadius', 'StartRadius']
const bottom_left_right_top = ['Bottom', 'Left', 'Right', 'Top']
const end_start = ['End', 'Start']
const content_items_self = ['Content', 'Items', 'Self']
const blockSize_height_inlineSize_width = ['BlockSize', 'Height', 'InlineSize', width]
const after_before = ['After', 'Before']

combine('borderBlock', color_style_width)
combine('borderBlockEnd', color_style_width)
combine('borderBlockStart', color_style_width)
combine('outline', [...color_style_width, 'Offset'])
combine('border', [...color_style_width, 'Boundary', 'Break', 'Collapse', 'Radius', 'Spacing'])
combine('borderFit', ['Length', width])
combine('borderInline', color_style_width)
combine('borderInlineEnd', color_style_width)
combine('borderInlineStart', color_style_width)
combine('borderLeft', color_style_width_fitlength_fitwidth_image)
combine('borderRight', color_style_width_fitlength_fitwidth_image)
combine('borderTop', color_style_width_fitlength_fitwidth_image)
combine('borderBottom', color_style_width_fitlength_fitwidth_image)
combine('textDecoration', [color, style, 'Line'])
combine('textEmphasis', [color, style, 'Position'])
combine('scrollMargin', bottom_left_right_top)
combine('scrollPadding', bottom_left_right_top)
combine('padding', bottom_left_right_top)
combine('margin', [...bottom_left_right_top, 'Trim'])
combine('scrollMarginBlock', end_start)
combine('scrollMarginInline', end_start)
combine('scrollPaddingBlock', end_start)
combine('scrollPaddingInline', end_start)
combine('gridColumn', end_start)
combine('gridRow', end_start)
combine('insetBlock', end_start)
combine('insetInline', end_start)
combine('marginBlock', end_start)
combine('marginInline', end_start)
combine('paddingBlock', end_start)
combine('paddingInline', end_start)
combine('pause', after_before)
combine('cue', after_before)
combine('mask', ['Clip', 'Composite', image, 'Mode', 'Origin', 'Position', 'Repeat', size, 'Type'])
combine('borderImage', ['Outset', 'Repeat', 'Slice', 'Source', 'Transform', width])
combine('maskBorder', ['Mode', 'Outset', 'Repeat', 'Slice', 'Source', width])
combine('font', ['Family', 'FeatureSettings', 'Kerning', 'LanguageOverride', 'MaxSize', 'MinSize', 'OpticalSizing', 'Palette', size, 'SizeAdjust', 'Stretch', style, 'Weight', 'VariationSettings'])
combine('transform', ['Box', 'Origin', style])
combine('background', [color, image, 'Attachment', 'BlendMode', 'Clip', 'Origin', 'Position', 'Repeat', size])
combine('listStyle', [image, 'Position', 'Type'])
combine('scrollSnap', ['Align', 'Stop', 'Type'])
combine('grid', ['Area', 'AutoColumns', 'AutoFlow', 'AutoRows'])
combine('gridTemplate', ['Areas', 'Columns', 'Rows'])
combine('overflow', ['Block', 'Inline', 'Wrap', 'X', 'Y'])
combine('transition', ['Delay', 'Duration', 'Property', 'TimingFunction'])
combine('color', ['Adjust', 'InterpolationFilters', 'Scheme'])
combine('textAlign', ['All', 'Last'])
combine('page', ['BreakAfter', 'BreakBefore', 'BreakInside'])
combine('animation', ['Delay', 'Direction', 'Duration', 'FillMode', 'IterationCount', 'Name', 'PlayState', 'TimingFunction'])
combine('flex', ['Basis', 'Direction', 'Flow', 'Grow', 'Shrink', 'Wrap'])
combine('offset', [...after_before, ...end_start, 'Anchor', 'Distance', 'Path', 'Position', 'Rotate'])
combine('perspective', ['Origin'])
combine('clip', ['Path', 'Rule'])
combine('flow', ['From', 'Into'])

combine('align', ['Content', 'Items', 'Self'], true)
combine('alignment', ['Adjust', 'Baseline'], true)
combine('borderStart', endRadius_startRadius, true)
combine('borderEnd', endRadius_startRadius, true)
combine('borderCorner', ['Fit', image, 'ImageTransform'], true)
combine('borderTopLeft', fitlength_fitwidth_image_radius, true)
combine('borderTopRight', fitlength_fitwidth_image_radius, true)
combine('borderBottomLeft', fitlength_fitwidth_image_radius, true)
combine('borderBottomRight', fitlength_fitwidth_image_radius, true)
combine('column', ['s', 'Count', 'Fill', 'Gap', 'Rule', 'RuleColor', 'RuleStyle', 'RuleWidth', 'Span', width], true)
combine('break', [...after_before, 'Inside'], true)
combine('wrap', [...after_before, 'Flow', 'Inside', 'Through'], true)
combine('justify', content_items_self, true)
combine('place', content_items_self, true)
combine('max', [...blockSize_height_inlineSize_width, 'Lines'], true)
combine('min', blockSize_height_inlineSize_width, true)
combine('line', ['Break', 'Clamp', 'Grid', 'Height', 'Padding', 'Snap'], true)
combine('inline', ['BoxAlign', size, 'Sizing'], true)
combine('text', ['CombineUpright', 'GroupAlign', 'Height', 'Indent', 'Justify', 'Orientation', 'Overflow', 'Shadow', 'SpaceCollapse', 'SpaceTrim', 'Spacing', 'Transform', 'UnderlinePosition', 'Wrap'], true)
combine('shape', ['ImageThreshold', 'Inside', 'Margin', 'Outside'], true)
combine('word', ['Break', 'Spacing', 'Wrap'], true)
combine('object', ['Fit', 'Position'], true)
combine('box', ['DecorationBreak', 'Shadow', 'Sizing', 'Snap'], true)

combine(WEBKIT, ['LineClamp', 'BoxOrient', 'TextFillColor', 'TextStroke', 'TextStrokeColor', 'TextStrokeWidth'], true)

/** 非常用 style */
// combine('caret', [color, 'Shape'])
// combine('counter', ['Increment', 'Reset', 'Set'], true)
// combine('dropInitial', ['AfterAdjust', 'AfterAlign', 'BeforeAdjust', 'BeforeAlign', size, 'Value'], true)
// combine('flood', [color, 'Opacity'], true)
// combine('footnote', ['Display', 'Policy'], true)
// combine('hyphenateLimit', ['Chars', 'Last', 'Lines', 'Zone'], true)
// combine('initialLetters', ['Align', 'Wrap'])
// combine('ruby', ['Align', 'Merge', 'Position'], true)
// combine('lineStacking', ['Ruby', 'Shift', 'Strategy'])
// combine('bookmark', ['Label', 'Level', 'State'], true)
// combine('speak', ['Header', 'Numeral', 'Punctuation'])
// combine('pitch', ['Range'])
// combine('nav', ['Down', 'Left', 'Right', 'Up'], true)
// combine('fontSynthesis', ['SmallCaps', style, 'Weight'])
// combine('fontVariant', ['Alternates', 'Caps', 'EastAsian', 'Emoji', 'Ligatures', 'Numeric', 'Position'])

export { styleProperties }
