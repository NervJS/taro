import cssPropertyNoUnknown from './css-property-no-unknown'
import fontWeightNoIgnoredValues from './font-weight-no-ignored-values'
import lineHeightNoValueWithoutUnit from './line-height-no-value-without-unit'
import stylePropertyNoUnknown from './style-property-no-unknown'

export default {
  'font-weight-no-ignored-values': fontWeightNoIgnoredValues,
  'css-property-no-unknown': cssPropertyNoUnknown,
  'style-property-no-unknown': stylePropertyNoUnknown,
  'line-height-no-value-without-unit': lineHeightNoValueWithoutUnit
}
