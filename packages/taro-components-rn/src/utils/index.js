import {
  StyleSheet
} from 'react-native'

// @see https://facebook.github.io/react-native/docs/layout-props.html
// @see https://facebook.github.io/react-native/docs/view-style-props.html

const WRAPPER_TYPE_STYLE = [
  'alignSelf',
  'aspectRatio',
  'borderBottomWidth',
  'borderEndWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderStartWidth',
  'borderTopWidth',
  'borderWidth',
  'bottom',
  'direction',
  'display',
  'end',
  'left',
  'margin',
  'marginBottom',
  'marginEnd',
  'marginHorizontal',
  'marginLeft',
  'marginRight',
  'marginStart',
  'marginTop',
  'marginVertical',
  'position',
  'right',
  'start',
  'top',
  'zIndex',
  // View Style Props
  'borderRightColor',
  'backfaceVisibility',
  'borderBottomColor',
  'borderBottomEndRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderBottomStartRadius',
  'borderBottomWidth',
  'borderColor',
  'borderEndColor',
  'borderLeftColor',
  'borderLeftWidth',
  'borderRadius',
  'backgroundColor',
  'borderRightWidth',
  'borderStartColor',
  'borderStyle',
  'borderTopColor',
  'borderTopEndRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderTopStartRadius',
  'borderTopWidth',
  'borderWidth',
  'opacity',
  'elevation',
]
const INNER_TYPE_STYLE = [
  'alignContent',
  'alignItems',
  'flexDirection',
  'flexWrap',
  'height',
  'justifyContent',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'overflow',
  'padding',
  'paddingBottom',
  'paddingEnd',
  'paddingHorizontal',
  'paddingLeft',
  'paddingRight',
  'paddingStart',
  'paddingTop',
  'paddingVertical',
  'width',
]
const SYNC_TYPE_STYLE = [
  'flex',
  'flexBasis',
  'flexGrow',
  'flexShrink',
]

export const omit = function (obj = {}, fields = []) {
  const shallowCopy = { ...obj }
  fields.forEach((key) => {
    delete shallowCopy[key]
  })
  return shallowCopy
}

export const dismemberStyle = function (style) {
  const flattenStyle = StyleSheet.flatten(style)
  const wrapperStyle = {}
  const innerStyle = {}
  Object.keys(flattenStyle).forEach((key) => {
    if (SYNC_TYPE_STYLE.indexOf(key) >= 0) {
      wrapperStyle[key] = flattenStyle[key]
      innerStyle[key] = flattenStyle[key]
    } else if (WRAPPER_TYPE_STYLE.indexOf(key) >= 0) {
      wrapperStyle[key] = flattenStyle[key]
    } else {
      innerStyle[key] = flattenStyle[key]
    }
  })
  return {
    wrapperStyle,
    innerStyle
  }
}

export default {
  omit,
  dismemberStyle
}
