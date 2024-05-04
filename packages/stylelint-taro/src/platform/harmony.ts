import { BACKGROUND_IMAGE, LENGTH_REGEX, LENGTH_REGEX_SPLIT, NUMBER } from './constrant'
import { TaroStylelintConfig } from './type'

const config: TaroStylelintConfig = {
  // 禁止的选择器集合
  disAllowedSelectors: {
    'selector-max-id': 0, // 允许的最大id选择器数量
    'selector-max-type': 0, // 允许的最大类型选择器数量
    'selector-max-attribute': 0, // 允许的最大属性选择器数量
    'selector-max-universal': 0, // 允许的最大通配符选择器数量
    'selector-pseudo-class-allowed-list': ['before', 'after'], // 允许的伪类选择器
    'selector-combinator-allowed-list': ['>', ' '], // 允许的组合选择器
  },
  // 支持的属性列表
  supportedProperties: {
    margin: [LENGTH_REGEX_SPLIT],
    'margin-top': [LENGTH_REGEX],
    'margin-right': [LENGTH_REGEX],
    'margin-bottom': [LENGTH_REGEX],
    'margin-left': [LENGTH_REGEX],
    padding: [LENGTH_REGEX_SPLIT],
    'padding-top': [LENGTH_REGEX],
    'padding-right': [LENGTH_REGEX],
    'padding-bottom': [LENGTH_REGEX],
    'padding-left': [LENGTH_REGEX],
    width: [LENGTH_REGEX],
    height: [LENGTH_REGEX],
    'min-width': [LENGTH_REGEX],
    'min-height': [LENGTH_REGEX],
    'max-width': [LENGTH_REGEX],
    'max-height': [LENGTH_REGEX],
    background: true,
    'background-color': true,
    'background-image': [BACKGROUND_IMAGE],
    'background-size': ['cover', 'contain', LENGTH_REGEX_SPLIT],
    'background-position': ['center', 'top', 'bottom', 'left', 'right', LENGTH_REGEX_SPLIT],
    'background-repeat': ['repeat', 'no-repeat', 'repeat-x', 'repeat-y'],
    border: true,
    'border-top': true,
    'border-right': true,
    'border-bottom': true,
    'border-left': true,
    'border-color': true,
    'border-top-color': true,
    'border-right-color': true,
    'border-bottom-color': true,
    'border-left-color': true,
    'border-radius': [LENGTH_REGEX_SPLIT],
    'border-top-left-radius': [LENGTH_REGEX],
    'border-top-right-radius': [LENGTH_REGEX],
    'border-bottom-left-radius': [LENGTH_REGEX],
    'border-bottom-right-radius': [LENGTH_REGEX],
    'border-style': true,
    'border-top-style': true,
    'border-right-style': true,
    'border-bottom-style': true,
    'border-left-style': true,
    'border-width': [LENGTH_REGEX_SPLIT],
    'border-top-width': [LENGTH_REGEX],
    'border-right-width': [LENGTH_REGEX],
    'border-bottom-width': [LENGTH_REGEX],
    'border-left-width': [LENGTH_REGEX],
    'font-size': [LENGTH_REGEX],
    'font-family': true,
    'font-style': ['normal', 'italic'],
    'font-weight': ['normal', 'bold', 'bolder', NUMBER],
    'line-height': [LENGTH_REGEX],
    'text-align': ['center', 'left', 'right'],
    color: true,
    'text-decoration': ['none', 'underline', 'line-through', 'overline'],
    'text-overflow': ['ellipsis', 'clip'],
    display: ['flex', 'block', 'none'],
    flex: true,
    'flex-direction': ['row', 'row-reverse', 'column', 'column-reverse'],
    'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    'align-items': ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    'align-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
    'flex-grow': [NUMBER],
    'flex-shrink': [NUMBER],
    'flex-basis': [LENGTH_REGEX, 'auto'],
    'align-self': ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    position: ['absolute', 'relative', 'fixed'],
    top: [LENGTH_REGEX],
    left: [LENGTH_REGEX],
    'z-index': [NUMBER],
    overflow: ['hidden', 'visible', 'auto'],
    opacity: [NUMBER],
    transform: true,
    'transform-origin': true,
    '-webkit-line-clamp': [NUMBER]
  },
  // 关联的插件
  plugins: [
    'stylelint-taro',
  ],
  // 通用规则
  rules: {
    'value-no-vendor-prefix': true, // 禁止属性值前缀
    'property-no-vendor-prefix': true, // 禁止属性前缀
    'at-rule-allowed-list': [], // 允许的at规则
    'color-named': ['never'], // 禁止使用命名颜色
    'declaration-no-important': false, // 禁止使用!important
    'unit-allowed-list': ['px', 'deg', '%', 'vh', 'vw', 's', 'rem'], // 允许的单位
    'function-disallowed-list': ['min', 'max', 'clamp'], // 禁止的函数
  }
}

export default config
