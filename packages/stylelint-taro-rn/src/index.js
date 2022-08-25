import { createPlugin } from 'stylelint'

import rules from './rules'
import { namespace } from './utils'

const rulesPlugins = Object.keys(rules).map((ruleName) => {
  return createPlugin(namespace(ruleName), rules[ruleName])
})

export default rulesPlugins
