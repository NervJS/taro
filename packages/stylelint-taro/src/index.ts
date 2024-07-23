import stylelint from 'stylelint'

import rules from './rules/index.ts'
import { nameSpace } from './utils/index.ts'

const rulesPlugins = Object.keys(rules).map(ruleName => {
  return stylelint.createPlugin(nameSpace(ruleName), rules[ruleName])
})

export default rulesPlugins
