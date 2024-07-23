import { TaroStylelintConfig } from './type'

const config: TaroStylelintConfig = {
  // 禁止的选择器集合
  disAllowedSelectors: {
    'selector-max-id': 0, // 允许的最大id选择器数量
    'selector-max-combinators': 0, // 允许的最大组合选择器数量
    'selector-max-type': 0, // 允许的最大类型选择器数量
    'selector-max-attribute': 0, // 允许的最大属性选择器数量
    'selector-max-universal': 0, // 允许的最大通配符选择器数量
    'selector-pseudo-class-allowed-list': ['export', 'root'], // 允许的伪类选择器
  },

  // 支持的属性列表
  supportedProperties: {},
  // 关联的插件
  plugins: [
    'stylelint-taro'
  ],
  // 通用规则
  rules: {
    'value-no-vendor-prefix': true, // 禁止属性值前缀
    'property-no-vendor-prefix': true, // 禁止属性前缀
    'at-rule-allowed-list': [], // 允许的at规则
    'color-named': ['never'], // 禁止使用命名颜色
    'declaration-no-important': true, // 禁止使用!important
    'unit-allowed-list': ['px', 'rem', 'deg', '%', 'vh', 'vw', 'vmin', 'vmax', 's'], // 允许的单位
  }
}

export default config
