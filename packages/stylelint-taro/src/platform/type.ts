import type { CustomSyntax } from 'stylelint'
import type stylelint from 'stylelint'

type ConfigRules = {
  [ruleName: string]: stylelint.ConfigRuleSettings<any, Object>
}

type ConfigPlugins = string | stylelint.Plugin | (string | stylelint.Plugin)[]

export interface TaroStylelintConfig {
  disAllowedSelectors?: ConfigRules
  supportedProperties?: ConfigRules
  rules?: ConfigRules
  plugins?: ConfigPlugins
  customSyntax?: CustomSyntax
}
