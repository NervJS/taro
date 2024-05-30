import { ConfigPlugins, ConfigRules, CustomSyntax } from 'stylelint'

export interface TaroStylelintConfig {
  disAllowedSelectors?: ConfigRules
  supportedProperties?: ConfigRules
  rules?: ConfigRules
  plugins?: ConfigPlugins
  customSyntax?: CustomSyntax
}
