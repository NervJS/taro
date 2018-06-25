import {
  StyleSheet
} from 'react-native'

// @see https://facebook.github.io/react-native/docs/layout-props.html
// @see https://facebook.github.io/react-native/docs/view-style-props.html
// @todo According to the source code of ScrollView, ['alignItems','justifyContent'] should be set to contentContainerStyle

const WRAPPER_TYPE_STYLE_REGEX = /alignSelf|aspectRatio|border.*|bottom|direction|display|end|left|margin.*|position|right|start|top|zIndex|opacity|elevation/
// const INNER_TYPE_STYLE_REGEX = /alignContent|alignItems|flexDirection|flexWrap|height|justifyContent|.*[wW]idth|.*[hH]eight|overflow|padding.*/
const SYNC_TYPE_STYLE_REGEX = /flex|flexBasis|flexGrow|flexShrink/

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
  if (flattenStyle) {
    Object.keys(flattenStyle).forEach((key) => {
      if (SYNC_TYPE_STYLE_REGEX.test(key)) {
        wrapperStyle[key] = flattenStyle[key]
        innerStyle[key] = flattenStyle[key]
      } else if (WRAPPER_TYPE_STYLE_REGEX.test(key)) {
        wrapperStyle[key] = flattenStyle[key]
      } else {
        innerStyle[key] = flattenStyle[key]
      }
    })
  }
  return {
    wrapperStyle,
    innerStyle
  }
}

/**
 * Parses a string of inline styles into a javascript object with casing for react
 *
 * @param {string} styles
 * @returns {Object}
 */
export const parseStyles = function (styles = '') {
  return styles
    .split(';')
    .filter((style) => style.split(':').length === 2)
    .map((style) => [
      style.split(':')[0].trim().replace(/-./g, c => c.substr(1).toUpperCase()),
      style.split(':')[1].trim()
    ])
    .reduce((styleObj, style) => ({
      ...styleObj,
      [style[0]]: style[1],
    }), {})
}

export const noop = function () {}

export default {
  omit,
  dismemberStyle,
  parseStyles,
  noop,
}
