import { createPlugin } from 'stylelint'

import rules from './rules'
import { nameSpace } from './utils'

const rulesPlugins = Object.keys(rules).map(ruleName => {
  return createPlugin(nameSpace(ruleName), rules[ruleName])
})

export default rulesPlugins
