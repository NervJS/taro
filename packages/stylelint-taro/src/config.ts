import _ from 'lodash'
import stylelint from 'stylelint'

import h5 from './platform/h5'
import harmony from './platform/harmony'
import miniprogram from './platform/miniprogram'
import rn from './platform/rn'
import { TaroStylelintConfig } from './platform/type'

type PlatformType = 'h5' | 'miniprogram' | 'harmony' | 'rn'

// 合并平台规则成并集
function mergeRule (platforms) {
  const rules = {}

  // 合并选择器
  platforms.forEach(({ config: platform }) => {
    if (platform.disAllowedSelectors) {
      Object.keys(platform.disAllowedSelectors).forEach(ruleName => {
        const rule = platform.disAllowedSelectors[ruleName]
        if (rules[ruleName]) {
          if (rule instanceof Array) {
            rules[ruleName] = _.intersection(rules[ruleName], rule)
          } else {
            rules[ruleName] = _.merge(rules[ruleName], rule)
          }
        } else {
          rules[ruleName] = rule
        }
      })
    }
  })

  // 支持的属性列表
  let supportPropertiesCheck = false
  const properties = {}
  platforms.forEach(({ name, config }) => {
    if (config.supportedProperties) {
      if (['harmony', 'rn'].includes(name)) {
        supportPropertiesCheck = true
      }
      properties[name] = { ...config.supportedProperties }
    }
  })

  // 只有harmony和rn支持
  if (supportPropertiesCheck) {
    // rules['taro/no-nested-selectors'] = true
    rules['taro/property-allowed-list'] = properties
    rules['taro/declaration-property-value-allowed-list'] = properties
  }

  // 合并规则
  platforms.forEach(({ config }) => {
    if (config.rules) {
      Object.keys(config.rules).forEach(ruleName => {
        const rule = config.rules[ruleName]

        if (rules[ruleName]) {
          if (rule instanceof Array) {
            rules[ruleName] = _.intersection(rules[ruleName], rule)
          } else if (rule instanceof Boolean) {
            rules[ruleName] = rules[ruleName] || rule
          } else {
            rules[ruleName] = rule
          }
        } else {
          rules[ruleName] = rule
        }
      })
    }
  })
  Object.keys(rules).forEach(ruleName => {
    rules[ruleName] = [
      rules[ruleName],
      {
        severity: 'warning'
      }
    ]
  })

  return rules
}

const ruleMap = { harmony, rn, miniprogram, h5 }

// 根据平台生成规则
function taroRules(platforms: PlatformType[] = []) {
  return mergeRule(platforms.map((platform) => ({
    name: platform,
    config: ruleMap[platform]
  })))
}

function getPlatformConfigs (platforms: PlatformType[]): TaroStylelintConfig[] {
  return platforms.map((platform) => ruleMap[platform]).filter(Boolean)
}

// 到处合并配置的方法
module.exports = function mergeConfig(platforms: PlatformType[], stylelintConfig: stylelint.Config): stylelint.Config {
  // 注入环境变量
  process.env.__PLATFORMS__ = platforms.join(',')

  // 插件合并
  let plugins = stylelintConfig.plugins || []
  const platformConfigs = getPlatformConfigs(platforms)
  platformConfigs.forEach((platform) => {
    if (platform.plugins) {
      if (plugins instanceof Array) {
        if (platform.plugins instanceof Array) {
          plugins.push(...platform.plugins)
        } else {
          plugins.push(platform.plugins)
        }
      } else {
        if (platform.plugins instanceof Array) {
          plugins = [plugins, ...platform.plugins]
        } else {
          plugins = [plugins, platform.plugins]
        }
      }
    }
  })

  return {
    ...stylelintConfig,
    plugins,
    rules: {
      ...taroRules(platforms),
      ...stylelintConfig.rules,
    },
  }
}
